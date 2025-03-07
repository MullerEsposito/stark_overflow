use stark_overflow::structs::{Question, Answer, QuestionStatus};
use stark_overflow::types::{QuestionId, AnswerId};
use stark_overflow::mock_contracts::MockSTARKToken::{IERC20Dispatcher, IERC20DispatcherTrait};
// use starknet::ContractAddress;

#[starknet::interface]
pub trait IStarkOverflow<T> {
    fn askQuestion(ref self: T, description: ByteArray, value: u256) -> QuestionId;
    fn getQuestion(self: @T, question_id: u256) -> Question;
    fn addFundsToQuestion(ref self: T, question_id: u256, value: u256);
    fn submitAnswer(ref self: T, question_id: u256, description: ByteArray) -> AnswerId;
    fn getAnswer(self: @T, answer_id: u256) -> Answer;
    fn markAnswerAsCorrect(ref self: T, question_id: u256, answer_id: u256);
    fn getCorrectAnswer(self: @T, question_id: u256) -> AnswerId;
    // fn getCallerAddress(self: @T) -> ContractAddress; // This is just for testing purposes
}

#[starknet::contract]
pub mod StarkOverflow {
    use super::{Question, Answer, QuestionStatus, QuestionId, AnswerId, IStarkOverflow};
    use super::{IERC20Dispatcher, IERC20DispatcherTrait};
    use starknet::{get_caller_address, ContractAddress, get_contract_address};
    use starknet::storage::{StoragePointerReadAccess, StoragePointerWriteAccess, StoragePathEntry, Map};
    use openzeppelin::access::ownable::OwnableComponent;
    use stark_overflow::events::{QuestionAnswered, ChosenAnswer};

    component!(path: OwnableComponent, storage: ownable, event: OwnableEvent);

    #[abi(embed_v0)]
    impl OwnableMixinImpl = OwnableComponent::OwnableMixinImpl<ContractState>;
    impl InternalImpl = OwnableComponent::InternalImpl<ContractState>;

    #[event]
    #[derive(Drop, starknet::Event)]
    pub enum Event {
        QuestionAnswered: QuestionAnswered,
        ChosenAnswer: ChosenAnswer,
        #[flat]
        OwnableEvent: OwnableComponent::Event,
    }

    #[storage]
    struct Storage {
        questions: Map<u256, Question>,
        last_question_id: u256,
        answers: Map<u256, Answer>,
        last_answer_id: u256,
        questionIdAnswerId: Map<u256, u256>,
        stark_token_dispatcher: IERC20Dispatcher,
        #[substorage(v0)]
        ownable: OwnableComponent::Storage,
    }

    #[constructor]
    fn constructor(
        ref self: ContractState,
        stark_contract_address: ContractAddress,
    ) {
        self.ownable.initializer(get_contract_address());
        self.stark_token_dispatcher.write(IERC20Dispatcher { contract_address: stark_contract_address});
    }

    #[abi(embed_v0)]
    impl StarkOverflow of super::IStarkOverflow<ContractState> {
        fn askQuestion(ref self: ContractState, description: ByteArray, value: u256) -> QuestionId {
            let caller = get_caller_address();
            let question_id = self.last_question_id.read() + 1;
            let _question = Question { id: question_id, author: caller, description, value, status: QuestionStatus::Open };
            self._stark_token_dispatcher().transferFrom(caller, self.ownable.owner(), value);
            
            self.questions.entry(question_id).write(_question);
            question_id
        }

        fn getQuestion(self: @ContractState, question_id: u256) -> Question {
            let found_question = self.questions.entry(question_id).read();
            found_question
        }

        fn addFundsToQuestion(ref self: ContractState, question_id: u256, value: u256) {
            let mut found_question = self.questions.entry(question_id).read();
            found_question.value += value;
            self._stark_token_dispatcher().transferFrom(get_caller_address(), self.ownable.owner(), value);

            self.questions.entry(question_id).write(found_question);
        }

        fn submitAnswer(ref self: ContractState, question_id: u256, description: ByteArray) -> AnswerId {
            let caller = get_caller_address();
            let answer_id = self.last_answer_id.read() + 1;
            let answer = Answer { id: answer_id, author: caller, description, question_id };

            self.answers.entry(answer_id).write(answer);

            answer_id
        }

        fn getAnswer(self: @ContractState, answer_id: u256) -> Answer {
            let found_answer = self.answers.entry(answer_id).read();
            found_answer
        }

        fn markAnswerAsCorrect(ref self: ContractState, question_id: u256, answer_id: u256) {
            let caller = get_caller_address();
            let question_author = self.getQuestion(question_id).author;

            assert!(caller == question_author, "Only the author of the question can mark the answer as correct");

            let found_answer = self.getAnswer(answer_id);
            assert!(found_answer.question_id == question_id, "The specified answer does not exist for this question");

            let found_question = self.questions.entry(question_id).read();
            assert!(found_question.status == QuestionStatus::Open, "The question is already resolved");

            self.questions.entry(question_id).write(Question { status: QuestionStatus::Resolved, ..found_question });
            self.questionIdAnswerId.entry(question_id).write(answer_id);

            self._transferFundsToCorrectAnswerAuthor(question_id);
        }

        fn getCorrectAnswer(self: @ContractState, question_id: u256) -> AnswerId {
            let found_corret_answer_id = self.questionIdAnswerId.entry(question_id).read();
            found_corret_answer_id
        }

        // fn getCallerAddress(self: @ContractState) -> ContractAddress {
        //     get_caller_address()
        // }

    }
    
    #[generate_trait]
    impl InternalFunctions of InternalFunctionsTrait {
        fn _transferFundsToCorrectAnswerAuthor(ref self: ContractState, question_id: u256) {
            let question = self.getQuestion(question_id);
            assert!(question.status == QuestionStatus::Resolved, "The question is not resolved yet");
            
            let correct_answer_id = self.getCorrectAnswer(question_id);
            let correct_answer = self.getAnswer(correct_answer_id);
            self._stark_token_dispatcher().transfer(correct_answer.author, question.value);
        }        
        
        fn _stark_token_dispatcher(self: @ContractState) -> IERC20Dispatcher {
            self.stark_token_dispatcher.read()
        }
    }
}
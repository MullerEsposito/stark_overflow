use stark_overflow::structs::{Question, Answer, QuestionStatus};
use stark_overflow::types::{QuestionId, AnswerId};
use stark_overflow::StarkOverflowToken::{IStarkOverflowTokenDispatcher, IStarkOverflowTokenDispatcherTrait};
use starknet::ContractAddress;

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
    use super::{IStarkOverflowTokenDispatcher, IStarkOverflowTokenDispatcherTrait};
    use starknet::{get_caller_address, ContractAddress};
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
        governance_token_dispatcher: IStarkOverflowTokenDispatcher,
        #[substorage(v0)]
        ownable: OwnableComponent::Storage,
    }

    #[constructor]
    fn constructor(
        ref self: ContractState,
        governance_token_address: ContractAddress,
    ) {
        self.ownable.initializer(get_caller_address());
        self.governance_token_dispatcher.write(IStarkOverflowTokenDispatcher { contract_address: governance_token_address});
    }

    #[abi(embed_v0)]
    impl StarkOverflow of super::IStarkOverflow<ContractState> {
        fn askQuestion(ref self: ContractState, description: ByteArray, value: u256) -> QuestionId {
            let caller = get_caller_address();
            let question_id = self.last_question_id.read() + 1;
            let _question = Question { id: question_id, author: caller, description, value, status: QuestionStatus::Open };
            
            // Use stake_on_question instead of transferFrom
            self._governance_token_dispatcher().stake_on_question(question_id, value);
            
            self.questions.entry(question_id).write(_question);
            self.last_question_id.write(question_id);
            
            question_id
        }

        fn getQuestion(self: @ContractState, question_id: u256) -> Question {
            let found_question = self.questions.entry(question_id).read();
            found_question
        }

        fn addFundsToQuestion(ref self: ContractState, question_id: u256, value: u256) {
            let mut found_question = self.questions.entry(question_id).read();
            found_question.value += value;
            
            // Use stake_on_question to add more funds
            self._governance_token_dispatcher().stake_on_question(question_id, value);

            self.questions.entry(question_id).write(found_question);
        }

        fn submitAnswer(ref self: ContractState, question_id: u256, description: ByteArray) -> AnswerId {
            let caller = get_caller_address();
            let answer_id = self.last_answer_id.read() + 1;
            let answer = Answer { id: answer_id, author: caller, description, question_id };

            self.answers.entry(answer_id).write(answer);
            self.last_answer_id.write(answer_id);

            // Emit event with all required fields
            self.emit(QuestionAnswered { 
                id: answer_id, 
                question_id, 
                answer_id, 
                date: starknet::get_block_timestamp().into(), 
            });
            
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
            
            // Emit event with all required fields
            self.emit(ChosenAnswer { 
                id: answer_id, 
                question_id, 
                answer_id,
                author_address: found_answer.author, 
                date: starknet::get_block_timestamp().into(), 
            });

            // Distribute rewards through the governance token
            self._governance_token_dispatcher().distribute_rewards(question_id, answer_id);
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
        fn _governance_token_dispatcher(self: @ContractState) -> IStarkOverflowTokenDispatcher {
            self.governance_token_dispatcher.read()
        }
    }
}
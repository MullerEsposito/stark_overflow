use stark_overflow::structs::{Question, Answer, QuestionStatus, Forum};
use stark_overflow::types::{QuestionId, AnswerId};
use stark_overflow::StarkOverflowToken::{IStarkOverflowTokenDispatcher, IStarkOverflowTokenDispatcherTrait};
use starknet::ContractAddress;

#[starknet::interface]
pub trait IStarkOverflow<T> {
  // Forums
  fn create_forum(ref self: T, name: ByteArray, icon_url: ByteArray);
  fn get_forums(self: @T) -> Array<Forum>;

  // Questions
  fn ask_question(ref self: T, forum_id: u256, title: ByteArray, description: ByteArray, repository_url: ByteArray, tags: Vec<ByteArray>, value: u256) -> QuestionId;
  fn get_question(self: @T, question_id: u256) -> Question;
  fn stake_on_question(ref self: T, question_id: u256, amount: u256);
  fn get_total_staked_on_question(self: @T, question_id: u256) -> u256;
  fn get_staked_amount(self: @T, staker: ContractAddress, question_id: u256) -> u256;
  
  // Answers
  fn submit_answer(ref self: T, question_id: u256, description: ByteArray) -> AnswerId;
  fn get_answer(self: @T, answer_id: u256) -> Answer;
  fn get_answers(self: @T, question_id: u256) -> Array<Answer>;
  fn mark_answer_as_correct(ref self: T, question_id: u256, answer_id: u256);
  fn get_correct_answer(self: @T, question_id: u256) -> AnswerId;  

  // Reputation system
  fn add_reputation(ref self: T, user: ContractAddress, amount: u256);
  fn get_reputation(self: @T, user: ContractAddress) -> u256;

  // Staking Functions
  fn stake(ref self: T, amount: u256);
  fn withdraw_stake(ref self: T);
  fn get_claimable_rewards(self: @T, staker: ContractAddress) -> u256;
  fn get_stake_info(self: @T, staker: ContractAddress) -> (u256, u64, u256);  
}

#[starknet::contract]
pub mod StarkOverflow {
  use super::{Question, Answer, QuestionStatus, QuestionId, AnswerId, IStarkOverflow};
  use super::{IERC20Dispatcher, IERC20DispatcherTrait};
  use starknet::{get_caller_address, get_contract_address, ContractAddress};
  use starknet::storage::{StoragePointerReadAccess, StoragePointerWriteAccess, StoragePathEntry, Map, Vec, VecTrait, MutableVecTrait};
  use openzeppelin::access::ownable::OwnableComponent;
  use openzeppelin_token::erc20::{ERC20Component, ERC20HooksEmptyImpl};
  use stark_overflow::events::{QuestionAnswered, ChosenAnswer, QuestionStaked, ReputationAdded, StakeStarted, StakeWithdrawn};

  component!(path: ERC20Component, storage: erc20, event: ERC20Event);
  component!(path: OwnableComponent, storage: ownable, event: OwnableEvent);
  
  #[abi(embed_v0)]
  impl OwnableMixinImpl = OwnableComponent::OwnableMixinImpl<ContractState>;
  impl InternalImpl = OwnableComponent::InternalImpl<ContractState>;
  impl ERC20Impl = ERC20Component::ERC20Impl<ContractState>;   
    #[event]
  #[derive(Drop, starknet::Event)]
  pub enum Event {
    QuestionAnswered: QuestionAnswered,
    QuestionStaked: QuestionStaked,
    ChosenAnswer: ChosenAnswer,
    ReputationAdded: ReputationAdded,
    StakeStarted: StakeStarted,
    StakeWithdrawn: StakeWithdrawn,
    #[flat]
    OwnableEvent: OwnableComponent::Event,
    #[flat]
    ERC20Event: ERC20Component::Event,
  }

  #[storage]
  struct Storage {
    // Forums
    forums: Map<u256, Forum>, // forum_id -> forum
    last_forum_id: u256,
    
    // Questions
    questions: Map<u256, Question>, // question_id -> question
    questions_ids_by_forum_id: Map<u256, Vec<u256>>, // forum_id -> questions ids
    question_stake_by_user: Map<(ContractAddress, u256), u256>, // (user, question_id) -> amount
    question_total_staked: Map<u256, u256>, // question_id -> total staked
    last_question_id: u256,
    
    // Answers
    answers: Map<u256, Answer>, // answer_id -> answer
    answers_ids_by_question_id: Map<u256, Vec<u256>>, // question_id -> answers ids
    chosen_answer: Map<u256, u256>, // question_id -> chosen answer id
    last_answer_id: u256,

    // Reputation
    reputation: Map<ContractAddress, u256>,    
    
    // Token dispatcher
    stark_token_dispatcher: IERC20Dispatcher,

    #[substorage(v0)]
    ownable: OwnableComponent::Storage,
    #[substorage(v0)]
    erc20: ERC20Component::Storage,
  }

  #[constructor]
  fn constructor(ref self: ContractState) {
    self.ownable.initializer(get_caller_address());
    self.stark_token_dispatcher.write(IERC20Dispatcher { contract_address: "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d" });
  }

  #[abi(embed_v0)]
  impl StarkOverflow of super::IStarkOverflow<ContractState> {
    fn create_forum(ref self: ContractState, name: ByteArray, icon_url: ByteArray) {
      self.ownable.assert_only_owner();

      let forum_id = self.last_forum_id.read() + 1;
      let forum = Forum { id: forum_id, name, icon_url, amount: 0, total_questions: 0 };

      self.forums.entry(forum_id).write(forum);
      self.last_forum_id.write(forum_id);
    }

    fn get_forums(self: @ContractState) -> Array<Forum> {
      let mut forums = array![];
      let forums_ids = self.forums.keys();

      for i in 0..forums_ids.len() {
        let forum_id = forums_ids.at(i).read();
        let forum = self.forums.entry(forum_id).read();
        forums.append(forum);
      };

      forums
    }

    fn ask_question(ref self: ContractState, forum_id: u256, title: ByteArray, description: ByteArray, repository_url: ByteArray, tags: Vec<ByteArray>, amount: u256) -> QuestionId {
      let caller = get_caller_address();
      let question_id = self.last_question_id.read() + 1;
      let question = Question { 
        id: question_id, 
        forum_id, 
        title,
        author: caller, 
        description, 
        amount, 
        repository_url, 
        tags,
        status: QuestionStatus::Open, 
      };
      
      self.stake_on_question(question_id, amount);
      
      self.questions.entry(question_id).write(question);
      self.last_question_id.write(question_id);
      self.questions_ids_by_forum_id.entry(forum_id).append(question_id);
      
      question_id
    }

    fn get_question(self: @ContractState, question_id: u256) -> Question {
      let found_question = self.questions.entry(question_id).read();
      found_question
    }

    fn get_answers(self: @ContractState, question_id: u256) -> Array<Answer> {
      let found_question = self.questions.entry(question_id).read();
      assert!(found_question.id == question_id, "Question does not exist");

      let mut answers = array![];
      let answers_ids = self.answers_ids_by_question_id.entry(question_id);

      for i in 0..answers_ids.len() {
        let answer_id = answers_ids.at(i).read();
        let answer = self.answers.entry(answer_id).read();
        answers.append(answer);
      };

      answers
    }

    fn submit_answer(ref self: ContractState, question_id: u256, description: ByteArray) -> AnswerId {
      let caller = get_caller_address();
      let answer_id = self.last_answer_id.read() + 1;
      let answer = Answer { id: answer_id, author: caller, description, question_id };

      self.answers.entry(answer_id).write(answer);
      self.last_answer_id.write(answer_id);

      let answers_ids = self.answers_ids_by_question_id.entry(question_id);
      answers_ids.append().write(answer_id);

      // Emit event with all required fields
      self.emit(QuestionAnswered { 
        id: answer_id, 
        question_id, 
        answer_id, 
        date: starknet::get_block_timestamp().into(), 
      });
      
      answer_id
    }

    fn get_answer(self: @ContractState, answer_id: u256) -> Answer {
      let found_answer = self.answers.entry(answer_id).read();
      found_answer
    }

    fn mark_answer_as_correct(ref self: ContractState, question_id: u256, answer_id: u256) {
      let caller = get_caller_address();
      let question_author = self.get_question(question_id).author;

      assert!(caller == question_author, "Only the author of the question can mark the answer as correct");
      assert!(caller == question_author, "Only the author of the question can mark the answer as correct");

      let found_answer = self.get_answer(answer_id);
      assert!(found_answer.question_id == question_id, "The specified answer does not exist for this question");
      let found_answer = self.get_answer(answer_id);
      assert!(found_answer.question_id == question_id, "The specified answer does not exist for this question");

      let found_question = self.questions.entry(question_id).read();
      assert!(found_question.status == QuestionStatus::Open, "The question is already resolved");
      let found_question = self.questions.entry(question_id).read();
      assert!(found_question.status == QuestionStatus::Open, "The question is already resolved");

      self.questions.entry(question_id).write(Question { status: QuestionStatus::Resolved, ..found_question });
      self.chosen_answer.entry(question_id).write(answer_id);
      
      // Emit event with all required fields
      self.emit(ChosenAnswer { 
          id: answer_id, 
          question_id, 
          answer_id,
          author_address: found_answer.author, 
          date: starknet::get_block_timestamp().into(), 
      });

      // Distribute rewards through the governance token
      self.distribute_rewards(question_id, answer_id);
    }

    fn get_correct_answer(self: @ContractState, question_id: u256) -> AnswerId {
      let found_correct_answer_id = self.chosen_answer.entry(question_id).read();
      found_correct_answer_id
    }
      
    fn stake_on_question(ref self: ContractState, question_id: u256, amount: u256) {
      let caller = get_caller_address();
      let mut found_question = self.questions.entry(question_id).read();
      found_question.amount += amount;
      
      assert(amount > 0, 'Amount must be greater than 0');
      
      // Transfer tokens from caller to contract
      let this_contract = get_contract_address();
      self.stark_token_dispatcher().transfer_from(caller, this_contract, amount);
      
      // Update question staking records
      let current_stake = self.question_stakes.read((caller, question_id));
      let new_stake = current_stake + amount;
      self.question_stakes.write((caller, question_id), new_stake);
      
      // Update total staked for question
      let total_staked = self.total_question_stakes.read(question_id);
      self.total_question_stakes.write(question_id, total_staked + amount);
      self.questions.entry(question_id).write(found_question);
      
      self.emit(QuestionStaked { staker: caller, question_id, amount });
    }

    fn get_total_staked_on_question(self: @ContractState, question_id: u256) -> u256 {
      self.total_question_stakes.read(question_id)
    }

    fn get_staked_amount(self: @ContractState, staker: ContractAddress, question_id: u256) -> u256 {
      self.question_stakes.read((staker, question_id))
    }    
  }
  
  #[generate_trait]
  impl InternalFunctions of InternalFunctionsTrait {     
    fn distribute_rewards(ref self: ContractState, question_id: u256, answer_id: u256) {
      let found_answer = self.get_answer(answer_id);
      let answer_author = found_answer.author;

      let total_staked = self.get_total_staked_on_question(question_id);
      
      self.stark_token_dispatcher().transfer(answer_author, total_staked);
    }
  }
}
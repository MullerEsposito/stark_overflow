use stark_overflow::structs::{Question, Answer, QuestionStatus};
use stark_overflow::types::{QuestionId, AnswerId};
use stark_overflow::StarkOverflowToken::{IStarkOverflowTokenDispatcher, IStarkOverflowTokenDispatcherTrait};
use starknet::ContractAddress;

#[starknet::interface]
pub trait IStarkOverflow<T> {
  fn ask_question(ref self: T, description: ByteArray, value: u256) -> QuestionId;
  fn get_question(self: @T, question_id: u256) -> Question;
  fn add_funds_to_question(ref self: T, question_id: u256, value: u256);
  fn submit_answer(ref self: T, question_id: u256, description: ByteArray) -> AnswerId;
  fn get_answer(self: @T, answer_id: u256) -> Answer;
  fn get_answers(self: @T, question_id: u256) -> Array<Answer>;  fn mark_answer_as_correct(ref self: T, question_id: u256, answer_id: u256);
  fn get_correct_answer(self: @T, question_id: u256) -> AnswerId;

  // Answer voting functions
  fn vote_answer(ref self: T, question_id: u256, answer_id: u256, is_upvote: bool);
  fn get_answer_votes(self: @T, answer_id: u256) -> (u256, u256); // (upvotes, downvotes)
  fn get_user_vote(self: @T, user: ContractAddress, answer_id: u256) -> u8; // 0: no vote, 1: upvote, 2: downvote

  // Question staking functions
  fn stake_on_question(ref self: T, question_id: u256, amount: u256);
  fn get_total_staked_on_question(self: @T, question_id: u256) -> u256;
  fn get_staked_amount(self: @T, staker: ContractAddress, question_id: u256) -> u256;
  fn distribute_rewards(ref self: T, question_id: u256, answer_id: u256);

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
  use super::{IStarkOverflowTokenDispatcher, IStarkOverflowTokenDispatcherTrait};
  use starknet::{get_caller_address, get_contract_address, ContractAddress};
  use starknet::storage::{StoragePointerReadAccess, StoragePointerWriteAccess, StoragePathEntry, Map, Vec, VecTrait, MutableVecTrait};
  use openzeppelin::access::ownable::OwnableComponent;
  use openzeppelin_token::erc20::{ERC20Component, ERC20HooksEmptyImpl};
  use stark_overflow::events::{QuestionAnswered, ChosenAnswer, QuestionStaked, ReputationAdded, StakeStarted, StakeWithdrawn, AnswerVoted};

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
    AnswerVoted: AnswerVoted,
    StakeStarted: StakeStarted,
    StakeWithdrawn: StakeWithdrawn,
    #[flat]
    OwnableEvent: OwnableComponent::Event,
    #[flat]
    ERC20Event: ERC20Component::Event,
  }

  #[storage]
  struct Storage {
    questions: Map<u256, Question>,
    last_question_id: u256,
    answers: Map<u256, Answer>,
    last_answer_id: u256,
    question_id_answers_ids: Map<u256, Vec<u256>>,    question_id_chosen_answer_id: Map<u256, u256>,
    governance_token_dispatcher: IStarkOverflowTokenDispatcher,

    // Answer voting storage
    answer_upvotes: Map<u256, u256>, // answer_id -> upvote count
    answer_downvotes: Map<u256, u256>, // answer_id -> downvote count
    user_votes: Map<(ContractAddress, u256), u8>, // (user, answer_id) -> vote type (0: no vote, 1: upvote, 2: downvote)

    // Question staking storage
    question_stakes: Map<(ContractAddress, u256), u256>, // (user, question_id) -> amount
    total_question_stakes: Map<u256, u256>, // question_id -> total staked
    reputation: Map<ContractAddress, u256>,

    // Staking related storage
    staked_balances: Map<ContractAddress, u256>,
    staking_start_time: Map<ContractAddress, u64>,
    staking_rewards_rate: u256,

    #[substorage(v0)]
    ownable: OwnableComponent::Storage,
    #[substorage(v0)]
    erc20: ERC20Component::Storage,
  }

  #[constructor]
  fn constructor(ref self: ContractState, governance_token_address: ContractAddress) {
    self.ownable.initializer(get_caller_address());
    self.governance_token_dispatcher.write(IStarkOverflowTokenDispatcher { contract_address: governance_token_address});

    self.staking_rewards_rate.write(10000000000000000); // 0.01 tokens per second per token staked
  }

  #[abi(embed_v0)]
  impl StarkOverflow of super::IStarkOverflow<ContractState> {
    fn ask_question(ref self: ContractState, description: ByteArray, value: u256) -> QuestionId {
      let caller = get_caller_address();
      let question_id = self.last_question_id.read() + 1;
      let _question = Question { id: question_id, author: caller, description, value, status: QuestionStatus::Open };
      
      self.stake_on_question(question_id, value);
      
      self.questions.entry(question_id).write(_question);
      self.last_question_id.write(question_id);
      
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
      let answers_ids = self.question_id_answers_ids.entry(question_id);

      for i in 0..answers_ids.len() {
        let answer_id = answers_ids.at(i).read();
        let answer = self.answers.entry(answer_id).read();
        answers.append(answer);
      };

      answers
    }

    fn add_funds_to_question(ref self: ContractState, question_id: u256, value: u256) {
      let mut found_question = self.questions.entry(question_id).read();
      found_question.value += value;
      
      self.stake_on_question(question_id, value);

      self.questions.entry(question_id).write(found_question);
    }

    fn submit_answer(ref self: ContractState, question_id: u256, description: ByteArray) -> AnswerId {
      let caller = get_caller_address();
      let answer_id = self.last_answer_id.read() + 1;
      let answer = Answer { id: answer_id, author: caller, description, question_id };

      self.answers.entry(answer_id).write(answer);
      self.last_answer_id.write(answer_id);

      let answers_ids = self.question_id_answers_ids.entry(question_id);
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
      self.question_id_chosen_answer_id.entry(question_id).write(answer_id);
      
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
      let found_correct_answer_id = self.question_id_chosen_answer_id.entry(question_id).read();
      found_correct_answer_id
    }
      
    fn stake_on_question(ref self: ContractState, question_id: u256, amount: u256) {
      let caller = get_caller_address();
      
      // Ensure amount is greater than 0
      assert(amount > 0, 'Amount must be greater than 0');
      
      // Transfer tokens from caller to contract
      let this_contract = get_contract_address();
      self._governance_token_dispatcher().transfer_from(caller, this_contract, amount);
      
      // Update question staking records
      let current_stake = self.question_stakes.read((caller, question_id));
      let new_stake = current_stake + amount;
      self.question_stakes.write((caller, question_id), new_stake);
      
      // Update total staked for question
      let total_staked = self.total_question_stakes.read(question_id);
      self.total_question_stakes.write(question_id, total_staked + amount);
      
      // Emit event
      self.emit(QuestionStaked { staker: caller, question_id, amount });
    }

    fn get_total_staked_on_question(self: @ContractState, question_id: u256) -> u256 {
      self.total_question_stakes.read(question_id)
    }

    fn get_staked_amount(self: @ContractState, staker: ContractAddress, question_id: u256) -> u256 {
      self.question_stakes.read((staker, question_id))
    }

    fn distribute_rewards(ref self: ContractState, question_id: u256, answer_id: u256) {
      let found_answer = self.get_answer(answer_id);
      let answer_author = found_answer.author;

      // Calculate rewards
      let total_staked = self.get_total_staked_on_question(question_id);
      
      // Transfer rewards to the answer author
      self._governance_token_dispatcher().transfer(answer_author, total_staked);
    }

    fn add_reputation(ref self: ContractState, user: ContractAddress, amount: u256) {
      // Only owner can add reputation
      self.ownable.assert_only_owner();

      // Update reputation
      let current_rep = self.reputation.read(user);
      let new_rep = current_rep + amount;
      self.reputation.write(user, new_rep);

      // Emit event
      self.emit(ReputationAdded { user, amount, new_total: new_rep });
    }

    fn get_reputation(self: @ContractState, user: ContractAddress) -> u256 {
      self.reputation.read(user)
    }

    fn stake(ref self: ContractState, amount: u256) {
      // Get caller address
      let caller = get_caller_address();

      // Ensure amount is greater than 0
      assert(amount > 0, 'Amount must be greater than 0');

      // Check if already staked
      let current_stake = self.staked_balances.read(caller);
      if current_stake > 0 {
        // Withdraw current stake and rewards
        self._withdraw_stake(caller);
      }

      // Transfer tokens from caller to contract
      let this_contract = get_contract_address();
      ERC20Impl::transfer_from(ref self, caller, this_contract, amount);

      // Update staking
      self.staked_balances.write(caller, amount);

      // Get timestamp
      let block_timestamp = starknet::get_block_timestamp();
      self.staking_start_time.write(caller, block_timestamp);

      // Emit event
      self.emit(StakeStarted { staker: caller, amount, timestamp: block_timestamp });
    }

    fn withdraw_stake(ref self: ContractState) {
      let caller = get_caller_address();
      self._withdraw_stake(caller);
    }

    fn get_claimable_rewards(self: @ContractState, staker: ContractAddress) -> u256 {
      let staked_amount = self.staked_balances.read(staker);

      if staked_amount == 0 {
        return 0;
      }

      let start_time = self.staking_start_time.read(staker);
      let current_time = starknet::get_block_timestamp();
      let duration = current_time - start_time;

      let rate = self.staking_rewards_rate.read();

      // Calculate rewards: staked_amount * rate * duration / 10^18
      let duration_u256 = u256 { low: duration.into(), high: 0 };
      let reward = (staked_amount * rate * duration_u256) / 1000000000000000000;

      reward
    }    fn get_stake_info(self: @ContractState, staker: ContractAddress) -> (u256, u64, u256) {
      let staked_amount = self.staked_balances.read(staker);
      let start_time = self.staking_start_time.read(staker);
      let rewards = self.get_claimable_rewards(staker);

      (staked_amount, start_time, rewards)
    }

    // Answer voting functions
    fn vote_answer(ref self: ContractState, question_id: u256, answer_id: u256, is_upvote: bool) {
      let caller = get_caller_address();
      
      // Check if the answer exists and belongs to the question
      let answer = self.answers.read(answer_id);
      assert(answer.id != 0, 'Answer does not exist');
      assert(answer.question_id == question_id, 'Answer does not belong to this question');
      
      // Check if user is trying to vote on their own answer
      assert(answer.author != caller, 'Cannot vote on your own answer');
      
      let previous_vote = self.user_votes.read((caller, answer_id));
      let new_vote = if is_upvote { 1_u8 } else { 2_u8 };
      
      // If user already voted the same way, do nothing
      assert(previous_vote != new_vote, 'User has already voted this way');
      
      // Update vote counts
      if previous_vote == 1_u8 { // Was upvote, remove it
        let current_upvotes = self.answer_upvotes.read(answer_id);
        self.answer_upvotes.write(answer_id, current_upvotes - 1);
      } else if previous_vote == 2_u8 { // Was downvote, remove it
        let current_downvotes = self.answer_downvotes.read(answer_id);
        self.answer_downvotes.write(answer_id, current_downvotes - 1);
      }
      
      // Add new vote
      if is_upvote {
        let current_upvotes = self.answer_upvotes.read(answer_id);
        self.answer_upvotes.write(answer_id, current_upvotes + 1);
      } else {
        let current_downvotes = self.answer_downvotes.read(answer_id);
        self.answer_downvotes.write(answer_id, current_downvotes + 1);
      }
      
      // Record user's vote
      self.user_votes.write((caller, answer_id), new_vote);
      
      // Emit event
      self.emit(AnswerVoted { 
        voter: caller, 
        answer_id, 
        question_id, 
        is_upvote, 
        previous_vote 
      });
    }
    
    fn get_answer_votes(self: @ContractState, answer_id: u256) -> (u256, u256) {
      let upvotes = self.answer_upvotes.read(answer_id);
      let downvotes = self.answer_downvotes.read(answer_id);
      (upvotes, downvotes)
    }
    
    fn get_user_vote(self: @ContractState, user: ContractAddress, answer_id: u256) -> u8 {
      self.user_votes.read((user, answer_id))
    }   
  }
  
  #[generate_trait]
  impl InternalFunctions of InternalFunctionsTrait {     
    fn _governance_token_dispatcher(self: @ContractState) -> IStarkOverflowTokenDispatcher {
      self.governance_token_dispatcher.read()
    }

    fn _withdraw_stake(ref self: ContractState, staker: ContractAddress) {
      let staked_amount = self.staked_balances.read(staker);

      // Ensure there's a stake to withdraw
      assert(staked_amount > 0, 'No stake to withdraw');

      // Calculate rewards
      let rewards = self.get_claimable_rewards(staker);

      // Reset staking info
      self.staked_balances.write(staker, 0);
      self.staking_start_time.write(staker, 0);

      // Transfer staked tokens back
      ERC20Impl::transfer(ref self, staker, staked_amount);

      // Mint rewards if any
      if rewards > 0 {
        // Check max supply
        let current_supply = ERC20Impl::total_supply(@self);
        let max_supply = self._governance_token_dispatcher().max_supply();

        // Only mint rewards if it doesn't exceed max supply
        if current_supply + rewards <= max_supply {
          self._governance_token_dispatcher().mint(staker, rewards);
        }
      }

      // Emit event
      self.emit(StakeWithdrawn { staker, amount: staked_amount, rewards });
    }
  }
}
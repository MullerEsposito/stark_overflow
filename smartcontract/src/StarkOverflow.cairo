use stark_overflow::structs::CommonStructs::{Answer, QuestionStatus, Forum, User};
use stark_overflow::structs::SerialStructs::QuestionResponse;
use stark_overflow::types::{QuestionId, AnswerId};
use starknet::ContractAddress;

#[starknet::interface]
pub trait IStarkOverflow<T> {
  // Forums
  fn create_forum(ref self: T, name: ByteArray, icon_url: ByteArray) -> u256;
  fn delete_forum(ref self: T, forum_id: u256);
  fn update_forum(ref self: T, forum_id: u256, name: ByteArray, icon_url: ByteArray);
  fn get_forum(self: @T, forum_id: u256) -> Forum;
  fn get_forums(self: @T) -> Array<Forum>;

  // Questions
  fn ask_question(ref self: T, forum_id: u256, title: ByteArray, description: ByteArray, repository_url: ByteArray, tags: Array<ByteArray>, amount: u256) -> QuestionId;
  fn get_question(self: @T, question_id: u256) -> QuestionResponse;
  fn get_questions(self: @T, forum_id: u256, page_size: u64, page: u64) -> (Array<QuestionResponse>, u64, bool); // (questions, total, has_next)
  fn stake_on_question(ref self: T, question_id: u256, amount: u256);
  fn get_total_staked_on_question(self: @T, question_id: u256) -> u256;
  fn get_staked_amount(self: @T, staker: ContractAddress, question_id: u256) -> u256;

  // Answers
  fn submit_answer(ref self: T, question_id: u256, description: ByteArray) -> AnswerId;
  fn get_answer(self: @T, answer_id: u256) -> Answer;
  fn get_answers(self: @T, question_id: u256) -> Array<Answer>;
  fn mark_answer_as_correct(ref self: T, question_id: u256, answer_id: u256);
  fn get_correct_answer(self: @T, question_id: u256) -> AnswerId;

  // Reputation System
  fn vote_on_answer(ref self: T, answer_id: u256, vote: bool);
  fn get_user_reputation(self: @T, user: ContractAddress) -> u256;
  fn get_user(self: @T, user: ContractAddress) -> User;
  fn has_voted(self: @T, voter: ContractAddress, answer_id: u256) -> bool;
  fn get_vote(self: @T, voter: ContractAddress, answer_id: u256) -> bool;

}

#[starknet::contract]
pub mod StarkOverflow {
  use super::{Answer, QuestionStatus, QuestionId, AnswerId, IStarkOverflow, QuestionResponse, Forum, ContractAddress, User};
  use stark_overflow::structs::StorageStructs::Question;
  use starknet::{get_caller_address, get_contract_address};
  use starknet::storage::{StoragePointerReadAccess, StoragePointerWriteAccess, StoragePathEntry, Map, Vec, VecTrait, MutableVecTrait};
  use openzeppelin::access::ownable::OwnableComponent;
  use openzeppelin::token::erc20::interface::{IERC20Dispatcher, IERC20DispatcherTrait};
  use stark_overflow::events::{QuestionAnswered, ChosenAnswer, QuestionStaked, ReputationAdded, StakeStarted, StakeWithdrawn, VoteCast};

  component!(path: OwnableComponent, storage: ownable, event: OwnableEvent);

  #[abi(embed_v0)]
  impl OwnableMixinImpl = OwnableComponent::OwnableMixinImpl<ContractState>;
  impl InternalImpl = OwnableComponent::InternalImpl<ContractState>;

  #[event]
  #[derive(Drop, starknet::Event)]
  pub enum Event {
    QuestionAnswered: QuestionAnswered,
    QuestionStaked: QuestionStaked,
    ChosenAnswer: ChosenAnswer,
    ReputationAdded: ReputationAdded,
    StakeStarted: StakeStarted,
    StakeWithdrawn: StakeWithdrawn,
    VoteCast: VoteCast,
    #[flat]
    OwnableEvent: OwnableComponent::Event,
  }

  #[storage]
  struct Storage {
    // Forums
    forum_by_id: Map<u256, Forum>, // forum_id -> forum
    last_forum_id: u256,

    // Questions
    question_by_id: Map<u256, Question>, // question_id -> question
    questions_ids_by_forum_id: Map<u256, Vec<u256>>, // forum_id -> questions ids
    staked_in_question_by_user: Map<(ContractAddress, u256), u256>, // (user, question_id) -> amount
    total_staked_by_question_id: Map<u256, u256>, // question_id -> total staked
    last_question_id: u256,

    // Answers
    answer_by_id: Map<u256, Answer>, // answer_id -> answer
    answers_ids_by_question_id: Map<u256, Vec<u256>>, // question_id -> answers ids
    chosen_answer_by_question_id: Map<u256, u256>, // question_id -> chosen answer id
    last_answer_id: u256,

    // Reputation
    reputation: Map<ContractAddress, u256>,
     // Voting System
    user_votes: Map<
        (ContractAddress, u256), bool,
    >, // (voter, answer_id) -> vote (true=upvote, false=downvote)
    has_user_voted: Map<(ContractAddress, u256), bool>, // (voter, answer_id) -> has_voted
    // Token dispatcher
    stark_token_dispatcher: IERC20Dispatcher,

    #[substorage(v0)]
    ownable: OwnableComponent::Storage,
  }

  #[constructor]
  fn constructor(ref self: ContractState, owner: ContractAddress, stark_token_address: ContractAddress) {
    self.ownable.initializer(owner);
    self.stark_token_dispatcher.write(IERC20Dispatcher {
      contract_address: stark_token_address
    });
  }

  #[abi(embed_v0)]
  impl StarkOverflow of super::IStarkOverflow<ContractState> {
    fn create_forum(ref self: ContractState, name: ByteArray, icon_url: ByteArray) -> u256 {
      self.ownable.assert_only_owner();

      let forum_id = self.last_forum_id.read() + 1;
      let forum = Forum { id: forum_id, name, icon_url, amount: 0, total_questions: 0, deleted: false };

      self.forum_by_id.entry(forum_id).write(forum);
      self.last_forum_id.write(forum_id);

      forum_id
    }

    fn delete_forum(ref self: ContractState, forum_id: u256) {
      self.ownable.assert_only_owner();

      let forum = self.forum_by_id.entry(forum_id);
      forum.deleted.write(true);
    }

    fn update_forum(ref self: ContractState, forum_id: u256, name: ByteArray, icon_url: ByteArray) {
      self.ownable.assert_only_owner();

      let forum = self.forum_by_id.entry(forum_id);
      forum.name.write(name);
      forum.icon_url.write(icon_url);
    }

    fn get_forum(self: @ContractState, forum_id: u256) -> Forum {
      self.forum_by_id.entry(forum_id).read()
    }

    fn get_forums(self: @ContractState) -> Array<Forum> {
      let mut forums = array![];
      let number_of_forums = self.last_forum_id.read();

      for i in 1..number_of_forums + 1 {
        let forum = self.forum_by_id.entry(i).read();
        if forum.deleted == false {
          forums.append(forum);
        }
      };

      forums
    }

    fn ask_question(ref self: ContractState, forum_id: u256, title: ByteArray, description: ByteArray, repository_url: ByteArray, tags: Array<ByteArray>, amount: u256) -> QuestionId {
      let caller = get_caller_address();

      assert(amount > 0, 'Amount must be greater than 0');

      let question_id = self.last_question_id.read() + 1;

      self.stark_token_dispatcher().transfer_from(caller, get_contract_address(), amount);

      let found_forum = self.forum_by_id.entry(forum_id);
      found_forum.amount.write(found_forum.amount.read() + amount);
      found_forum.total_questions.write(found_forum.total_questions.read() + 1);

      let question = self.question_by_id.entry(question_id);
      question.id.write(question_id);
      question.forum_id.write(forum_id);
      question.title.write(title);
      question.author.write(caller);
      question.description.write(description);
      question.repository_url.write(repository_url);
      question.status.write(QuestionStatus::Open);
      question.amount.write(amount);

      for i in 0..tags.len() {
        let tag = tags.at(i).clone();
        question.tags.append().write(tag);
      };

      self.last_question_id.write(question_id);
      self.questions_ids_by_forum_id.entry(forum_id).append().write(question_id);
      self.total_staked_by_question_id.entry(question_id).write(amount);

      question_id
    }

    fn get_question(self: @ContractState, question_id: u256) -> QuestionResponse {
      let found_question = self.question_by_id.entry(question_id);
      let mut tags = array![];
      for i in 0..found_question.tags.len() {
        let tag = found_question.tags.at(i).read();
        tags.append(tag);
      };

      let question_response = QuestionResponse {
        id: found_question.id.read(),
        forum_id: found_question.forum_id.read(),
        title: found_question.title.read(),
        author: found_question.author.read(),
        description: found_question.description.read(),
        amount: found_question.amount.read(),
        repository_url: found_question.repository_url.read(),
        tags: tags,
        status: found_question.status.read(),
      };
      question_response
    }

    fn get_questions(self: @ContractState, forum_id: u256, page_size: u64, page: u64) -> (Array<QuestionResponse>, u64, bool) {
      assert(page_size > 0, 'PageSize must be greater than 0');
      assert(page > 0, 'Page must be greater than 0');

      let total_forum_questions = self.questions_ids_by_forum_id.entry(forum_id).len();

      if total_forum_questions == 0 {
        return (array![], 0, false);
      }

      let page_first_question_idx = page_size * (page - 1) + 1; //2 * (3-1) + 1 = 5

      if page_first_question_idx > total_forum_questions {
        return (array![], total_forum_questions, false);
      }

      let mut page_last_question_idx = page_first_question_idx + page_size - 1;
      if page_last_question_idx > total_forum_questions {
        page_last_question_idx = total_forum_questions;
      }

      let mut questions_for_page = array![];
      let mut current_index = page_first_question_idx;

      while current_index <= page_last_question_idx {
        let question_id = self.questions_ids_by_forum_id.entry(forum_id).at(current_index - 1).read();
        let found_question = self.question_by_id.entry(question_id);
        let mut tags = array![];
        for i in 0..found_question.tags.len() {
          let tag = found_question.tags.at(i).read();
          tags.append(tag);
        };
        let question_response = QuestionResponse {
          id: found_question.id.read(),
          forum_id: found_question.forum_id.read(),
          title: found_question.title.read(),
          author: found_question.author.read(),
          description: found_question.description.read(),
          amount: found_question.amount.read(),
          repository_url: found_question.repository_url.read(),
          tags: tags,
          status: found_question.status.read(),
        };
        questions_for_page.append(question_response);
        current_index += 1;
      };

      let has_next_page = page_last_question_idx < total_forum_questions;

      (questions_for_page, total_forum_questions, has_next_page)
    }

    fn get_answers(self: @ContractState, question_id: u256) -> Array<Answer> {
      let found_question = self.question_by_id.entry(question_id);
      assert!(found_question.id.read() == question_id, "Question does not exist");

      let mut answers = array![];
      let answers_ids = self.answers_ids_by_question_id.entry(question_id);

      for i in 0..answers_ids.len() {
        let answer_id = answers_ids.at(i).read();
        let answer = self.answer_by_id.entry(answer_id).read();
        answers.append(answer);
      };

      answers
    }

    fn submit_answer(ref self: ContractState, question_id: u256, description: ByteArray) -> AnswerId {
      let caller = get_caller_address();
      let answer_id = self.last_answer_id.read() + 1;
      let answer = Answer { id: answer_id, author: caller, description, question_id, upvotes: 0, downvotes: 0 };

      self.answer_by_id.entry(answer_id).write(answer);
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
      let found_answer = self.answer_by_id.entry(answer_id).read();
      found_answer
    }

    fn mark_answer_as_correct(ref self: ContractState, question_id: u256, answer_id: u256) {
      let caller = get_caller_address();
      let question_author = self.get_question(question_id).author;

      assert!(caller == question_author, "Only the author of the question can mark the answer as correct");

      let found_answer = self.get_answer(answer_id);
      assert!(found_answer.question_id == question_id, "The specified answer does not exist for this question");

      let found_question = self.question_by_id.entry(question_id);
      assert!(found_question.status.read() == QuestionStatus::Open, "The question is already resolved");

      found_question.status.write(QuestionStatus::Resolved);
      self.chosen_answer_by_question_id.entry(question_id).write(answer_id);

      self.distribute_rewards(question_id, answer_id);

      self.emit(ChosenAnswer {
        id: answer_id,
        question_id,
        answer_id,
        author_address: found_answer.author,
        date: starknet::get_block_timestamp().into(),
      });
    }

    fn get_correct_answer(self: @ContractState, question_id: u256) -> AnswerId {
      let found_correct_answer_id = self.chosen_answer_by_question_id.entry(question_id).read();
      found_correct_answer_id
    }

    fn stake_on_question(ref self: ContractState, question_id: u256, amount: u256) {
      let caller = get_caller_address();
      let mut found_question = self.question_by_id.entry(question_id);

      assert(amount > 0, 'Amount must be greater than 0');
      self.stark_token_dispatcher().transfer_from(caller, get_contract_address(), amount);
      found_question.amount.write(found_question.amount.read() + amount);

      let current_stake = self.staked_in_question_by_user.read((caller, question_id));
      let new_stake = current_stake + amount;
      self.staked_in_question_by_user.write((caller, question_id), new_stake);

      let total_staked = self.total_staked_by_question_id.read(question_id);
      self.total_staked_by_question_id.write(question_id, total_staked + amount);

      let found_forum = self.forum_by_id.entry(found_question.forum_id.read());
      found_forum.amount.write(found_forum.amount.read() + amount);

      self.emit(QuestionStaked { staker: caller, question_id, amount });
    }

    fn get_total_staked_on_question(self: @ContractState, question_id: u256) -> u256 {
      self.total_staked_by_question_id.read(question_id)
    }

    fn get_staked_amount(self: @ContractState, staker: ContractAddress, question_id: u256) -> u256 {
      self.staked_in_question_by_user.read((staker, question_id))
    }

    // Reputation System Implementation
    fn vote_on_answer(ref self: ContractState, answer_id: u256, vote: bool) {
      let caller = get_caller_address();

      // Check if answer exists
      let answer = self.answer_by_id.entry(answer_id).read();
      assert!(answer.id == answer_id, "Answer does not exist");

      // Prevent voting on own answer
      assert!(answer.author != caller, "Cannot vote on your own answer");

      let vote_key = (caller, answer_id);
      let has_voted = self.has_user_voted.entry(vote_key).read();

      // Prevent double voting - requirement: "Each user can only vote once per answer"
      assert!(!has_voted, "User has already voted on this answer");

      // Store the vote
      self.has_user_voted.entry(vote_key).write(true);
      self.user_votes.entry(vote_key).write(vote);

      // Store author address before moving answer
      let answer_author = answer.author;

      // Update answer vote counts
      let mut updated_answer = answer;
      if vote {
        updated_answer.upvotes += 1;
      } else {
        updated_answer.downvotes += 1;
      }
      self.answer_by_id.entry(answer_id).write(updated_answer);

      // Update author reputation and calculate actual change
      let old_reputation = self.reputation.entry(answer_author).read();
      let new_reputation = if vote {
        old_reputation + 1 // Upvote increases reputation
      } else {
        if old_reputation > 0 {
          old_reputation - 1 // Downvote decreases reputation
        } else {
          0
        }
      };
      self.reputation.entry(answer_author).write(new_reputation);

      // Calculate actual reputation change based on what actually happened
      let actual_reputation_change = if new_reputation >= old_reputation {
        new_reputation - old_reputation
      } else {
        old_reputation - new_reputation 
      };

      // Emit vote cast event
      self
        .emit(
          VoteCast {
            voter: caller,
            answer_id,
            is_upvote: vote,
            answer_author: answer_author,
            reputation_change: actual_reputation_change,
          },
        );
    }

    fn get_user_reputation(self: @ContractState, user: ContractAddress) -> u256 {
      self.reputation.entry(user).read()
    }

    fn get_user(self: @ContractState, user: ContractAddress) -> User {
      let reputation = self.reputation.entry(user).read();
      User { reputation, address_wallet: user }
    }

    fn has_voted(self: @ContractState, voter: ContractAddress, answer_id: u256) -> bool {
      self.has_user_voted.entry((voter, answer_id)).read()
    }

    fn get_vote(self: @ContractState, voter: ContractAddress, answer_id: u256) -> bool {
      self.user_votes.entry((voter, answer_id)).read()
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

    fn stark_token_dispatcher(self: @ContractState) -> IERC20Dispatcher {
      self.stark_token_dispatcher.read()
    }
  }
}
use snforge_std::{CheatSpan, cheat_caller_address, byte_array::try_deserialize_bytearray_error};
use openzeppelin::access::ownable::interface::{IOwnableDispatcher, IOwnableDispatcherTrait};
use stark_overflow::StarkOverflow::{IStarkOverflowSafeDispatcher, IStarkOverflowSafeDispatcherTrait, IStarkOverflowDispatcherTrait};
use stark_overflow::MockStarkToken::{IMockStarkTokenDispatcherTrait};
use super::common::{deploy_starkoverflow_contract, deploy_mock_stark_token, approve_as_spender, ask_question, create_forum, submit_answer};
use super::constants::{ADDRESSES, ADDRESSESTrait, EIGHTEEN_DECIMALS};

#[test]
fn test_deploy_mock_stark_token() {
  let asker = ADDRESSES::ASKER.get();
  let sponsor = ADDRESSES::SPONSOR.get();
  let INITIAL_BALANCE: u256 = 100 * EIGHTEEN_DECIMALS; // 100_STARK
  let (stark_token_dispatcher, _) = deploy_mock_stark_token();

  assert_eq!(stark_token_dispatcher.balance_of(asker), INITIAL_BALANCE, "Asker balance should be == 100");
  assert_eq!(stark_token_dispatcher.balance_of(sponsor), INITIAL_BALANCE, "Sponsor balance should be == 100");
}

#[test]
fn it_should_be_possible_to_deploy_starkoverflow_contract() {
  let (_, stark_token_address) = deploy_mock_stark_token();
  let (starkoverflow_dispatcher, starkoverflow_contract_address) = deploy_starkoverflow_contract(stark_token_address);

  assert_eq!(starkoverflow_dispatcher.contract_address, starkoverflow_contract_address);
}

#[test]
fn it_should_be_able_to_create_a_forum() {
  let (_, stark_token_address) = deploy_mock_stark_token();
  let (starkoverflow_dispatcher, starkoverflow_contract_address) = deploy_starkoverflow_contract(stark_token_address);
  let ownable_dispatcher = IOwnableDispatcher { contract_address: starkoverflow_contract_address };

  let owner = ownable_dispatcher.owner();
  let forum_name = "Forum of test";
  let forum_icon_url = "https://example.com/icon.png";

  cheat_caller_address(starkoverflow_contract_address, owner, CheatSpan::TargetCalls(1));
  let forum_id = starkoverflow_dispatcher.create_forum(forum_name.clone(), forum_icon_url.clone());

  let forum = starkoverflow_dispatcher.get_forum(forum_id);
  assert_eq!(forum.id, 1);
  assert_eq!(forum.name, forum_name);
  assert_eq!(forum.icon_url, forum_icon_url);
  assert_eq!(forum.deleted, false);
}

#[test]
fn it_should_be_able_to_update_a_forum() {
  let (_, stark_token_address) = deploy_mock_stark_token();
  let (starkoverflow_dispatcher, starkoverflow_contract_address) = deploy_starkoverflow_contract(stark_token_address);
  let ownable_dispatcher = IOwnableDispatcher { contract_address: starkoverflow_contract_address };

  let owner = ownable_dispatcher.owner();

  let forum_id = create_forum(starkoverflow_dispatcher, starkoverflow_contract_address);

  let new_forum_name = "Forum of test updated";
  let new_forum_icon_url = "https://example.com/icon_updated.png";

  cheat_caller_address(starkoverflow_contract_address, owner, CheatSpan::TargetCalls(1));
  starkoverflow_dispatcher.update_forum(forum_id, new_forum_name.clone(), new_forum_icon_url.clone());

  let forum = starkoverflow_dispatcher.get_forum(forum_id);
  assert_eq!(forum.name, new_forum_name);
  assert_eq!(forum.icon_url, new_forum_icon_url);
}

#[test]
fn it_should_be_able_to_delete_a_forum() {
  let (_, stark_token_address) = deploy_mock_stark_token();
  let (starkoverflow_dispatcher, starkoverflow_contract_address) = deploy_starkoverflow_contract(stark_token_address);
  let ownable_dispatcher = IOwnableDispatcher { contract_address: starkoverflow_contract_address };

  let owner = ownable_dispatcher.owner();
  let forum_id = create_forum(starkoverflow_dispatcher, starkoverflow_contract_address);

  let forum = starkoverflow_dispatcher.get_forum(forum_id);
  assert_eq!(forum.deleted, false);

  cheat_caller_address(starkoverflow_contract_address, owner, CheatSpan::TargetCalls(1));
  starkoverflow_dispatcher.delete_forum(forum_id);

  let forum = starkoverflow_dispatcher.get_forum(forum_id);
  assert_eq!(forum.deleted, true);
}

#[test]
fn it_should_be_able_to_retrieve_all_not_deleted_forums() {
  let (_, stark_token_address) = deploy_mock_stark_token();
  let (starkoverflow_dispatcher, _) = deploy_starkoverflow_contract(stark_token_address);

  let starkoverflow_contract_address = starkoverflow_dispatcher.contract_address;
  let ownable_dispatcher = IOwnableDispatcher { contract_address: starkoverflow_contract_address };
  let owner = ownable_dispatcher.owner();

  let forum_name_1 = "Forum of test 1";
  let forum_icon_url_1 = "https://example.com/icon.png";
  let forum_name_2 = "Forum of test 2";
  let forum_icon_url_2 = "https://example.com/icon.png";
  let forum_name_3 = "Forum of test 3";
  let forum_icon_url_3 = "https://example.com/icon.png";

  cheat_caller_address(starkoverflow_contract_address, owner, CheatSpan::TargetCalls(3));
  starkoverflow_dispatcher.create_forum(forum_name_1.clone(), forum_icon_url_1.clone());
  let forum_id_2 = starkoverflow_dispatcher.create_forum(forum_name_2.clone(), forum_icon_url_2.clone());
  starkoverflow_dispatcher.create_forum(forum_name_3.clone(), forum_icon_url_3.clone());

  cheat_caller_address(starkoverflow_contract_address, owner, CheatSpan::TargetCalls(1));
  starkoverflow_dispatcher.delete_forum(forum_id_2);

  let forums = starkoverflow_dispatcher.get_forums();
  assert_eq!(forums.len(), 2);
  assert_eq!(forums[0].id, @1);
  assert_eq!(forums[1].id, @3);
  assert_eq!(forums[0].name, @forum_name_1);
  assert_eq!(forums[1].name, @forum_name_3);
  assert_eq!(forums[0].icon_url, @forum_icon_url_1);
  assert_eq!(forums[1].icon_url, @forum_icon_url_3);
}

#[test]
fn it_should_be_able_to_ask_a_question() {
  let asker = ADDRESSES::ASKER.get();

  let (token_dispatcher, stark_token_address) = deploy_mock_stark_token();

  let (starkoverflow_dispatcher, starkoverflow_contract_address) = deploy_starkoverflow_contract(stark_token_address);

  let contract_initial_balance = token_dispatcher.balance_of(starkoverflow_contract_address);

  let forum_id = create_forum(starkoverflow_dispatcher, starkoverflow_contract_address);

  let title = "Title of test";
  let description = "Question of test";
  let repository_url = "https://github.com/starkoverflow";
  let tags = array!["tag1", "tag2", "tag3"];
  let amount: u256 = 1 * EIGHTEEN_DECIMALS; // 1 STARK

  approve_as_spender(starkoverflow_contract_address, asker, token_dispatcher, amount);

  cheat_caller_address(starkoverflow_contract_address, asker, CheatSpan::TargetCalls(1));
  let question_id = starkoverflow_dispatcher.ask_question(
    forum_id,
    title.clone(),
    description.clone(),
    repository_url.clone(),
    tags.clone(),
    amount
  );

  let question = starkoverflow_dispatcher.get_question(question_id);
  let forum = starkoverflow_dispatcher.get_forum(forum_id);

  assert_eq!(question.id, question_id);
  assert_eq!(question.forum_id, forum_id);
  assert_eq!(question.author, asker);
  assert_eq!(question.description, description);
  assert_eq!(question.amount, amount);
  assert_eq!(question.repository_url, repository_url);
  assert_eq!(question.tags, tags);

  assert_eq!(forum.amount, amount);
  assert_eq!(forum.total_questions, 1);

  let total_staked = starkoverflow_dispatcher.get_total_staked_on_question(question_id);
  assert_eq!(total_staked, amount);

  let final_balance = token_dispatcher.balance_of(starkoverflow_contract_address);
  assert_eq!(final_balance, contract_initial_balance + amount);
}

#[test]
fn it_should_be_able_to_add_funds_to_a_question() {
  let sponsor = ADDRESSES::SPONSOR.get();

  let (stark_token_dispatcher, stark_token_address) = deploy_mock_stark_token();
  let (starkoverflow_dispatcher, starkoverflow_contract_address) = deploy_starkoverflow_contract(stark_token_address);

  let forum_id = create_forum(starkoverflow_dispatcher, starkoverflow_contract_address);

  let question_id = ask_question(starkoverflow_dispatcher, stark_token_dispatcher, forum_id);
  let mut question = starkoverflow_dispatcher.get_question(question_id);
  let question_initial_amount = question.amount;

  let additionally_funds = 2 * EIGHTEEN_DECIMALS;

  approve_as_spender(starkoverflow_contract_address, sponsor, stark_token_dispatcher, additionally_funds);

  cheat_caller_address(starkoverflow_contract_address, sponsor, CheatSpan::TargetCalls(1));
  starkoverflow_dispatcher.stake_on_question(question_id, additionally_funds);

  question = starkoverflow_dispatcher.get_question(question_id);
  assert_eq!(question.amount, question_initial_amount + additionally_funds);

  let forum = starkoverflow_dispatcher.get_forum(forum_id);
  assert_eq!(forum.amount, question_initial_amount + additionally_funds);

  let final_balance = stark_token_dispatcher.balance_of(starkoverflow_contract_address);
  assert_eq!(final_balance, question_initial_amount + additionally_funds);
}

#[test]
fn it_should_be_able_to_submit_an_answer() {
  let responder = ADDRESSES::RESPONDER1.get();

  let (stark_token_dispatcher, stark_token_address) = deploy_mock_stark_token();
  let (starkoverflow_dispatcher, starkoverflow_contract_address) = deploy_starkoverflow_contract(stark_token_address);

  let forum_id = create_forum(starkoverflow_dispatcher, starkoverflow_contract_address);

  let question_id = ask_question(starkoverflow_dispatcher, stark_token_dispatcher, forum_id);

  cheat_caller_address(starkoverflow_contract_address, responder, CheatSpan::TargetCalls(1));
  let answer_description = "Answer of test.";
  let answer_id = starkoverflow_dispatcher.submit_answer(question_id, answer_description.clone());
  let found_answer = starkoverflow_dispatcher.get_answer(answer_id);

  assert_eq!(found_answer.id, answer_id);
  assert_eq!(found_answer.author, responder);
  assert_eq!(found_answer.description, answer_description);
  assert_eq!(found_answer.question_id, question_id);
}

#[test]
fn it_should_be_able_to_mark_answer_as_correct() {
  let asker = ADDRESSES::ASKER.get();
  let responder = ADDRESSES::RESPONDER1.get();

  let (stark_token_dispatcher, stark_token_address) = deploy_mock_stark_token();
  let (starkoverflow_dispatcher, starkoverflow_contract_address) = deploy_starkoverflow_contract(stark_token_address);

  assert_eq!(stark_token_dispatcher.balance_of(starkoverflow_contract_address), 0, "Starkoverflow contract should initially have 0 balance");

  let forum_id = create_forum(starkoverflow_dispatcher, starkoverflow_contract_address);

  let question_id = ask_question(starkoverflow_dispatcher, stark_token_dispatcher, forum_id);

  let answer_id = submit_answer(starkoverflow_dispatcher, starkoverflow_contract_address, question_id, "Answer of test.");

  cheat_caller_address(starkoverflow_contract_address, asker, CheatSpan::TargetCalls(1));
  starkoverflow_dispatcher.mark_answer_as_correct(question_id, answer_id);

  let correct_answer_id = starkoverflow_dispatcher.get_correct_answer(question_id);
  assert_eq!(correct_answer_id, answer_id);

  let question_balance = starkoverflow_dispatcher.get_question(question_id).amount;
  let responder_balance = stark_token_dispatcher.balance_of(responder);
  let starkoverflow_contract_balance = stark_token_dispatcher.balance_of(starkoverflow_contract_address);
  assert_eq!(starkoverflow_contract_balance, 0, "Starkoverflow contract should finally have 0 balance");
  assert_eq!(responder_balance, question_balance);
}

#[test]
fn it_should_not_be_able_to_mark_a_non_existent_answer_as_correct() {
  let asker = ADDRESSES::ASKER.get();

  let (stark_token_dispatcher, stark_token_address) = deploy_mock_stark_token();
  let (starkoverflow_dispatcher, starkoverflow_contract_address) = deploy_starkoverflow_contract(stark_token_address);
  let starkoverflow_safe_dispatcher = IStarkOverflowSafeDispatcher { contract_address: starkoverflow_contract_address };

  let forum_id = create_forum(starkoverflow_dispatcher, starkoverflow_contract_address);

  let question_id = ask_question(starkoverflow_dispatcher, stark_token_dispatcher, forum_id);

  let inexistent_answer_id = 999;
  cheat_caller_address(starkoverflow_contract_address, asker, CheatSpan::TargetCalls(1));
  match starkoverflow_safe_dispatcher.mark_answer_as_correct(question_id, inexistent_answer_id) {
    Result::Ok(_) => panic!("It should not be able to mark a not related answer for a question"),
    Result::Err(panic_data) => {
      let error_message = try_deserialize_bytearray_error(panic_data.span()).expect('wrong format');
      assert_eq!(error_message, "The specified answer does not exist for this question", "Wrong error message received");
    }
  };
}

#[test]
fn it_should_not_be_able_to_tag_an_answer_as_correct_but_the_owner() {
  let intruder = ADDRESSES::INTRUDER.get();

  let (stark_token_dispatcher, stark_token_address) = deploy_mock_stark_token();
  let (starkoverflow_dispatcher, starkoverflow_contract_address) = deploy_starkoverflow_contract(stark_token_address);
  let starkoverflow_safe_dispatcher = IStarkOverflowSafeDispatcher { contract_address: starkoverflow_contract_address };

  let forum_id = create_forum(starkoverflow_dispatcher, starkoverflow_contract_address);

  let question_id = ask_question(starkoverflow_dispatcher, stark_token_dispatcher, forum_id);

  let answer_id = submit_answer(starkoverflow_dispatcher, starkoverflow_contract_address, question_id, "Answer of test.");

  cheat_caller_address(starkoverflow_contract_address, intruder, CheatSpan::TargetCalls(1));
  match starkoverflow_safe_dispatcher.mark_answer_as_correct(question_id, answer_id) {
    Result::Ok(_) => panic!("It should not be allowed no one than the question author to mark the question as correct"),
    Result::Err(panic_data) => {
      let error_message = try_deserialize_bytearray_error(panic_data.span()).expect('wrong format');
      assert_eq!(error_message, "Only the author of the question can mark the answer as correct", "Wrong error message received");
    }
  };
}

#[test]
fn it_should_be_able_to_retrive_all_answers_for_a_question() {
  let (stark_token_dispatcher, stark_token_address) = deploy_mock_stark_token();
  let (starkoverflow_dispatcher, starkoverflow_contract_address) = deploy_starkoverflow_contract(stark_token_address);

  let forum_id = create_forum(starkoverflow_dispatcher, starkoverflow_contract_address);

  let question_id = ask_question(starkoverflow_dispatcher, stark_token_dispatcher, forum_id);

  let answer_description_1 = "Answer of test.";
  submit_answer(starkoverflow_dispatcher, starkoverflow_contract_address, question_id, answer_description_1.clone());
  let answer_description_2 = "Another answer of test.";
  submit_answer(starkoverflow_dispatcher, starkoverflow_contract_address, question_id, answer_description_2.clone());

  let answers = starkoverflow_dispatcher.get_answers(question_id);

  assert_eq!(answers.len(), 2);
  assert_eq!(*answers.at(0).id, 1);
  assert_eq!(answers.at(0).description, @answer_description_1);
  assert_eq!(*answers.at(1).id, 2);
  assert_eq!(answers.at(1).description, @answer_description_2);
}

#[test]
fn it_should_return_an_empty_array_for_when_no_answers() {
  let (stark_token_dispatcher, stark_token_address) = deploy_mock_stark_token();
  let (starkoverflow_dispatcher, starkoverflow_contract_address) = deploy_starkoverflow_contract(stark_token_address);

  let forum_id = create_forum(starkoverflow_dispatcher, starkoverflow_contract_address);
  let question_id = ask_question(starkoverflow_dispatcher, stark_token_dispatcher, forum_id);

  let answers = starkoverflow_dispatcher.get_answers(question_id);

  assert_eq!(answers.len(), 0, "Expected 0 answers");
}

#[test]
fn it_should_not_be_able_to_retrieve_answers_for_a_non_existent_question() {
  let (stark_token_dispatcher, stark_token_address) = deploy_mock_stark_token();
  let (starkoverflow_dispatcher, starkoverflow_contract_address) = deploy_starkoverflow_contract(stark_token_address);

  let forum_id = create_forum(starkoverflow_dispatcher, starkoverflow_contract_address);

  ask_question(starkoverflow_dispatcher, stark_token_dispatcher, forum_id);

  let starkoverflow_safe_dispatcher = IStarkOverflowSafeDispatcher { contract_address: starkoverflow_contract_address };

  let non_existent_question_id: u256 = 999;

  cheat_caller_address(starkoverflow_contract_address, ADDRESSES::ASKER.get(), CheatSpan::TargetCalls(1));
  match starkoverflow_safe_dispatcher.get_answers(non_existent_question_id) {
    Result::Ok(_) => panic!("It should not be able to retrieve answers for a non-existent question"),
    Result::Err(panic_data) => {
      let error_message = try_deserialize_bytearray_error(panic_data.span()).expect('wrong format');
      assert_eq!(error_message, "Question does not exist", "Wrong error message received");
    }
  };
}

#[test]
fn it_should_return_void_values_for_when_no_questions() {
  let (_, stark_token_address) = deploy_mock_stark_token();
  let (starkoverflow_dispatcher, starkoverflow_contract_address) = deploy_starkoverflow_contract(stark_token_address);

  let forum_id = create_forum(starkoverflow_dispatcher, starkoverflow_contract_address);

  let (questions, total, has_next) = starkoverflow_dispatcher.get_questions(forum_id, 10, 1);

  assert_eq!(total, 0, "Total should be 0");
  assert_eq!(questions.len(), 0, "Array should be empty");
  assert_eq!(has_next, false, "Should not have next page");
}

#[test]
fn it_should_return_paginated_questions_for_a_forum() {
  let (stark_token_dispatcher, stark_token_address) = deploy_mock_stark_token();
  let (starkoverflow_dispatcher, starkoverflow_contract_address) = deploy_starkoverflow_contract(stark_token_address);

  let forum_id_1 = create_forum(starkoverflow_dispatcher, starkoverflow_contract_address);
  let forum_id_2 = create_forum(starkoverflow_dispatcher, starkoverflow_contract_address);

  let mut total_questions: u32 = 6;
  while total_questions > 0 {
    if total_questions == 3 {
      ask_question(starkoverflow_dispatcher, stark_token_dispatcher, forum_id_2);
    } else {
      ask_question(starkoverflow_dispatcher, stark_token_dispatcher, forum_id_1);
    }
    total_questions -= 1;
  };

  let (questions_page1, total, has_next) = starkoverflow_dispatcher.get_questions(forum_id_1, 2, 1);
  assert_eq!(total, 5, "Page 1: Total should be 5");
  assert_eq!(questions_page1.len(), 2, "Page 1: Should have 2 questions");
  assert_eq!(has_next, true, "Page 1: Should have next page");
  assert_eq!(*questions_page1.at(0).id, 1, "Page 1: First ID should be 1");
  assert_eq!(*questions_page1.at(1).id, 2, "Page 1: Second ID should be 2");

  let (questions_page2, _, has_next) = starkoverflow_dispatcher.get_questions(forum_id_1, 2, 2);
  assert_eq!(questions_page2.len(), 2, "Page 2: Should have 2 questions");
  assert_eq!(has_next, true, "Page 2: Should have next page");
  assert_eq!(*questions_page2.at(0).id, 3, "Page 2: First ID should be 3");
  assert_eq!(*questions_page2.at(1).id, 5, "Page 2: Second ID should be 5");

  let (questions_page3, _, has_next) = starkoverflow_dispatcher.get_questions(forum_id_1, 2, 3);
  assert_eq!(questions_page3.len(), 1, "Page 3: Should have 1 question");
  assert_eq!(has_next, false, "Page 3: Should NOT have next page");
  assert_eq!(*questions_page3.at(0).id, 6, "Page 3: First ID should be 6");

  let (questions_page4, _, has_next) = starkoverflow_dispatcher.get_questions(forum_id_1, 2, 4);
  assert_eq!(questions_page4.len(), 0, "Page 4: Should have 0 questions");
  assert_eq!(has_next, false, "Page 4: Should NOT have next page");

  let (questions_page1, total, has_next) = starkoverflow_dispatcher.get_questions(forum_id_2, 2, 1);
  assert_eq!(total, 1, "Page 1: Total should be 1");
  assert_eq!(questions_page1.len(), 1, "Page 1: Should have 1 question");
  assert_eq!(has_next, false, "Page 1: Should NOT have next page");
  assert_eq!(*questions_page1.at(0).id, 4, "Page 1: First ID should be 4");
}

//  ========== REPUTATION SYSTEM TESTS ==========

#[test]
fn test_initial_user_reputation_is_zero() {
  let (_, stark_token_address) = deploy_mock_stark_token();
  let (starkoverflow_dispatcher, _) = deploy_starkoverflow_contract(stark_token_address);

  let user = ADDRESSES::RESPONDER1.get();
  let reputation = starkoverflow_dispatcher.get_user_reputation(user);
  assert_eq!(reputation, 0, "Initial user reputation should be 0");

  let user_struct = starkoverflow_dispatcher.get_user(user);
  assert_eq!(user_struct.reputation, 0, "User struct reputation should be 0");
  assert_eq!(user_struct.address_wallet, user, "User struct address should match");
}

#[test]
fn test_vote_on_answer_upvote_increases_reputation() {
  let (token_dispatcher, stark_token_address) = deploy_mock_stark_token();
  let (starkoverflow_dispatcher, starkoverflow_contract_address) = deploy_starkoverflow_contract(
    stark_token_address,
  );

  // Setup: Create forum and question
  let forum_id = create_forum(starkoverflow_dispatcher, starkoverflow_contract_address);
  let question_id = ask_question(starkoverflow_dispatcher, token_dispatcher, forum_id);

  // Submit an answer
  let answer_description = "This is my answer";
  let answer_id = submit_answer(
    starkoverflow_dispatcher, starkoverflow_contract_address, question_id, answer_description,
  );
  let answer = starkoverflow_dispatcher.get_answer(answer_id);
  let answer_author = answer.author;

  // Check initial reputation
  let initial_reputation = starkoverflow_dispatcher.get_user_reputation(answer_author);
  assert_eq!(initial_reputation, 0, "Initial reputation should be 0");

  // Vote on the answer (upvote)
  let voter = ADDRESSES::SPONSOR.get();
  cheat_caller_address(starkoverflow_contract_address, voter, CheatSpan::TargetCalls(1));
  starkoverflow_dispatcher.vote_on_answer(answer_id, true); // true = upvote

  // Check reputation increased
  let new_reputation = starkoverflow_dispatcher.get_user_reputation(answer_author);
  assert_eq!(new_reputation, 1, "Reputation should increase by 1 after upvote");

  // Check answer vote counts
  let updated_answer = starkoverflow_dispatcher.get_answer(answer_id);
  assert_eq!(updated_answer.upvotes, 1, "Answer should have 1 upvote");
  assert_eq!(updated_answer.downvotes, 0, "Answer should have 0 downvotes");

  // Check voting status
  let has_voted = starkoverflow_dispatcher.has_voted(voter, answer_id);
  assert!(has_voted, "Voter should be marked as having voted");

  let vote = starkoverflow_dispatcher.get_vote(voter, answer_id);
  assert!(vote, "Vote should be true (upvote)");
}

#[test]
fn test_vote_on_answer_downvote_decreases_reputation() {
  let (token_dispatcher, stark_token_address) = deploy_mock_stark_token();
  let (starkoverflow_dispatcher, starkoverflow_contract_address) = deploy_starkoverflow_contract(
    stark_token_address,
  );

  // Setup: Create forum and question
  let forum_id = create_forum(starkoverflow_dispatcher, starkoverflow_contract_address);
  let question_id = ask_question(starkoverflow_dispatcher, token_dispatcher, forum_id);

  // Submit an answer
  let answer_description = "This is my answer";
  let answer_id = submit_answer(
    starkoverflow_dispatcher, starkoverflow_contract_address, question_id, answer_description,
  );
  let answer = starkoverflow_dispatcher.get_answer(answer_id);
  let answer_author = answer.author;

  // Vote on the answer (downvote)
  let voter = ADDRESSES::SPONSOR.get();
  cheat_caller_address(starkoverflow_contract_address, voter, CheatSpan::TargetCalls(1));
  starkoverflow_dispatcher.vote_on_answer(answer_id, false); // false = downvote

  // Check reputation (should remain 0, not go negative)
  let new_reputation = starkoverflow_dispatcher.get_user_reputation(answer_author);
  assert_eq!(new_reputation, 0, "Reputation should remain 0 when downvoted from 0");

  // Check answer vote counts
  let updated_answer = starkoverflow_dispatcher.get_answer(answer_id);
  assert_eq!(updated_answer.upvotes, 0, "Answer should have 0 upvotes");
  assert_eq!(updated_answer.downvotes, 1, "Answer should have 1 downvote");

  // Check voting status
  let has_voted = starkoverflow_dispatcher.has_voted(voter, answer_id);
  assert!(has_voted, "Voter should be marked as having voted");

  let vote = starkoverflow_dispatcher.get_vote(voter, answer_id);
  assert!(!vote, "Vote should be false (downvote)");
}

#[test]
#[should_panic(expected: "User has already voted on this answer")]
fn test_cannot_vote_twice_on_same_answer() {
  let (token_dispatcher, stark_token_address) = deploy_mock_stark_token();
  let (starkoverflow_dispatcher, starkoverflow_contract_address) = deploy_starkoverflow_contract(
    stark_token_address,
  );

  // Setup: Create forum and question
  let forum_id = create_forum(starkoverflow_dispatcher, starkoverflow_contract_address);
  let question_id = ask_question(starkoverflow_dispatcher, token_dispatcher, forum_id);

  // Submit an answer
  let answer_description = "This is my answer";
  let answer_id = submit_answer(
    starkoverflow_dispatcher, starkoverflow_contract_address, question_id, answer_description,
  );

  // First vote (upvote)
  let voter = ADDRESSES::SPONSOR.get();
  cheat_caller_address(starkoverflow_contract_address, voter, CheatSpan::TargetCalls(2));
  starkoverflow_dispatcher.vote_on_answer(answer_id, true); // true = upvote

  // Try to vote again (should panic) - requirement: "Each user can only vote once per answer"
  starkoverflow_dispatcher
    .vote_on_answer(answer_id, false); // Should panic with "User has already voted"
}

#[test]
#[should_panic(expected: "User has already voted on this answer")]
fn test_cannot_vote_again_with_same_vote() {
  let (token_dispatcher, stark_token_address) = deploy_mock_stark_token();
  let (starkoverflow_dispatcher, starkoverflow_contract_address) = deploy_starkoverflow_contract(
    stark_token_address,
  );

  // Setup: Create forum and question
  let forum_id = create_forum(starkoverflow_dispatcher, starkoverflow_contract_address);
  let question_id = ask_question(starkoverflow_dispatcher, token_dispatcher, forum_id);

  // Submit an answer
  let answer_description = "This is my answer";
  let answer_id = submit_answer(
    starkoverflow_dispatcher, starkoverflow_contract_address, question_id, answer_description,
  );

  // First vote (upvote)
  let voter = ADDRESSES::SPONSOR.get();
  cheat_caller_address(starkoverflow_contract_address, voter, CheatSpan::TargetCalls(2));
  starkoverflow_dispatcher.vote_on_answer(answer_id, true); // true = upvote

  // Try to vote again with same vote (should panic) - requirement: "Prevent double voting"
  starkoverflow_dispatcher.vote_on_answer(answer_id, true); // Should panic
}

#[test]
#[should_panic(expected: "Cannot vote on your own answer")]
fn test_cannot_vote_on_own_answer() {
  let (token_dispatcher, stark_token_address) = deploy_mock_stark_token();
  let (starkoverflow_dispatcher, starkoverflow_contract_address) = deploy_starkoverflow_contract(
    stark_token_address,
  );

  // Setup: Create forum and question
  let forum_id = create_forum(starkoverflow_dispatcher, starkoverflow_contract_address);
  let question_id = ask_question(starkoverflow_dispatcher, token_dispatcher, forum_id);

  // Submit an answer
  let answer_description = "This is my answer";
  let answer_id = submit_answer(
    starkoverflow_dispatcher, starkoverflow_contract_address, question_id, answer_description,
  );
  let answer = starkoverflow_dispatcher.get_answer(answer_id);
  let answer_author = answer.author;

  // Try to vote on own answer (should panic)
  cheat_caller_address(starkoverflow_contract_address, answer_author, CheatSpan::TargetCalls(1));
  starkoverflow_dispatcher.vote_on_answer(answer_id, true); // Should panic
}

#[test]
#[should_panic(expected: "Answer does not exist")]
fn test_cannot_vote_on_nonexistent_answer() {
  let (_, stark_token_address) = deploy_mock_stark_token();
  let (starkoverflow_dispatcher, starkoverflow_contract_address) = deploy_starkoverflow_contract(
    stark_token_address,
  );

  let voter = ADDRESSES::SPONSOR.get();
  cheat_caller_address(starkoverflow_contract_address, voter, CheatSpan::TargetCalls(1));

  // Try to vote on non-existent answer (should panic)
  starkoverflow_dispatcher.vote_on_answer(999, true); // Should panic
}

#[test]
fn test_multiple_users_can_vote_on_same_answer() {
  let (token_dispatcher, stark_token_address) = deploy_mock_stark_token();
  let (starkoverflow_dispatcher, starkoverflow_contract_address) = deploy_starkoverflow_contract(
    stark_token_address,
  );

  // Setup: Create forum and question
  let forum_id = create_forum(starkoverflow_dispatcher, starkoverflow_contract_address);
  let question_id = ask_question(starkoverflow_dispatcher, token_dispatcher, forum_id);

  // Submit an answer
  let answer_description = "This is my answer";
  let answer_id = submit_answer(
    starkoverflow_dispatcher, starkoverflow_contract_address, question_id, answer_description,
  );
  let answer = starkoverflow_dispatcher.get_answer(answer_id);
  let answer_author = answer.author;

  // Multiple users vote
  let voter1 = ADDRESSES::SPONSOR.get();
  let voter2 = ADDRESSES::INTRUDER.get();

  // Voter 1 upvotes
  cheat_caller_address(starkoverflow_contract_address, voter1, CheatSpan::TargetCalls(1));
  starkoverflow_dispatcher.vote_on_answer(answer_id, true);

  // Voter 2 upvotes
  cheat_caller_address(starkoverflow_contract_address, voter2, CheatSpan::TargetCalls(1));
  starkoverflow_dispatcher.vote_on_answer(answer_id, true);

  // Check reputation increased by 2
  let reputation = starkoverflow_dispatcher.get_user_reputation(answer_author);
  assert_eq!(reputation, 2, "Reputation should be 2 after two upvotes");

  // Check answer vote counts
  let updated_answer = starkoverflow_dispatcher.get_answer(answer_id);
  assert_eq!(updated_answer.upvotes, 2, "Answer should have 2 upvotes");
  assert_eq!(updated_answer.downvotes, 0, "Answer should have 0 downvotes");

  // Check individual voting status
  assert!(
    starkoverflow_dispatcher.has_voted(voter1, answer_id),
    "Voter1 should be marked as having voted",
  );
  assert!(
    starkoverflow_dispatcher.has_voted(voter2, answer_id),
    "Voter2 should be marked as having voted",
  );
  assert!(starkoverflow_dispatcher.get_vote(voter1, answer_id), "Voter1 vote should be upvote");
  assert!(starkoverflow_dispatcher.get_vote(voter2, answer_id), "Voter2 vote should be upvote");
}

#[test]
fn test_mixed_votes_on_answer() {
  let (token_dispatcher, stark_token_address) = deploy_mock_stark_token();
  let (starkoverflow_dispatcher, starkoverflow_contract_address) = deploy_starkoverflow_contract(
    stark_token_address,
  );

  // Setup: Create forum and question
  let forum_id = create_forum(starkoverflow_dispatcher, starkoverflow_contract_address);
  let question_id = ask_question(starkoverflow_dispatcher, token_dispatcher, forum_id);

  // Submit an answer
  let answer_description = "This is my answer";
  let answer_id = submit_answer(
    starkoverflow_dispatcher, starkoverflow_contract_address, question_id, answer_description,
  );
  let answer = starkoverflow_dispatcher.get_answer(answer_id);
  let answer_author = answer.author;

  // Multiple users vote differently
  let voter1 = ADDRESSES::SPONSOR.get();
  let voter2 = ADDRESSES::INTRUDER.get();

  // Voter 1 upvotes
  cheat_caller_address(starkoverflow_contract_address, voter1, CheatSpan::TargetCalls(1));
  starkoverflow_dispatcher.vote_on_answer(answer_id, true);

  // Voter 2 downvotes
  cheat_caller_address(starkoverflow_contract_address, voter2, CheatSpan::TargetCalls(1));
  starkoverflow_dispatcher.vote_on_answer(answer_id, false);

  // Check reputation (should be 0: +1 from upvote, -1 from downvote)
  let reputation = starkoverflow_dispatcher.get_user_reputation(answer_author);
  assert_eq!(reputation, 0, "Reputation should be 0 after one upvote and one downvote");

  // Check answer vote counts
  let updated_answer = starkoverflow_dispatcher.get_answer(answer_id);
  assert_eq!(updated_answer.upvotes, 1, "Answer should have 1 upvote");
  assert_eq!(updated_answer.downvotes, 1, "Answer should have 1 downvote");
}

#[test]
fn test_reputation_persistence_across_multiple_answers() {
  let (token_dispatcher, stark_token_address) = deploy_mock_stark_token();
  let (starkoverflow_dispatcher, starkoverflow_contract_address) = deploy_starkoverflow_contract(
    stark_token_address,
  );

  // Setup: Create forum and question
  let forum_id = create_forum(starkoverflow_dispatcher, starkoverflow_contract_address);
  let question_id = ask_question(starkoverflow_dispatcher, token_dispatcher, forum_id);

  // Submit first answer
  let answer1_id = submit_answer(
    starkoverflow_dispatcher, starkoverflow_contract_address, question_id, "First answer",
  );
  let answer1 = starkoverflow_dispatcher.get_answer(answer1_id);
  let answer_author = answer1.author;

  // Submit second answer by same author
  cheat_caller_address(starkoverflow_contract_address, answer_author, CheatSpan::TargetCalls(1));
  let answer2_id = starkoverflow_dispatcher.submit_answer(question_id, "Second answer");

  // Vote on first answer
  let voter = ADDRESSES::SPONSOR.get();
  cheat_caller_address(starkoverflow_contract_address, voter, CheatSpan::TargetCalls(1));
  starkoverflow_dispatcher.vote_on_answer(answer1_id, true);

  // Check reputation after first vote
  let reputation_after_first = starkoverflow_dispatcher.get_user_reputation(answer_author);
  assert_eq!(reputation_after_first, 1, "Reputation should be 1 after first vote");

  // Vote on second answer
  cheat_caller_address(starkoverflow_contract_address, voter, CheatSpan::TargetCalls(1));
  starkoverflow_dispatcher.vote_on_answer(answer2_id, true);

  // Check reputation accumulated across answers
  let final_reputation = starkoverflow_dispatcher.get_user_reputation(answer_author);
  assert_eq!(final_reputation, 2, "Reputation should accumulate across multiple answers");
}

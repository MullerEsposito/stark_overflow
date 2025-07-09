use snforge_std::{CheatSpan, cheat_caller_address, byte_array::try_deserialize_bytearray_error};
use super::common::{deploy_starkoverflow_contract, deploy_mock_stark_token, ADDRESSES, ADDRESSESTrait, approve_as_spender, ask_question, create_forum, EIGHTEEN_DECIMALS};
use stark_overflow::StarkOverflow::{IStarkOverflowSafeDispatcher, IStarkOverflowSafeDispatcherTrait, IStarkOverflowDispatcherTrait};
use stark_overflow::MockStarkToken::{IMockStarkTokenDispatcherTrait};
use openzeppelin::access::ownable::interface::{IOwnableDispatcher, IOwnableDispatcherTrait};

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
  let (starkoverflow_dispatcher, starkoverflow_contract_address) = deploy_starkoverflow_contract();

  assert_eq!(starkoverflow_dispatcher.contract_address, starkoverflow_contract_address);
}

#[test]
fn it_should_be_able_to_create_a_forum() {
  let (starkoverflow_dispatcher, starkoverflow_contract_address) = deploy_starkoverflow_contract();  
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
}

#[test]
fn it_should_be_able_to_ask_a_question() {
  let asker = ADDRESSES::ASKER.get();

  let (token_dispatcher, _) = deploy_mock_stark_token();

  assert_eq!(token_dispatcher.balance_of(asker), 100 * EIGHTEEN_DECIMALS, "Asker balance should be == 100");

  let (starkoverflow_dispatcher, starkoverflow_contract_address) = deploy_starkoverflow_contract();

  let amount: u256 = 1 * EIGHTEEN_DECIMALS; // 1 STARK
  
  approve_as_spender(starkoverflow_contract_address, asker, token_dispatcher, amount);

  let forum_id = create_forum(starkoverflow_dispatcher, starkoverflow_contract_address);
  
  let title = "Title of test";
  let description = "Question of test";
  let repository_url = "https://github.com/starkoverflow";
  let tags = array!["tag1", "tag2", "tag3"];
  
  cheat_caller_address(starkoverflow_contract_address, asker, CheatSpan::TargetCalls(1));
  let question_id = starkoverflow_dispatcher.ask_question(
    forum_id,
    title.clone(),
    description.clone(),
    repository_url.clone(),
    tags.clone(),
    amount
  );
  
  // let contract_initial_balance = token_dispatcher.balance_of(starkoverflow_contract_address);

  // let question = starkoverflow_dispatcher.get_question(question_id);

  // assert_eq!(question.id, question_id);
  // assert_eq!(question.forum_id, forum_id);
  // assert_eq!(question.author, asker);
  // assert_eq!(question.description, description);
  // assert_eq!(question.amount, amount);
  // assert_eq!(question.repository_url, repository_url);
  // assert_eq!(question.tags, tags);

  // let final_balance = token_dispatcher.balance_of(starkoverflow_contract_address);
  // assert_eq!(final_balance, starting_balance + amount);
}

// #[test]
// fn it_should_be_able_to_add_funds_to_a_question() {
//   let asker = ADDRESSES::ASKER.get();
//   let sponsor = ADDRESSES::SPONSOR.get();

//   let (starkoverflow_token_dispatcher, starkoverflow_token_address) = deploy_mock_stark_token();
//   let (starkoverflow_dispatcher, starkoverflow_contract_address) = deploy_starkoverflow_contract();

//   cheat_caller_address(starkoverflow_contract_address, asker, CheatSpan::TargetCalls(1));
//   let forum_id = create_forum(starkoverflow_dispatcher);

//   cheat_caller_address(starkoverflow_contract_address, asker, CheatSpan::TargetCalls(1));

//   let question_id = ask_question(starkoverflow_dispatcher, starkoverflow_token_dispatcher, forum_id);

//   cheat_caller_address(starkoverflow_token_address, asker, CheatSpan::TargetCalls(1));
//   starkoverflow_token_dispatcher.mint(sponsor, 100 + EIGHTEEN_DECIMALS); // 100 STARK
//   let additionally_funds = 50;

//   approve_as_spender(sponsor, starkoverflow_contract_address, starkoverflow_token_dispatcher, additionally_funds);
//   cheat_caller_address(starkoverflow_contract_address, sponsor, CheatSpan::TargetCalls(1));

//   starkoverflow_dispatcher.stake_on_question(question_id, additionally_funds);

//   let question = starkoverflow_dispatcher.get_question(question_id);
//   assert_eq!(question.amount, question.amount + additionally_funds);

//   let final_balance = starkoverflow_token_dispatcher.balance_of(starkoverflow_contract_address);
//   assert_eq!(final_balance, question.amount + additionally_funds);
// }

// #[test]
// fn it_should_be_able_to_give_an_answer() {
//   let asker = ADDRESSES::ASKER.get();
//   let responder = ADDRESSES::RESPONDER1.get();

//   let (starkoverflow_token_dispatcher, _) = deploy_mock_stark_token();
//   let (starkoverflow_dispatcher, starkoverflow_contract_address) = deploy_starkoverflow_contract();

//   cheat_caller_address(starkoverflow_contract_address, ADDRESSES::ASKER.get(), CheatSpan::TargetCalls(1));
//   let forum_id = create_forum(starkoverflow_dispatcher);

//   cheat_caller_address(starkoverflow_contract_address, asker, CheatSpan::TargetCalls(1));
//   let question_id = ask_question(starkoverflow_dispatcher, starkoverflow_token_dispatcher, forum_id);

//   cheat_caller_address(starkoverflow_contract_address, responder, CheatSpan::TargetCalls(1));
//   let answer_description = "Answer of test.";
//   let answer_id = starkoverflow_dispatcher.submit_answer(question_id, answer_description.clone());
//   let found_answer = starkoverflow_dispatcher.get_answer(answer_id);

//   assert_eq!(found_answer.id, answer_id);
//   assert_eq!(found_answer.author, responder);
//   assert_eq!(found_answer.description, answer_description);
//   assert_eq!(found_answer.question_id, question_id);
// }

// #[test]
// fn it_should_be_able_to_mark_answer_as_correct() {
//   let asker = ADDRESSES::ASKER.get();
//   let responder = ADDRESSES::RESPONDER1.get();

//   let (starkoverflow_token_dispatcher, _) = deploy_mock_stark_token();
//   let (starkoverflow_dispatcher, starkoverflow_contract_address) = deploy_starkoverflow_contract();

//   cheat_caller_address(starkoverflow_contract_address, asker, CheatSpan::TargetCalls(1));
//   let forum_id = create_forum(starkoverflow_dispatcher);

//   let question_id = ask_question(starkoverflow_dispatcher, starkoverflow_token_dispatcher, forum_id);

//   cheat_caller_address(starkoverflow_contract_address, responder, CheatSpan::TargetCalls(1));
//   let answer_description = "This is a test answer.";
//   let answer_id = starkoverflow_dispatcher.submit_answer(question_id, answer_description.clone());
  
//   cheat_caller_address(starkoverflow_contract_address, asker, CheatSpan::TargetCalls(1));
//   starkoverflow_dispatcher.mark_answer_as_correct(question_id, answer_id);

//   let correct_answer_id = starkoverflow_dispatcher.get_correct_answer(question_id);
//   assert_eq!(correct_answer_id, answer_id);

//   let question_balance = starkoverflow_dispatcher.get_question(question_id).amount;
//   let responder_balance = starkoverflow_token_dispatcher.balance_of(responder);
//   let starkoverflow_contract_balance = starkoverflow_token_dispatcher.balance_of(starkoverflow_contract_address);
//   assert_eq!(starkoverflow_contract_balance, 0);
//   assert_eq!(responder_balance, question_balance);
// }

// #[test]
// fn it_should_not_be_able_to_mark_a_non_existent_answer_as_correct() {
//   let asker = ADDRESSES::ASKER.get();

//   let (starkoverflow_token_dispatcher, _) = deploy_mock_stark_token();
//   let (starkoverflow_dispatcher, starkoverflow_contract_address) = deploy_starkoverflow_contract();
//   let starkoverflow_safe_dispatcher = IStarkOverflowSafeDispatcher { contract_address: starkoverflow_contract_address };

//   let forum_id = create_forum(starkoverflow_dispatcher);

//   let question_id = ask_question(starkoverflow_dispatcher, starkoverflow_token_dispatcher, forum_id);

//   let inexistent_answer_id = 999;
//   cheat_caller_address(starkoverflow_contract_address, asker, CheatSpan::TargetCalls(1));
//   match starkoverflow_safe_dispatcher.mark_answer_as_correct(question_id, inexistent_answer_id) {
//     Result::Ok(_) => panic!("It should not be able to mark a not related answer for a question"),
//     Result::Err(panic_data) => {
//       let error_message = try_deserialize_bytearray_error(panic_data.span()).expect('wrong format');
//       assert_eq!(error_message, "The specified answer does not exist for this question", "Wrong error message received");
//     }
//   };
// }

// #[test]
// fn it_should_not_be_able_to_tag_an_answer_as_correct_but_the_owner() {
//   let responder = ADDRESSES::RESPONDER1.get();
//   let intruder = ADDRESSES::INTRUDER.get();

//   let (starkoverflow_token_dispatcher, _) = deploy_mock_stark_token();
//   let (starkoverflow_dispatcher, starkoverflow_contract_address) = deploy_starkoverflow_contract();
//   let starkoverflow_safe_dispatcher = IStarkOverflowSafeDispatcher { contract_address: starkoverflow_contract_address };

//   let forum_id = create_forum(starkoverflow_dispatcher);

//   let question_id = ask_question(starkoverflow_dispatcher, starkoverflow_token_dispatcher, forum_id);

//   cheat_caller_address(starkoverflow_contract_address, responder, CheatSpan::TargetCalls(1));
//   let answer_description = "This is a test answer.";
//   let answer_id = starkoverflow_dispatcher.submit_answer(question_id, answer_description.clone());

//   cheat_caller_address(starkoverflow_contract_address, intruder, CheatSpan::TargetCalls(1));
//   match starkoverflow_safe_dispatcher.mark_answer_as_correct(question_id, answer_id) {
//     Result::Ok(_) => panic!("It should not be allowed no one than the question author to mark the question as correct"),
//     Result::Err(panic_data) => {
//       let error_message = try_deserialize_bytearray_error(panic_data.span()).expect('wrong format');
//       assert_eq!(error_message, "Only the author of the question can mark the answer as correct", "Wrong error message received");
//     }
//   }; 
// }

// #[test]
// fn it_should_be_able_to_retrive_all_answers_for_a_question() {
//   let responder = ADDRESSES::RESPONDER1.get();

//   let (starkoverflow_token_dispatcher, _) = deploy_mock_stark_token();
//   let (starkoverflow_dispatcher, starkoverflow_contract_address) = deploy_starkoverflow_contract();

//   let forum_id = create_forum(starkoverflow_dispatcher);

//   let question_id = ask_question(starkoverflow_dispatcher, starkoverflow_token_dispatcher, forum_id);

//   cheat_caller_address(starkoverflow_contract_address, responder, CheatSpan::TargetCalls(1));

//   let answer_description_1 = "Answer of test.";
//   let answer_id_1 = starkoverflow_dispatcher.submit_answer(question_id, answer_description_1.clone());
//   let answer_description_2 = "Another answer of test.";
//   let answer_id_2 = starkoverflow_dispatcher.submit_answer(question_id, answer_description_2.clone());

//   let answers = starkoverflow_dispatcher.get_answers(question_id);

//   assert_eq!(answers.len(), 2);
//   assert_eq!(*answers.at(0).id, answer_id_1);
//   assert_eq!(answers.at(0).description, @answer_description_1);
//   assert_eq!(*answers.at(1).id, answer_id_2);
//   assert_eq!(answers.at(1).description, @answer_description_2);
// }

// #[test]
// fn it_should_return_a_void_array_for_when_no_answers() {
//     let (starkoverflow_token_dispatcher, _) = deploy_mock_stark_token();
//     let (starkoverflow_dispatcher, starkoverflow_contract_address) = deploy_starkoverflow_contract();

//     let forum_id = create_forum(starkoverflow_dispatcher);

//     let asker_address = ADDRESSES::ASKER.get();
//     let question_value: u256 = 10 * EIGHTEEN_DECIMALS;

//     approve_as_spender(asker_address, starkoverflow_contract_address, starkoverflow_token_dispatcher, question_value);
    
//     cheat_caller_address(starkoverflow_contract_address, asker_address, CheatSpan::TargetCalls(1));
//     let question_id = ask_question(starkoverflow_dispatcher, starkoverflow_token_dispatcher, forum_id);

//     let answers = starkoverflow_dispatcher.get_answers(question_id);

//     assert(answers.len() == 0, 'Expected 0 answers');
// }

// #[test]
// fn it_should_not_be_able_to_retrieve_answers_for_a_non_existent_question() {
//   let (starkoverflow_token_dispatcher, _) = deploy_mock_stark_token();
//   let (starkoverflow_dispatcher, starkoverflow_contract_address) = deploy_starkoverflow_contract();

//   let forum_id = create_forum(starkoverflow_dispatcher);

//   let asker_address = ADDRESSES::ASKER.get();
//   let question_value: u256 = 10 * EIGHTEEN_DECIMALS;

//   approve_as_spender(asker_address, starkoverflow_contract_address, starkoverflow_token_dispatcher, question_value);
  
//   cheat_caller_address(starkoverflow_contract_address, asker_address, CheatSpan::TargetCalls(1));
//   ask_question(starkoverflow_dispatcher, starkoverflow_token_dispatcher, forum_id);

//   let starkoverflow_safe_dispatcher = IStarkOverflowSafeDispatcher { contract_address: starkoverflow_contract_address };

//   let non_existent_question_id: u256 = 999;

//   cheat_caller_address(starkoverflow_contract_address, ADDRESSES::ASKER.get(), CheatSpan::TargetCalls(1));
//   match starkoverflow_safe_dispatcher.get_answers(non_existent_question_id) {
//     Result::Ok(_) => panic!("It should not be able to retrieve answers for a non-existent question"),
//     Result::Err(panic_data) => {
//       let error_message = try_deserialize_bytearray_error(panic_data.span()).expect('wrong format');
//       assert_eq!(error_message, "Question does not exist", "Wrong error message received");
//     }
//   };
// }

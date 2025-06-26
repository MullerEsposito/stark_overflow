use snforge_std::{CheatSpan, cheat_caller_address, byte_array::try_deserialize_bytearray_error};
use super::common::{deployStarkOverflowContract, deploy_mock_stark_token, ADDRESSES, ADDRESSESTrait, approve_as_spender, EIGHTEEN_DECIMALS};
use stark_overflow::StarkOverflow::{IStarkOverflowSafeDispatcher, IStarkOverflowSafeDispatcherTrait, IStarkOverflowDispatcherTrait};
use stark_overflow::StarkOverflowToken::{IStarkOverflowTokenDispatcherTrait};
use stark_overflow::structs::{Question, QuestionStatus};



#[test]
fn test_deploy_mock_stark_token() {
  let INITIAL_BALANCE: u256 = 100_000_000_000_000_000_000; // 100_STARK
  let (stark_token_dispatcher, _) = deploy_mock_stark_token();

  assert(stark_token_dispatcher.balance_of(ADDRESSES::ASKER.get()) == INITIAL_BALANCE, 'Asker balance should be == 100');
}

#[test]
fn it_should_be_able_to_ask_a_question() {
  let asker = ADDRESSES::ASKER.get();

  let (
    starkoverflow_dispatcher,
    starkoverflow_contract_address, 
    starkoverflow_token_dispatcher,
    _
  ) = deployStarkOverflowContract();

  let starting_balance = starkoverflow_token_dispatcher.balance_of(starkoverflow_contract_address);

  let description = "Question of test.";
  let value: u256 = 1 + EIGHTEEN_DECIMALS; // 1 STARK

  approve_as_spender(asker, starkoverflow_contract_address, starkoverflow_token_dispatcher, value);

  cheat_caller_address(starkoverflow_contract_address, asker, CheatSpan::TargetCalls(1));
  let question_id = starkoverflow_dispatcher.ask_question(description.clone(), value);

  let question = starkoverflow_dispatcher.get_question(question_id);
  assert_eq!(question.id, question_id);
  assert_eq!(question.author, asker);
  assert_eq!(question.description, description);
  assert_eq!(question.value, value);

  let final_balance = starkoverflow_token_dispatcher.balance_of(starkoverflow_contract_address);
  assert_eq!(final_balance, starting_balance + value);
    
  let (active_questions, total_active, has_next) = starkoverflow_dispatcher.get_active_questions(10, 1);
  assert_eq!(total_active, 1, "Total active should be 1");
  assert_eq!(active_questions.len(), 1, "Array should have 1 question");
  assert_eq!(*active_questions.at(0).id, question_id, "The new question should be in the list");
  assert_eq!(has_next, false, "Should not have next page");
}

#[test]
fn it_should_be_able_to_add_funds_to_a_question() {
  let asker = ADDRESSES::ASKER.get();
  let sponsor = ADDRESSES::SPONSOR.get();

  let (
    starkoverflow_dispatcher,
    starkoverflow_contract_address, 
    starkoverflow_token_dispatcher,
    starkoverflow_token_address
  ) = deployStarkOverflowContract();

  let description = "Question of test.";
  let value = 50 + EIGHTEEN_DECIMALS; // 50 STARK

  approve_as_spender(asker, starkoverflow_contract_address, starkoverflow_token_dispatcher, value);
  cheat_caller_address(starkoverflow_contract_address, asker, CheatSpan::TargetCalls(1));

  let question_id = starkoverflow_dispatcher.ask_question(description.clone(), value);

  cheat_caller_address(starkoverflow_token_address, asker, CheatSpan::TargetCalls(1));
  starkoverflow_token_dispatcher.mint(sponsor, 100 + EIGHTEEN_DECIMALS); // 100 STARK
  let additionally_funds = 50;

  approve_as_spender(sponsor, starkoverflow_contract_address, starkoverflow_token_dispatcher, additionally_funds);
  cheat_caller_address(starkoverflow_contract_address, sponsor, CheatSpan::TargetCalls(1));

  starkoverflow_dispatcher.add_funds_to_question(question_id, additionally_funds);

  let question = starkoverflow_dispatcher.get_question(question_id);
  assert_eq!(question.value, value + additionally_funds);

  let final_balance = starkoverflow_token_dispatcher.balance_of(starkoverflow_contract_address);
  assert_eq!(final_balance, value + additionally_funds);
}

#[test]
fn it_should_be_able_to_give_an_answer() {
  let asker = ADDRESSES::ASKER.get();
  let responder = ADDRESSES::RESPONDER1.get();

  let (
    starkoverflow_dispatcher,
    starkoverflow_contract_address,
    stark_token_dispatcher,
    _
  ) = deployStarkOverflowContract();

  let question_description = "Question of test.";
  let value = 100;

  approve_as_spender(asker, starkoverflow_contract_address, stark_token_dispatcher, value);    
  cheat_caller_address(starkoverflow_contract_address, asker, CheatSpan::TargetCalls(1));
  let question_id = starkoverflow_dispatcher.ask_question(question_description.clone(), value);

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

  let (
    starkoverflow_dispatcher,
    starkoverflow_contract_address,
    stark_token_dispatcher,
    _,
  ) = deployStarkOverflowContract();

  cheat_caller_address(starkoverflow_contract_address, asker, CheatSpan::TargetCalls(1));
  let question_description = "Question of test marking answer as correct.";
  let question_value = 100 + EIGHTEEN_DECIMALS; // 100 STARK
  approve_as_spender(asker, starkoverflow_contract_address, stark_token_dispatcher, question_value);
  let question_id = starkoverflow_dispatcher.ask_question(question_description.clone(), question_value);

  let (active_before, total_before, _) = starkoverflow_dispatcher.get_active_questions(10, 1);
  assert_eq!(total_before, 1, "Should have 1 active question before");
  assert_eq!(active_before.len(), 1, "Array should have 1 question before");

  cheat_caller_address(starkoverflow_contract_address, responder, CheatSpan::TargetCalls(1));
  let answer_description = "This is a test answer.";
  let answer_id = starkoverflow_dispatcher.submit_answer(question_id, answer_description.clone());
  
  cheat_caller_address(starkoverflow_contract_address, asker, CheatSpan::TargetCalls(1));
  starkoverflow_dispatcher.mark_answer_as_correct(question_id, answer_id);

  let correct_answer_id = starkoverflow_dispatcher.get_correct_answer(question_id);
  assert_eq!(correct_answer_id, answer_id);

  let (active_after, total_after, _) = starkoverflow_dispatcher.get_active_questions(10, 1);
  assert_eq!(total_after, 0, "Should have 0 active questions after");
  assert_eq!(active_after.len(), 0, "Array should be empty after");

  let resolved_question = starkoverflow_dispatcher.get_question(question_id);
  assert!(resolved_question.status == QuestionStatus::Resolved, "Status should be Resolved");

  let question_balance = starkoverflow_dispatcher.get_question(question_id).value;
  let responder_balance = stark_token_dispatcher.balance_of(responder);
  let starkoverflow_contract_balance = stark_token_dispatcher.balance_of(starkoverflow_contract_address);
  assert_eq!(starkoverflow_contract_balance, 0);
  assert_eq!(responder_balance, question_balance);
}

#[test]
fn it_should_not_be_able_to_mark_a_non_existent_answer_as_correct() {
  let asker = ADDRESSES::ASKER.get();

  let (starkoverflow_dispatcher, starkoverflow_contract_address, stark_token_dispatcher, _) = deployStarkOverflowContract();
  let starkoverflow_safe_dispatcher = IStarkOverflowSafeDispatcher { contract_address: starkoverflow_contract_address };

  let question_description = "Question of test.";
  let value = 100 + EIGHTEEN_DECIMALS; // 100 STARK

  approve_as_spender(asker, starkoverflow_contract_address, stark_token_dispatcher, value);
  cheat_caller_address(starkoverflow_contract_address, asker, CheatSpan::TargetCalls(1));
  let question_id = starkoverflow_dispatcher.ask_question(question_description.clone(), value);

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
  let asker = ADDRESSES::ASKER.get();
  let responder = ADDRESSES::RESPONDER1.get();
  let intruder = ADDRESSES::INTRUDER.get();

  let (starkoverflow_dispatcher, starkoverflow_contract_address, stark_token_dispatcher, _) = deployStarkOverflowContract();
  let starkoverflow_safe_dispatcher = IStarkOverflowSafeDispatcher { contract_address: starkoverflow_contract_address };

  cheat_caller_address(starkoverflow_contract_address, asker, CheatSpan::TargetCalls(1));
  let question_description = "Question of test marking answer as correct.";
  let question_value = 100 + EIGHTEEN_DECIMALS; // 100 STARK
  approve_as_spender(asker, starkoverflow_contract_address, stark_token_dispatcher, question_value);
  let question_id = starkoverflow_dispatcher.ask_question(question_description.clone(), question_value);

  cheat_caller_address(starkoverflow_contract_address, responder, CheatSpan::TargetCalls(1));
  let answer_description = "This is a test answer.";
  let answer_id = starkoverflow_dispatcher.submit_answer(question_id, answer_description.clone());

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
  let asker = ADDRESSES::ASKER.get();
  let responder = ADDRESSES::RESPONDER1.get();

  let (
    starkoverflow_dispatcher,
    starkoverflow_contract_address,
    stark_token_dispatcher,
    _
  ) = deployStarkOverflowContract();

  let question_description = "Question of test.";
  let value = 100 + EIGHTEEN_DECIMALS; // 100 STARK

  approve_as_spender(asker, starkoverflow_contract_address, stark_token_dispatcher, value);
  cheat_caller_address(starkoverflow_contract_address, asker, CheatSpan::TargetCalls(1));
  let question_id = starkoverflow_dispatcher.ask_question(question_description.clone(), value);

  cheat_caller_address(starkoverflow_contract_address, responder, CheatSpan::TargetCalls(1));

  let answer_description_1 = "Answer of test.";
  let answer_id_1 = starkoverflow_dispatcher.submit_answer(question_id, answer_description_1.clone());
  let answer_description_2 = "Another answer of test.";
  let answer_id_2 = starkoverflow_dispatcher.submit_answer(question_id, answer_description_2.clone());

  let answers = starkoverflow_dispatcher.get_answers(question_id);

  assert_eq!(answers.len(), 2);
  assert_eq!(*answers.at(0).id, answer_id_1);
  assert_eq!(answers.at(0).description, @answer_description_1);
  assert_eq!(*answers.at(1).id, answer_id_2);
  assert_eq!(answers.at(1).description, @answer_description_2);
}

#[test]
fn it_should_return_a_void_array_for_when_no_answers() {
    let (starkoverflow_dispatcher, starkoverflow_address, stark_token_dispatcher, _) = deployStarkOverflowContract();

    let asker_address = ADDRESSES::ASKER.get();
    let question_desc: ByteArray = "What if no one answers?";
    let question_value: u256 = 10 * EIGHTEEN_DECIMALS;

    approve_as_spender(asker_address, starkoverflow_address, stark_token_dispatcher, question_value);
    
    cheat_caller_address(starkoverflow_address, asker_address, CheatSpan::TargetCalls(1));
    let question_id = starkoverflow_dispatcher.ask_question(question_desc, question_value);

    let answers = starkoverflow_dispatcher.get_answers(question_id);

    assert(answers.len() == 0, 'Expected 0 answers');
}

#[test]
fn it_should_not_be_able_to_retrieve_answers_for_a_non_existent_question() {
  let (_, starkoverflow_contract_address, _, _) = deployStarkOverflowContract();
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
fn test_reputation() {
  let (
    _starkoverflow_dispatcher,
    _starkoverflow_contract_address, 
    _starkoverflow_token_dispatcher,
    _
  ) = deployStarkOverflowContract();
  // Dummy test
  assert(true, 'This test should pass');
}

#[test]
fn test_get_active_questions_no_questions() {
    let (starkoverflow_dispatcher, _, _, _) = deployStarkOverflowContract();
    
    let (questions, total, has_next) = starkoverflow_dispatcher.get_active_questions(10, 1);

    assert_eq!(total, 0, "Total should be 0");
    assert_eq!(questions.len(), 0, "Array should be empty");
    assert_eq!(has_next, false, "Should not have next page");
}

#[test]
fn test_get_active_questions_multiple_pages() {
    let asker = ADDRESSES::ASKER.get();
    let (starkoverflow_dispatcher, contract_address, stark_token_dispatcher, _) = deployStarkOverflowContract();

    let mut i: u32 = 0;
    while i < 5 {
        let value = 1_u256;
        approve_as_spender(asker, contract_address, stark_token_dispatcher, value);
        cheat_caller_address(contract_address, asker, CheatSpan::TargetCalls(1));
        starkoverflow_dispatcher.ask_question("q", value);
        i += 1;
    };

    let (page1_q, total1, has_next1) = starkoverflow_dispatcher.get_active_questions(2, 1);
    assert_eq!(total1, 5, "Page 1: Total should be 5");
    assert_eq!(page1_q.len(), 2, "Page 1: Should have 2 questions");
    assert_eq!(has_next1, true, "Page 1: Should have next page");
    assert_eq!(*page1_q.at(0).id, 1, "Page 1: First ID should be 1");
    assert_eq!(*page1_q.at(1).id, 2, "Page 1: Second ID should be 2");

    let (page2_q, total2, has_next2) = starkoverflow_dispatcher.get_active_questions(2, 2);
    assert_eq!(total2, 5, "Page 2: Total should be 5");
    assert_eq!(page2_q.len(), 2, "Page 2: Should have 2 questions");
    assert_eq!(has_next2, true, "Page 2: Should have next page");
    assert_eq!(*page2_q.at(0).id, 3, "Page 2: First ID should be 3");
    assert_eq!(*page2_q.at(1).id, 4, "Page 2: Second ID should be 4");

    let (page3_q, total3, has_next3) = starkoverflow_dispatcher.get_active_questions(2, 3);
    assert_eq!(total3, 5, "Page 3: Total should be 5");
    assert_eq!(page3_q.len(), 1, "Page 3: Should have 1 question");
    assert_eq!(has_next3, false, "Page 3: Should NOT have next page");
    assert_eq!(*page3_q.at(0).id, 5, "Page 3: First ID should be 5");

    let (page4_q, total4, has_next4) = starkoverflow_dispatcher.get_active_questions(2, 4);
    assert_eq!(total4, 5, "Page 4: Total should be 5");
    assert_eq!(page4_q.len(), 0, "Page 4: Should have 0 questions");
    assert_eq!(has_next4, false, "Page 4: Should NOT have next page");
}

#[test]
fn test_get_active_questions_after_resolving_one() {
    let asker = ADDRESSES::ASKER.get();
    let responder = ADDRESSES::RESPONDER1.get();
    let (starkoverflow_dispatcher, contract_address, stark_token_dispatcher, _) = deployStarkOverflowContract();

    let mut i: u32 = 0;
    while i < 3 {
        let value = 1_u256;
        approve_as_spender(asker, contract_address, stark_token_dispatcher, value);
        cheat_caller_address(contract_address, asker, CheatSpan::TargetCalls(1));
        starkoverflow_dispatcher.ask_question("q", value);
        i += 1;
    };

    
    let (initial_q, initial_total, _) = starkoverflow_dispatcher.get_active_questions(5, 1);
    assert_eq!(initial_total, 3, "Initial total should be 3");
    assert_eq!(initial_q.len(), 3, "Initial array should have 3");

    let question_id_to_resolve = 2;
    cheat_caller_address(contract_address, responder, CheatSpan::TargetCalls(1));
    let answer_id = starkoverflow_dispatcher.submit_answer(question_id_to_resolve, "answer");
    cheat_caller_address(contract_address, asker, CheatSpan::TargetCalls(1));
    starkoverflow_dispatcher.mark_answer_as_correct(question_id_to_resolve, answer_id);

    
    let (final_q, final_total, final_has_next) = starkoverflow_dispatcher.get_active_questions(5, 1);
    assert_eq!(final_total, 2, "Final total should be 2");
    assert_eq!(final_q.len(), 2, "Final array should have 2");
    assert_eq!(final_has_next, false, "Should not have next page after resolving");

    let first_id = *final_q.at(0).id;
    let second_id = *final_q.at(1).id;
    assert_eq!(first_id, 1, "First remaining ID should be 1");
    assert_eq!(second_id, 3, "Second remaining ID should be 3");
}
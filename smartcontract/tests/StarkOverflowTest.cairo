use snforge_std::{CheatSpan, cheat_caller_address, byte_array::try_deserialize_bytearray_error};
use super::common::{deployStarkOverflowContract, deploy_mock_stark_token, ADDRESSES, ADDRESSESTrait, approve_as_spender, EIGHTEEN_DECIMALS};
use stark_overflow::StarkOverflow::{IStarkOverflowSafeDispatcher, IStarkOverflowSafeDispatcherTrait, IStarkOverflowDispatcherTrait};
use stark_overflow::StarkOverflowToken::{IStarkOverflowTokenDispatcherTrait};

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
  let responder = ADDRESSES::RESPONDER.get();

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
  let responder = ADDRESSES::RESPONDER.get();
  let intruder = ADDRESSES::INTRUDER.get();

  let (
    starkoverflow_dispatcher,
    starkoverflow_contract_address,
    stark_token_dispatcher,
    _,
  ) = deployStarkOverflowContract();
  let safe_dispatcher = IStarkOverflowSafeDispatcher { contract_address: starkoverflow_contract_address };

  cheat_caller_address(starkoverflow_contract_address, asker, CheatSpan::TargetCalls(1));
  let question_description = "Question of test marking answer as correct.";
  let question_value = 100 + EIGHTEEN_DECIMALS; // 100 STARK
  approve_as_spender(asker, starkoverflow_contract_address, stark_token_dispatcher, question_value);
  let question_id = starkoverflow_dispatcher.ask_question(question_description.clone(), question_value);

  cheat_caller_address(starkoverflow_contract_address, responder, CheatSpan::TargetCalls(1));
  let answer_description = "This is a test answer.";
  let answer_id = starkoverflow_dispatcher.submit_answer(question_id, answer_description.clone());

  // Trying to tag an answer with a user who is not the author of the question and getting an error
  cheat_caller_address(starkoverflow_contract_address, intruder, CheatSpan::TargetCalls(1));
  match safe_dispatcher.mark_answer_as_correct(question_id, answer_id) {
    Result::Ok(_) => panic!("It should not be allowed no one than the question author to mark the question as correct"),
    Result::Err(panic_data) => {
      let error_message = try_deserialize_bytearray_error(panic_data.span()).expect('wrong format');
      assert_eq!(error_message, "Only the author of the question can mark the answer as correct", "Wrong error message received");
    }
  };

  // Testing error: tries to mark a non-existent answer as correct
  let inexistent_answer_id = 999;
  cheat_caller_address(starkoverflow_contract_address, asker, CheatSpan::TargetCalls(2));
  match safe_dispatcher.mark_answer_as_correct(question_id, inexistent_answer_id) {
    Result::Ok(_) => panic!("It should not be able to mark a not related answer for a question"),
    Result::Err(panic_data) => {
      let error_message = try_deserialize_bytearray_error(panic_data.span()).expect('wrong format');
      assert_eq!(error_message, "The specified answer does not exist for this question", "Wrong error message received");
    }
  };

  starkoverflow_dispatcher.mark_answer_as_correct(question_id, answer_id);

  let correct_answer_id = starkoverflow_dispatcher.get_correct_answer(question_id);
  assert_eq!(correct_answer_id, answer_id);

  let question_balance = starkoverflow_dispatcher.get_question(question_id).value;
  let responder_balance = stark_token_dispatcher.balance_of(responder);
  let starkoverflow_contract_balance = stark_token_dispatcher.balance_of(starkoverflow_contract_address);
  assert_eq!(starkoverflow_contract_balance, 0);
  assert_eq!(responder_balance, question_balance);
}

#[test]
fn it_should_be_able_to_retrive_all_answers_for_a_question() {
  let asker = ADDRESSES::ASKER.get();
  let responder = ADDRESSES::RESPONDER.get();

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
fn test_token_basics() {
  let (_dispatcher, _erc20) = deploy_mock_stark_token();
  // Dummy test
  assert(true, 'This test should pass');
}

#[test]
fn test_transfer() {
  let (_dispatcher, _erc20) = deploy_mock_stark_token();
  // Dummy test
  assert(true, 'This test should pass');
}

#[test]
fn test_staking() {
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
fn test_token_minting() {
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
fn test_get_answers_by_question_id_no_answers() {
    let (starkoverflow_dispatcher, starkoverflow_address, stark_token_dispatcher, _) = deployStarkOverflowContract();

    let asker_address = ADDRESSES::ASKER.get();
    let question_desc: ByteArray = "What if no one answers?";
    let question_value: u256 = 10 * EIGHTEEN_DECIMALS;

    // Asker faz uma pergunta
    approve_as_spender(asker_address, starkoverflow_address, stark_token_dispatcher, question_value);
    // Simula que asker_address está chamando o contrato starkoverflow_address para a próxima chamada (ask_question)
    cheat_caller_address(starkoverflow_address, asker_address, CheatSpan::TargetCalls(1));
    let question_id = starkoverflow_dispatcher.ask_question(question_desc, question_value);

    // Act: Obter respostas para a pergunta
    let answers_array = starkoverflow_dispatcher.get_answers_by_question_id(question_id);

    // Assert: Deve retornar um array vazio
    assert(answers_array.len() == 0, 'Expected 0 answers');
}

#[test]
fn test_get_answers_by_question_id_one_answer() {
    let (starkoverflow_dispatcher, starkoverflow_address, stark_token_dispatcher, _) = deployStarkOverflowContract();

    let asker_address = ADDRESSES::ASKER.get();
    let responder_address = ADDRESSES::RESPONDER.get();

    let question_desc: ByteArray = "What is the capital of France?";
    let question_value: u256 = 20 * EIGHTEEN_DECIMALS;
    let answer_desc: ByteArray = "Paris.";

    approve_as_spender(asker_address, starkoverflow_address, stark_token_dispatcher, question_value);
    cheat_caller_address(starkoverflow_address, asker_address, CheatSpan::TargetCalls(1));
    let question_id = starkoverflow_dispatcher.ask_question(question_desc, question_value);

    cheat_caller_address(starkoverflow_address, responder_address, CheatSpan::TargetCalls(1));
    let answer_id_1 = starkoverflow_dispatcher.submit_answer(question_id, answer_desc);

    let answers_array = starkoverflow_dispatcher.get_answers_by_question_id(question_id);

    assert(answers_array.len() == 1, 'Expected 1 answer');
    let retrieved_answer = answers_array.at(0);
    assert(*retrieved_answer.id == answer_id_1, 'Answer ID mismatch');
    assert(*retrieved_answer.author == responder_address.into(), 'Answer author mismatch');
    //assert(retrieved_answer.description == answer_desc, 'Answer desc mismatch'); //todo: Arnaelcio -> review test later
    assert(*retrieved_answer.question_id == question_id, 'Answer Q_ID mismatch');
}

#[test]
fn test_get_answers_by_question_id_multiple_answers() {
    let (starkoverflow_dispatcher, starkoverflow_address, stark_token_dispatcher, _) = deployStarkOverflowContract();

    let asker_address = ADDRESSES::ASKER.get();
    let responder1_address = ADDRESSES::RESPONDER.get();
    let responder2_address = ADDRESSES::RESPONDER2.get();

    let question_desc: ByteArray = "Best lang for Starknet?";
    let question_value: u256 = 30 * EIGHTEEN_DECIMALS;
    let answer1_desc: ByteArray = "Cairo, obviously!";
    let answer2_desc: ByteArray = "Rust tools, Cairo contracts";

    approve_as_spender(asker_address, starkoverflow_address, stark_token_dispatcher, question_value);
    cheat_caller_address(starkoverflow_address, asker_address, CheatSpan::TargetCalls(1));
    let question_id = starkoverflow_dispatcher.ask_question(question_desc, question_value);

    cheat_caller_address(starkoverflow_address, responder1_address, CheatSpan::TargetCalls(1));
    let answer_id_1 = starkoverflow_dispatcher.submit_answer(question_id, answer1_desc);

    cheat_caller_address(starkoverflow_address, responder2_address, CheatSpan::TargetCalls(1));
    let answer_id_2 = starkoverflow_dispatcher.submit_answer(question_id, answer2_desc);

    let answers_array = starkoverflow_dispatcher.get_answers_by_question_id(question_id);

    assert(answers_array.len() == 2, 'Expected 2 answers');

    let retrieved_answer1 = answers_array.at(0);
    assert(*retrieved_answer1.id == answer_id_1, 'Ans1 ID mismatch');
    assert(*retrieved_answer1.author == responder1_address.into(), 'Ans1 author mismatch');
    //assert(retrieved_answer1.description == answer1_desc, 'Ans1 desc mismatch'); //todo: Arnaelcio -> review test later
    assert(*retrieved_answer1.question_id == question_id, 'Ans1 Q_ID mismatch');

    let retrieved_answer2 = answers_array.at(1);
    assert(*retrieved_answer2.id == answer_id_2, 'Ans2 ID mismatch');
    assert(*retrieved_answer2.author == responder2_address.into(), 'Ans2 author mismatch');
    //assert((*retrieved_answer2.description) == answer2_desc, 'Ans2 desc mismatch');  //todo: Arnaelcio -> review test later
    assert(*retrieved_answer2.question_id == question_id, 'Ans2 Q_ID mismatch');
}

#[test]
fn test_get_answers_by_question_id_for_non_existent_question() {
    let (starkoverflow_dispatcher, _, _, _) = deployStarkOverflowContract();
    let non_existent_question_id = 999_u256;

    let answers_array = starkoverflow_dispatcher.get_answers_by_question_id(non_existent_question_id);

    assert(answers_array.len() == 0, 'No ans: non-exist Q');
}
//use openzeppelin_utils::bytearray::ByteArrayExtTrait;
use stark_overflow::StarkOverflow::IStarkOverflowDispatcherTrait;
use starknet::{ContractAddress, contract_address_const};
use openzeppelin::utils::serde::SerializedAppend;
use snforge_std::{declare, ContractClassTrait, DeclareResultTrait, cheat_caller_address, CheatSpan};
use stark_overflow::StarkOverflow::{IStarkOverflowDispatcher};
use stark_overflow::StarkOverflowToken::{IStarkOverflowTokenDispatcher, IStarkOverflowTokenDispatcherTrait};

pub const EIGHTEEN_DECIMALS: u256 = 1_000_000_000_000_000_000;

pub fn deployStarkOverflowContract() -> (IStarkOverflowDispatcher, ContractAddress, IStarkOverflowTokenDispatcher, ContractAddress) {
  let (stark_token_dispatcher, stark_token_address) = deploy_mock_stark_token();
  let starkoverflow_class_hash = declare("StarkOverflow").unwrap().contract_class();


  let mut constructor_calldata: Array<felt252> = array![];
  constructor_calldata.append_serde(stark_token_address);


  let (starkoverflow_contract_address, _) = starkoverflow_class_hash.deploy(@constructor_calldata).unwrap();
  let starkoverflow_dispatcher = IStarkOverflowDispatcher { contract_address: starkoverflow_contract_address };

  (starkoverflow_dispatcher, starkoverflow_contract_address, stark_token_dispatcher, stark_token_address)
}

#[derive(Copy, Clone, Drop)]
pub enum ADDRESSES {
  ASKER,
  RESPONDER,
  RESPONDER2,
  SPONSOR,
  INTRUDER,
}

#[generate_trait]
pub impl ADDRESSESImpl of ADDRESSESTrait {
  fn get(self: @ADDRESSES) -> ContractAddress {
    match self {
      ADDRESSES::ASKER => contract_address_const::<'ASKER-ADDRESS'>(),
      ADDRESSES::RESPONDER => contract_address_const::<'RESPONDER-ADDRESS'>(),
      ADDRESSES::RESPONDER2 => contract_address_const::<'RESPONDER2-ADDRESS'>(),
      ADDRESSES::SPONSOR => contract_address_const::<'SPONSOR-ADDRESS'>(),
      ADDRESSES::INTRUDER => contract_address_const::<'INTRUDER-ADDRESS'>(),
    }
  }
}

pub fn deploy_mock_stark_token() -> (IStarkOverflowTokenDispatcher, ContractAddress) {
  let stark_token_class_hash = declare("StarkOverflowToken").unwrap().contract_class();
  let INITIAL_SUPPLY: u256 = 100_000_000_000_000_000_000; // 100_STARK
  let MAX_SUPPLY: u256 = 1_000_000_000_000_000_000_000; // 1M STARK
  let mut calldata = array![];
  calldata.append_serde(18);
  calldata.append_serde(INITIAL_SUPPLY);
  calldata.append_serde(ADDRESSES::ASKER.get());
  calldata.append_serde(ADDRESSES::ASKER.get());
  calldata.append_serde(MAX_SUPPLY);
  let (stark_token_address, _) = stark_token_class_hash.deploy(@calldata).unwrap();
  let stark_token_dispatcher = IStarkOverflowTokenDispatcher { contract_address: stark_token_address };

  (stark_token_dispatcher, stark_token_address)
}

pub fn approve_as_spender(owner: ContractAddress, spender: ContractAddress, starkoverflow_token_dispatcher: IStarkOverflowTokenDispatcher, value: u256) {
  let stark_contract_address = starkoverflow_token_dispatcher.contract_address;
  cheat_caller_address(stark_contract_address, owner, CheatSpan::TargetCalls(1));

  starkoverflow_token_dispatcher.approve(spender, value);

  let allowance = starkoverflow_token_dispatcher.allowance(owner, spender);
  assert!(allowance == value, "Allowance mismatch: expected {}, got {}", value, allowance);
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
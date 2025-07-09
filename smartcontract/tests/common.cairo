use starknet::{ContractAddress, contract_address_const};
use openzeppelin::utils::serde::SerializedAppend;
use snforge_std::{declare, ContractClassTrait, DeclareResultTrait, cheat_caller_address, CheatSpan};
use stark_overflow::StarkOverflow::{IStarkOverflowDispatcher, IStarkOverflowDispatcherTrait};
use stark_overflow::MockStarkToken::{IMockStarkTokenDispatcher, IMockStarkTokenDispatcherTrait};
use openzeppelin::access::ownable::interface::{IOwnableDispatcher, IOwnableDispatcherTrait};

pub const EIGHTEEN_DECIMALS: u256 = 1_000_000_000_000_000_000;

pub fn deploy_mock_stark_token() -> (IMockStarkTokenDispatcher, ContractAddress) {
  let asker = ADDRESSES::ASKER.get();
  let stark_token_class_hash = declare("MockStarkToken").unwrap().contract_class();
  let MAX_SUPPLY: u256 = 1000 * EIGHTEEN_DECIMALS; // 1M STARK

  let mut calldata = array![];
  calldata.append_serde(18); // decimals
  calldata.append_serde(asker); // owner
  calldata.append_serde(MAX_SUPPLY); // max supply
  let (stark_token_address, _) = stark_token_class_hash.deploy(@calldata).unwrap();
  let stark_token_dispatcher = IMockStarkTokenDispatcher { contract_address: stark_token_address };
  
  cheat_caller_address(stark_token_address, asker, CheatSpan::TargetCalls(2));
  stark_token_dispatcher.mint(asker, 100 * EIGHTEEN_DECIMALS);
  stark_token_dispatcher.mint(ADDRESSES::SPONSOR.get(), 100 * EIGHTEEN_DECIMALS);

  (stark_token_dispatcher, stark_token_address)
}

pub fn deploy_starkoverflow_contract() -> (IStarkOverflowDispatcher, ContractAddress) {
  let starkoverflow_class_hash = declare("StarkOverflow").unwrap().contract_class();

  let mut constructor_calldata: Array<felt252> = array![];

  let (starkoverflow_contract_address, _) = starkoverflow_class_hash.deploy(@constructor_calldata).unwrap();
  let starkoverflow_dispatcher = IStarkOverflowDispatcher { contract_address: starkoverflow_contract_address };

  (starkoverflow_dispatcher, starkoverflow_contract_address)
}

pub fn approve_as_spender(spender: ContractAddress, owner: ContractAddress, token_dispatcher: IMockStarkTokenDispatcher, value: u256) {
  let token_address = token_dispatcher.contract_address;

  cheat_caller_address(token_address, owner, CheatSpan::TargetCalls(1));
  token_dispatcher.approve(spender, value);

  let allowance = token_dispatcher.allowance(owner, spender);
  assert!(allowance == value, "Allowance mismatch: expected {}, got {}", value, allowance);
}

pub fn create_forum(starkoverflow_dispatcher: IStarkOverflowDispatcher, starkoverflow_contract_address: ContractAddress) -> u256 {
  let ownable_dispatcher = IOwnableDispatcher { contract_address: starkoverflow_contract_address };
  let owner = ownable_dispatcher.owner();
  let forum_name = "Forum of test";
  let forum_icon_url = "https://example.com/icon.png";

  
  cheat_caller_address(starkoverflow_contract_address, owner, CheatSpan::TargetCalls(1));
  let forum_id = starkoverflow_dispatcher.create_forum(forum_name, forum_icon_url);

  forum_id
}

pub fn ask_question(starkoverflow_dispatcher: IStarkOverflowDispatcher, token_dispatcher: IMockStarkTokenDispatcher, forum_id: u256) -> u256 {
  let asker = ADDRESSES::ASKER.get();
  let title = "Title of test";
  let question_description = "Question of test.";
  let repository_url = "https://github.com/starkoverflow";
  let tags = array!["tag1", "tag2", "tag3"];
  let amount = 1 + EIGHTEEN_DECIMALS; // 1 STARK
  let starkoverflow_contract_address = starkoverflow_dispatcher.contract_address;
  
  approve_as_spender(asker, starkoverflow_contract_address, token_dispatcher, amount);
  let question_id = starkoverflow_dispatcher.ask_question(
    forum_id,
    title,
    question_description,
    repository_url,
    tags,
    amount
  );

  question_id
}

#[derive(Copy, Clone, Drop)]
pub enum ADDRESSES {
  ASKER,
  RESPONDER1,
  RESPONDER2,
  SPONSOR,
  INTRUDER,
}

#[generate_trait]
pub impl ADDRESSESImpl of ADDRESSESTrait {
  fn get(self: @ADDRESSES) -> ContractAddress {
    match self {
      ADDRESSES::ASKER => contract_address_const::<'ASKER-ADDRESS'>(),
      ADDRESSES::RESPONDER1 => contract_address_const::<'RESPONDER-ADDRESS-ONE'>(),
      ADDRESSES::RESPONDER2 => contract_address_const::<'RESPONDER-ADDRESS-TWO'>(),
      ADDRESSES::SPONSOR => contract_address_const::<'SPONSOR-ADDRESS'>(),
      ADDRESSES::INTRUDER => contract_address_const::<'INTRUDER-ADDRESS'>(),
    }
  }
}
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
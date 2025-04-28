use starknet::{ContractAddress, contract_address_const};
use openzeppelin::utils::serde::SerializedAppend;
use snforge_std::{declare, ContractClassTrait, DeclareResultTrait, cheat_caller_address, CheatSpan};
use stark_overflow::StarkOverflow::{IStarkOverflowDispatcher};
use stark_overflow::mock_contracts::MockSTARKToken::{IERC20Dispatcher, IERC20DispatcherTrait};

pub const EIGHTEEN_DECIMALS: u256 = 1_000_000_000_000_000_000;

pub fn deployStarkOverflowContract() -> (IStarkOverflowDispatcher, ContractAddress, IERC20Dispatcher) {
    let (stark_token_dispatcher, stark_token_address) = deploy_mock_stark_token();
    let starkoverflow_class_hash = declare("StarkOverflow").unwrap().contract_class();

    let mut constructor_calldata: Array<felt252> = array![];
    constructor_calldata.append_serde(stark_token_address);

    let (starkoverflow_contract_address, _) = starkoverflow_class_hash.deploy(@constructor_calldata).unwrap();
    let starkoverflow_dispatcher = IStarkOverflowDispatcher { contract_address: starkoverflow_contract_address };

    (starkoverflow_dispatcher, starkoverflow_contract_address, stark_token_dispatcher)
}

#[derive(Copy, Clone, Drop)]
pub enum ADDRESSES {
    ASKER,
    RESPONDER,
    SPONSOR,
    INTRUDER,
}

#[generate_trait]
pub impl ADDRESSESImpl of ADDRESSESTrait {
    fn get(self: @ADDRESSES) -> ContractAddress {
        match self {
            ADDRESSES::ASKER => contract_address_const::<'ASKER-ADDRESS'>(),
            ADDRESSES::RESPONDER => contract_address_const::<'RESPONDER-ADDRESS'>(),
            ADDRESSES::SPONSOR => contract_address_const::<'SPONSOR-ADDRESS'>(),
            ADDRESSES::INTRUDER => contract_address_const::<'INTRUDER-ADDRESS'>(),
        }
    }
}

pub fn deploy_mock_stark_token() -> (IERC20Dispatcher, ContractAddress) {
    let stark_token_class_hash = declare("MockSTARKToken").unwrap().contract_class();
    let INITIAL_SUPPLY: u256 = 100_000_000_000_000_000_000; // 100_STARK
    let mut calldata = array![];
    calldata.append_serde(INITIAL_SUPPLY);
    calldata.append_serde(ADDRESSES::ASKER.get());
    let (stark_token_address, _) = stark_token_class_hash.deploy(@calldata).unwrap();
    let stark_token_dispatcher = IERC20Dispatcher { contract_address: stark_token_address };

    (stark_token_dispatcher, stark_token_address)
}

pub fn approve_as_spender(owner: ContractAddress, spender: ContractAddress, stark_contract_dispatcher: IERC20Dispatcher, value: u256) {
    let stark_contract_address = stark_contract_dispatcher.contract_address;
    cheat_caller_address(stark_contract_address, owner, CheatSpan::TargetCalls(1));

    stark_contract_dispatcher.approve(spender, value);

    let allowance = stark_contract_dispatcher.allowance(owner, spender);
    assert!(allowance == value, "Allowance mismatch: expected {}, got {}", value, allowance);
}

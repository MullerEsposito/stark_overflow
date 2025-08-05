use starknet::{ContractAddress, contract_address_const};

pub const EIGHTEEN_DECIMALS: u256 = 1_000_000_000_000_000_000;

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

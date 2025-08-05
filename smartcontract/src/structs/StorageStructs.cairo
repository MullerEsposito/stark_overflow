use starknet::ContractAddress;
use starknet::storage::Vec;
use stark_overflow::structs::CommonStructs::QuestionStatus;

#[derive(Drop)]
#[starknet::storage_node]
pub struct Question {
    pub id: u256,
    pub forum_id: u256,
    pub title: ByteArray,
    pub author: ContractAddress,
    pub description: ByteArray,
    pub amount: u256,
    pub repository_url: ByteArray,
    pub tags: Vec<ByteArray>,
    pub status: QuestionStatus,
}

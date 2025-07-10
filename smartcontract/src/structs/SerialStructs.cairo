use starknet::ContractAddress;
use stark_overflow::structs::CommonStructs::QuestionStatus;

#[derive(Drop, Serde)]
pub struct QuestionResponse {
  pub id: u256,
  pub forum_id: u256,
  pub title: ByteArray,
  pub author: ContractAddress,
  pub description: ByteArray,
  pub amount: u256,
  pub repository_url: ByteArray,
  pub tags: Array<ByteArray>,
  pub status: QuestionStatus,
}
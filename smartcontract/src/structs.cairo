use starknet::ContractAddress;

#[derive(Drop, Serde, PartialEq, starknet::Store)]
pub enum QuestionStatus {
  #[default]
  Open,
  Resolved,
}

#[derive(Drop, Serde, starknet::Store)]
pub struct Question {
  pub id: u256,
  pub author: ContractAddress,
  pub description: ByteArray,
  pub value: u256,
  pub status: QuestionStatus,
}

#[derive(Drop, Serde, starknet::Store)]
pub struct Answer {
  pub id: u256,
  pub author: ContractAddress,
  pub description: ByteArray,
  pub question_id: u256,
}

pub struct QuestionId {
  pub id: u256,
}
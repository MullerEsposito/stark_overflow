use starknet::ContractAddress;

#[derive(Drop, Serde, PartialEq, starknet::Store)]
pub enum QuestionStatus {
  #[default]
  Open,
  Resolved,
}

#[derive(Drop, Serde, starknet::Store)]
pub struct Forum {
  pub id: u256,
  pub name: ByteArray,
  pub icon_url: ByteArray,
  pub amount: u256,
  pub total_questions: u256,
}

#[derive(Drop, Serde, starknet::Store)]
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
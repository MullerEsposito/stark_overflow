use starknet::ContractAddress;

#[derive(Drop, Serde, starknet::Store)]
pub struct Forum {
  pub id: u256,
  pub name: ByteArray,
  pub icon_url: ByteArray,
  pub amount: u256,
  pub total_questions: u256,
  pub deleted: bool,
}

#[derive(Drop, Serde, starknet::Store)]
pub struct Answer {
  pub id: u256,
  pub author: ContractAddress,
  pub description: ByteArray,
  pub question_id: u256,
}

#[derive(Drop, Serde, PartialEq, starknet::Store)]
pub enum QuestionStatus {
  #[default]
  Open,
  Resolved,
}

pub struct QuestionId {
	pub id: u256,
}
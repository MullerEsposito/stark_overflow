use starknet::ContractAddress;

#[derive(Drop, starknet::Event)]
pub struct QuestionAnswered {
  #[key]
  pub id: u256,
  pub question_id: u256,
  pub answer_id: u256,
  pub date: u256,
}

#[derive(Drop, starknet::Event)]
pub struct ChosenAnswer {
  #[key]
  pub id: u256,
  pub question_id: u256,
  pub answer_id: u256,
  pub author_address: ContractAddress,
  pub date: u256,
}

#[derive(Drop, starknet::Event)]
pub struct QuestionStaked {
  #[key]
  pub staker: ContractAddress,
  #[key]
  pub question_id: u256,
  pub amount: u256
}

#[derive(Drop, starknet::Event)]
pub struct ReputationAdded {
  #[key]
  pub user: ContractAddress,
  pub amount: u256,
  pub new_total: u256
}

#[derive(Drop, starknet::Event)]
pub struct StakeStarted {
  #[key]
  pub staker: ContractAddress,
  pub amount: u256,
  pub timestamp: u64
}

#[derive(Drop, starknet::Event)]
pub struct StakeWithdrawn {
  #[key]
  pub staker: ContractAddress,
  pub amount: u256,
  pub rewards: u256
}

#[derive(Drop, starknet::Event)]
pub struct VoteCast {
  #[key]
  pub voter: ContractAddress,
  #[key]
  pub answer_id: u256,
  pub is_upvote: bool,
  pub answer_author: ContractAddress,
  pub reputation_change: u256,
}
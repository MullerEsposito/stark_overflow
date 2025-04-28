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
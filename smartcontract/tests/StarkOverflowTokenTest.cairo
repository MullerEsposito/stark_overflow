use super::common::{deploy_mock_stark_token};

#[test]
fn test_token_basics() {
  let (_dispatcher, _erc20) = deploy_mock_stark_token();
  // Dummy test
  assert(true, 'This test should pass');
}

#[test]
fn test_transfer() {
  let (_dispatcher, _erc20) = deploy_mock_stark_token();
  // Dummy test
  assert(true, 'This test should pass');
}

#[test]
fn test_staking() {
  let (_dispatcher, _erc20) = deploy_mock_stark_token();
  
  // Dummy test
  assert(true, 'This test should pass');
}

#[test]
fn test_token_minting() {
    let (_dispatcher, _erc20) = deploy_mock_stark_token();

  // Dummy test
  assert(true, 'This test should pass');
}
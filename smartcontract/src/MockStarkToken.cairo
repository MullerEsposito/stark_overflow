use starknet::ContractAddress;

#[starknet::interface]
pub trait IMockStarkToken<T> {
  // ERC20 Standard Functions
  fn name(self: @T) -> ByteArray;
  fn symbol(self: @T) -> ByteArray;
  fn decimals(self: @T) -> u8;
  fn total_supply(self: @T) -> u256;
  fn balance_of(self: @T, account: ContractAddress) -> u256;
  fn allowance(self: @T, owner: ContractAddress, spender: ContractAddress) -> u256;
  fn transfer(ref self: T, recipient: ContractAddress, amount: u256) -> bool;
  fn transfer_from(ref self: T, sender: ContractAddress, recipient: ContractAddress, amount: u256) -> bool;
  fn approve(ref self: T, spender: ContractAddress, amount: u256) -> bool;
  fn max_supply(self: @T) -> u256;

  // Minting functions
  fn mint_tokens(ref self: T, to: ContractAddress, amount: u256);

  // Admin Functions
  fn mint(ref self: T, recipient: ContractAddress, amount: u256);
  fn burn(ref self: T, amount: u256);
  fn burn_from(ref self: T, account: ContractAddress, amount: u256);
}

#[starknet::contract]
mod MockStarkToken {
  use starknet::{ContractAddress, get_caller_address};
  use core::traits::Into;
  use core::array::ArrayTrait;

  // OpenZeppelin dependencies
  use openzeppelin_token::erc20::{ERC20Component, ERC20HooksEmptyImpl};
  use openzeppelin_access::ownable::OwnableComponent;

  // Use components
  component!(path: ERC20Component, storage: erc20, event: ERC20Event);
  component!(path: OwnableComponent, storage: ownable, event: OwnableEvent);

  // Implementation of hooks required by components
  impl ERC20HooksImpl = ERC20HooksEmptyImpl<ContractState>;

  // Implement traits for components
  impl ERC20Impl = ERC20Component::ERC20Impl<ContractState>;
  impl ERC20MetadataImpl = ERC20Component::ERC20MetadataImpl<ContractState>;
  impl OwnableMixinImpl = OwnableComponent::OwnableMixinImpl<ContractState>;
  impl ERC20InternalImpl = ERC20Component::InternalImpl<ContractState>;
  impl OwnableInternalImpl = OwnableComponent::InternalImpl<ContractState>;

  #[storage]
  struct Storage {
    // Component storage
    #[substorage(v0)]
    erc20: ERC20Component::Storage,
    #[substorage(v0)]
    ownable: OwnableComponent::Storage,

    // Cap for minting
    max_supply: u256,
  }

  // Events
  #[event]
  #[derive(Drop, starknet::Event)]
  enum Event {
    #[flat]
    ERC20Event: ERC20Component::Event,    
    #[flat]
    OwnableEvent: OwnableComponent::Event,
  }

  #[constructor]
  fn constructor(ref self: ContractState, decimals: u8, owner: ContractAddress, max_supply: u256) {
    self.erc20.initializer("STARK", "STRK");
    self.ownable.initializer(owner);
    self.max_supply.write(max_supply);
  }

  // Implementation of StarkOverflowToken functions
  #[abi(embed_v0)]
  impl MockStarkTokenImpl of super::IMockStarkToken<ContractState> {
    fn name(self: @ContractState) -> ByteArray {
      ERC20MetadataImpl::name(self)
    }

    fn symbol(self: @ContractState) -> ByteArray {
      ERC20MetadataImpl::symbol(self)
    }

    fn decimals(self: @ContractState) -> u8 {
      ERC20MetadataImpl::decimals(self)
    }

    fn total_supply(self: @ContractState) -> u256 {
      ERC20Impl::total_supply(self)
    }

    fn balance_of(self: @ContractState, account: ContractAddress) -> u256 {
      ERC20Impl::balance_of(self, account)
    }

    fn allowance(self: @ContractState, owner: ContractAddress, spender: ContractAddress) -> u256 {
      ERC20Impl::allowance(self, owner, spender)
    }

    fn transfer(ref self: ContractState, recipient: ContractAddress, amount: u256) -> bool {
      ERC20Impl::transfer(ref self, recipient, amount)
    }

    fn transfer_from(ref self: ContractState, sender: ContractAddress, recipient: ContractAddress, amount: u256) -> bool {
      ERC20Impl::transfer_from(ref self, sender, recipient, amount)
    }

    fn approve(ref self: ContractState, spender: ContractAddress, amount: u256) -> bool {
      ERC20Impl::approve(ref self, spender, amount)
    }

    fn mint_tokens(ref self: ContractState, to: ContractAddress, amount: u256) {
      // Only owner can mint
      self.ownable.assert_only_owner();

      // Get current supply
      let current_supply = ERC20Impl::total_supply(@self);

      // Check max supply
      let max_supply = self.max_supply.read();
      assert(current_supply + amount <= max_supply, 'Exceeds max supply');

      // Mint tokens
      self.erc20.mint(to, amount);
    }

    fn max_supply(self: @ContractState) -> u256 {
      self.max_supply.read()
    }

    // Admin functions
    fn mint(ref self: ContractState, recipient: ContractAddress, amount: u256) {
      self.mint_tokens(recipient, amount);
    }

    fn burn(ref self: ContractState, amount: u256) {
      let caller = get_caller_address();
      self.erc20.burn(caller, amount);
    }

    fn burn_from(ref self: ContractState, account: ContractAddress, amount: u256) {
      // Only owner can burn from another account
      self.ownable.assert_only_owner();
      self.erc20.burn(account, amount);
    }
  }

  // Expose other standard interfaces
  #[abi(embed_v0)]
  impl ERC20CamelOnlyImpl = ERC20Component::ERC20CamelOnlyImpl<ContractState>;
}
use starknet::ContractAddress;

#[starknet::interface]
pub trait IStarkOverflowToken<TContractState> {
    // ERC20 Standard Functions
    fn name(self: @TContractState) -> ByteArray;
    fn symbol(self: @TContractState) -> ByteArray;
    fn decimals(self: @TContractState) -> u8;
    fn total_supply(self: @TContractState) -> u256;
    fn balance_of(self: @TContractState, account: ContractAddress) -> u256;
    fn allowance(self: @TContractState, owner: ContractAddress, spender: ContractAddress) -> u256;
    fn transfer(ref self: TContractState, recipient: ContractAddress, amount: u256) -> bool;
    fn transfer_from(
        ref self: TContractState, sender: ContractAddress, recipient: ContractAddress, amount: u256
    ) -> bool;
    fn approve(ref self: TContractState, spender: ContractAddress, amount: u256) -> bool;
    
    // Staking Functions
    fn stake(ref self: TContractState, amount: u256);
    fn withdraw_stake(ref self: TContractState);
    fn get_claimable_rewards(self: @TContractState, staker: ContractAddress) -> u256;
    fn get_stake_info(self: @TContractState, staker: ContractAddress) -> (u256, u64, u256);
    
    // Question staking functions
    fn stake_on_question(ref self: TContractState, question_id: u256, amount: u256);
    fn get_total_staked_on_question(self: @TContractState, question_id: u256) -> u256;
    fn get_staked_amount(self: @TContractState, staker: ContractAddress, question_id: u256) -> u256;
    
    // Reputation system
    fn add_reputation(ref self: TContractState, user: ContractAddress, amount: u256);
    fn get_reputation(self: @TContractState, user: ContractAddress) -> u256;
    
    // Minting functions
    fn mint_tokens(ref self: TContractState, to: ContractAddress, amount: u256);
    
    // Admin Functions
    fn mint(ref self: TContractState, recipient: ContractAddress, amount: u256);
    fn burn(ref self: TContractState, amount: u256);
    fn burn_from(ref self: TContractState, account: ContractAddress, amount: u256);
    
    // Distribution Functions
    fn distribute_rewards(ref self: TContractState, question_id: u256, answer_id: u256);
}

#[starknet::contract]
mod StarkOverflowToken {
    use openzeppelin_token::erc20::interface::{IERC20, IERC20Metadata};
    use starknet::{ContractAddress, get_caller_address, get_contract_address, storage::Map};
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
    
    // Contract storage
    #[storage]
    struct Storage {
        // Component storage
        #[substorage(v0)]
        erc20: ERC20Component::Storage,
        #[substorage(v0)]
        ownable: OwnableComponent::Storage,
        
        // Staking related storage
        staked_balances: Map<ContractAddress, u256>,
        staking_start_time: Map<ContractAddress, u64>,
        staking_rewards_rate: u256,
        
        // Question staking storage
        question_stakes: Map<(ContractAddress, u256), u256>, // (user, question_id) -> amount
        total_question_stakes: Map<u256, u256>, // question_id -> total staked
        
        // Reputation system
        reputation: Map<ContractAddress, u256>,
        
        // Cap for minting
        max_supply: u256,
        
        // Minimum staking period
        min_staking_period: u64,
    }
    
    // Event structs
    #[derive(Drop, starknet::Event)]
    struct StakeStarted {
        #[key]
        staker: ContractAddress,
        amount: u256,
        timestamp: u64
    }
    
    #[derive(Drop, starknet::Event)]
    struct StakeWithdrawn {
        #[key]
        staker: ContractAddress,
        amount: u256,
        rewards: u256
    }
    
    #[derive(Drop, starknet::Event)]
    struct ReputationAdded {
        #[key]
        user: ContractAddress,
        amount: u256,
        new_total: u256
    }
    
    #[derive(Drop, starknet::Event)]
    struct QuestionStaked {
        #[key]
        staker: ContractAddress,
        #[key]
        question_id: u256,
        amount: u256
    }
    
    // Events
    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        #[flat]
        ERC20Event: ERC20Component::Event,
        #[flat]
        OwnableEvent: OwnableComponent::Event,
        StakeStarted: StakeStarted,
        StakeWithdrawn: StakeWithdrawn,
        ReputationAdded: ReputationAdded,
        QuestionStaked: QuestionStaked
    }
    
    // Constructor
    #[constructor]
    fn constructor(
        ref self: ContractState,
        name: ByteArray,
        symbol: ByteArray,
        decimals: u8,
        initial_supply: u256,
        recipient: ContractAddress,
        owner: ContractAddress,
        max_supply: u256
    ) {
        // Initialize ERC20
        self.erc20.initializer(name, symbol);
        
        // Mint initial supply if needed
        if initial_supply > 0 {
            self.erc20.mint(recipient, initial_supply);
        }
        
        // Initialize Ownable
        self.ownable.initializer(owner);
        
        // Set staking rate and max supply
        self.staking_rewards_rate.write(10000000000000000); // 0.01 tokens per second per token staked
        self.max_supply.write(max_supply);
    }
    
    // Implementation of StarkOverflowToken functions
    #[abi(embed_v0)]
    impl StarkOverflowTokenImpl of super::IStarkOverflowToken<ContractState> {
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
        
        fn transfer_from(
            ref self: ContractState, sender: ContractAddress, recipient: ContractAddress, amount: u256
        ) -> bool {
            ERC20Impl::transfer_from(ref self, sender, recipient, amount)
        }
        
        fn approve(ref self: ContractState, spender: ContractAddress, amount: u256) -> bool {
            ERC20Impl::approve(ref self, spender, amount)
        }
        
        fn stake(ref self: ContractState, amount: u256) {
            // Get caller address
            let caller = get_caller_address();
            
            // Ensure amount is greater than 0
            assert(amount > 0, 'Amount must be greater than 0');
            
            // Check if already staked
            let current_stake = self.staked_balances.read(caller);
            if current_stake > 0 {
                // Withdraw current stake and rewards
                self._withdraw_stake(caller);
            }
            
            // Transfer tokens from caller to contract
            let this_contract = get_contract_address();
            ERC20Impl::transfer_from(ref self, caller, this_contract, amount);
            
            // Update staking
            self.staked_balances.write(caller, amount);
            
            // Get timestamp
            let block_timestamp = starknet::get_block_timestamp();
            self.staking_start_time.write(caller, block_timestamp);
            
            // Emit event
            self.emit(StakeStarted { staker: caller, amount, timestamp: block_timestamp });
        }
        
        fn withdraw_stake(ref self: ContractState) {
            let caller = get_caller_address();
            self._withdraw_stake(caller);
        }
        
        fn get_claimable_rewards(self: @ContractState, staker: ContractAddress) -> u256 {
            let staked_amount = self.staked_balances.read(staker);
            
            if staked_amount == 0 {
                return 0;
            }
            
            let start_time = self.staking_start_time.read(staker);
            let current_time = starknet::get_block_timestamp();
            let duration = current_time - start_time;
            
            let rate = self.staking_rewards_rate.read();
            
            // Calculate rewards: staked_amount * rate * duration / 10^18
            let duration_u256 = u256 { low: duration.into(), high: 0 };
            let reward = (staked_amount * rate * duration_u256) / 1000000000000000000;
            
            reward
        }
        
        fn get_stake_info(self: @ContractState, staker: ContractAddress) -> (u256, u64, u256) {
            let staked_amount = self.staked_balances.read(staker);
            let start_time = self.staking_start_time.read(staker);
            let rewards = self.get_claimable_rewards(staker);
            
            (staked_amount, start_time, rewards)
        }
        
        // Funciones para staking en preguntas
        fn stake_on_question(ref self: ContractState, question_id: u256, amount: u256) {
            let caller = get_caller_address();
            
            // Ensure amount is greater than 0
            assert(amount > 0, 'Amount must be greater than 0');
            
            // Transfer tokens from caller to contract
            let this_contract = get_contract_address();
            ERC20Impl::transfer_from(ref self, caller, this_contract, amount);
            
            // Update question staking records
            let current_stake = self.question_stakes.read((caller, question_id));
            let new_stake = current_stake + amount;
            self.question_stakes.write((caller, question_id), new_stake);
            
            // Update total staked for question
            let total_staked = self.total_question_stakes.read(question_id);
            self.total_question_stakes.write(question_id, total_staked + amount);
            
            // Emit event
            self.emit(QuestionStaked { staker: caller, question_id, amount });
        }
        
        fn get_total_staked_on_question(self: @ContractState, question_id: u256) -> u256 {
            self.total_question_stakes.read(question_id)
        }
        
        fn get_staked_amount(self: @ContractState, staker: ContractAddress, question_id: u256) -> u256 {
            self.question_stakes.read((staker, question_id))
        }
        
        fn add_reputation(ref self: ContractState, user: ContractAddress, amount: u256) {
            // Only owner can add reputation
            self.ownable.assert_only_owner();
            
            // Update reputation
            let current_rep = self.reputation.read(user);
            let new_rep = current_rep + amount;
            self.reputation.write(user, new_rep);
            
            // Emit event
            self.emit(ReputationAdded { user, amount, new_total: new_rep });
        }
        
        fn get_reputation(self: @ContractState, user: ContractAddress) -> u256 {
            self.reputation.read(user)
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
        
        // Distribution function
        fn distribute_rewards(ref self: ContractState, question_id: u256, answer_id: u256) {
            // Not implemented yet
        }
    }
    
    // Expose other standard interfaces
    #[abi(embed_v0)]
    impl ERC20CamelOnlyImpl = ERC20Component::ERC20CamelOnlyImpl<ContractState>;
    
    // Internal function implementations
    #[generate_trait]
    impl StarkOverflowInternalImpl of StarkOverflowInternalTrait {
        fn _withdraw_stake(ref self: ContractState, staker: ContractAddress) {
            let staked_amount = self.staked_balances.read(staker);
            
            // Ensure there's a stake to withdraw
            assert(staked_amount > 0, 'No stake to withdraw');
            
            // Check minimum staking period
            let start_time = self.staking_start_time.read(staker);
            let current_time = starknet::get_block_timestamp();
            let min_staking_period = self.min_staking_period.read();
            assert(current_time >= start_time + min_staking_period, 'Minimum staking period not met');
            
            // Calculate rewards
            let rewards = self.get_claimable_rewards(staker);
            
            // Reset staking info
            self.staked_balances.write(staker, 0);
            self.staking_start_time.write(staker, 0);
            
            // Transfer staked tokens back
            ERC20Impl::transfer(ref self, staker, staked_amount);
            
            // Mint rewards if any
            if rewards > 0 {
                // Check max supply
                let current_supply = ERC20Impl::total_supply(@self);
                let max_supply = self.max_supply.read();
                
                // Only mint rewards if it doesn't exceed max supply
                if current_supply + rewards <= max_supply {
                    self.erc20.mint(staker, rewards);
                }
            }
            
            // Emit event
            self.emit(StakeWithdrawn { staker, amount: staked_amount, rewards });
        }
    }
} 
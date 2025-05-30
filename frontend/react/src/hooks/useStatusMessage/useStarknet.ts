import { connect, disconnect } from 'starknetkit';
import type { Account } from 'starknet';
import { useState } from 'react';
export const useStarknet = () => {
  const [account, setAccount] = useState<Account | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  interface WalletWithAccount {
  account?: Account | null;
  // other wallet properties if needed
}
  const connectWallet = async () => {
    try {
      // connect() opens the wallet modal or connects silently based on options
      const { wallet } = await connect({ modalMode: 'canAsk' });
      if (wallet) {
  const typedWallet = wallet as WalletWithAccount;
  setAccount(typedWallet.account ?? null);
  setIsConnected(!!typedWallet.account);
}
    } catch (error) {
      console.error('Wallet connection failed', error);
    }
  };

  const disconnectWallet = async () => {
    await disconnect();
    setAccount(null);
    setIsConnected(false);
  };

  return {
    account,
    isConnected,
    connectWallet,
    disconnectWallet,
  };
};

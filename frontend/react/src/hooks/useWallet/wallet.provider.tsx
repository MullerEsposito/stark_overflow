import { ReactNode, useEffect, useState } from "react";
import { WalletContext } from "./wallet.context";
import { useAccount, useConnect } from "@starknet-react/core";

export function WalletProvider({ children }: { children: ReactNode }) {
  const { isConnected = false, address, status } = useAccount();
  const { connectors } = useConnect();
  const [isWalletDetected, setIsWalletDetected] = useState(false); // Manage wallet detection state
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Check if any wallet is available in the browser
  useEffect(() => {
    const hasWallet = connectors.some(connector => connector.available());
    setIsWalletDetected(hasWallet);
  }, [connectors]);
  
  
  // Function to open the connect modal from anywhere in the app
  const openConnectModal = () => {
    setIsModalOpen(true);
  };

  // Function to close the connect modal
  const closeConnectModal = () => {
    setIsModalOpen(false);
  };
  
  // Context value
  const value = {
    isConnected,
    address,
    isConnecting: status === "connecting",
    isWalletDetected, // Expose wallet detection state
    isModalOpen,
    openConnectModal,
    closeConnectModal
  };
  
  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
}
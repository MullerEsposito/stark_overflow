import { createContext } from "react";

interface WalletContextType {
  isConnected: boolean;
  address: string | undefined;
  isConnecting: boolean;
  isWalletDetected: boolean; // Expose wallet detection state
  isModalOpen: boolean;
  openConnectModal: () => void;
  closeConnectModal: () => void;
}

export const WalletContext = createContext<WalletContextType | undefined>(undefined);
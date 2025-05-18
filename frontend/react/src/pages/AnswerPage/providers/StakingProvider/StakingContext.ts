import { createContext } from "react";

interface StakingContextProps {
  isStakeModalOpen: boolean
  setIsStakeModalOpen: (isOpen: boolean) => void
  isLoading: boolean
  setIsLoading: (isLoading: boolean) => void
}

export const StakingContext = createContext({} as StakingContextProps)
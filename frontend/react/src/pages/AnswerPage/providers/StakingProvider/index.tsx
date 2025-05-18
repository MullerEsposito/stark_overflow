import { ReactNode, useState } from "react"
import { StakingContext } from "./StakingContext"

interface StakingProviderProps {
  children: ReactNode
}

export function StakingProvider({ children}: StakingProviderProps) {
  const [isStakeModalOpen, setIsStakeModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  return (
    <StakingContext.Provider value={{
      isStakeModalOpen,
      isLoading,
      setIsStakeModalOpen,
      setIsLoading,
    }}>
      {children}
    </StakingContext.Provider>
  )
}
import { useContext } from "react"
import { ContractContext } from "./contract.context"

export function useContract() {
  const context = useContext(ContractContext)  

  if (!context) {
    throw new Error("useContract must be used within a ContractProvider")
  }

  return context
} 
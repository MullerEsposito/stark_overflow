import { useContext } from "react";
import { StakingContext } from "./staking.context";

export function useStaking() {
  const context = useContext(StakingContext)

  if (!context) {
    throw new Error("useStaking must be used within a StakingProvider")
  }

  return context
}
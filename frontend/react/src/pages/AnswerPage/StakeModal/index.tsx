"use client"

import type React from "react"

import { useContext, useState } from "react"
import { CurrencyDollar, X } from "phosphor-react"
import { useAccount } from "@starknet-react/core"
import {
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalTitle,
  CloseButton,
  ModalBody,
  InputContainer,
  StakeInput,
  StakeButton,
  ErrorMessage,
  CurrentStakeInfo,
  LoadingSpinner,
} from "./styles"
import { StakingContext } from "../providers/StakingProvider/StakingContext"

import type { Question } from "../types"
import { useStatusMessage } from "@hooks/useStatusMessage"
import { useWallet } from "@hooks/useWallet"

interface StakeModalProps {
  question: Question
  setQuestion: (question: Question) => void
}

export function StakeModal({ question, setQuestion }: StakeModalProps) {
  const [amount, setAmount] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { isConnected } = useAccount()
  const { openConnectModal } = useWallet()
  const { setStatusMessage } = useStatusMessage()
  const { 
    isStakeModalOpen,
    isLoading,
    setIsStakeModalOpen,
    setIsLoading,
  } = useContext(StakingContext)

  // Handle adding stake to the question
  const onStake = async (amount: string) => {
    if (!isConnected) {
      openConnectModal()
      return
    }

    setIsLoading(true)
    setStatusMessage({ type: "info", message: "Processing stake transaction..." })

    try {
      // Simulate blockchain transaction
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Update question with new stake amount
      const currentAmount = Number.parseFloat(question.stakeAmount.replace(",", ""))
      const newAmount = currentAmount + Number.parseFloat(amount)

      setQuestion({
        ...question,
        stakeAmount: newAmount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
      })

      setStatusMessage({
        type: "success",
        message: `Successfully added ${amount} to the question reward!`,
      })
    } catch (error) {
      console.error("Stake transaction error:", error)
      setStatusMessage({
        type: "error",
        message: "Failed to add stake. Please try again.",
      })
    } finally {
      setIsLoading(false)
      setIsStakeModalOpen(false)
      // Clear status message after 5 seconds
      setTimeout(() => {
        setStatusMessage({ type: null, message: "" })
      }, 5000)
    }
  }

  // Handle amount change
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value

    // Only allow numbers and decimal point
    if (/^\d*\.?\d*$/.test(value) || value === "") {
      setAmount(value)
      setError(null)
    }
  }

  // Handle stake submission
  const handleSubmit = async () => {
    // Validate amount
    if (!amount || Number.parseFloat(amount) <= 0) {
      setError("Please enter a valid amount")
      return
    }

    // Check if user is connected
    if (!isConnected) {
      openConnectModal()
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      // Call the onStake callback
      onStake(amount)

      // Reset form
      setAmount("")
    } catch (err) {
      console.error("Error staking:", err)
      setError("Failed to stake. Please try again.")
      setIsSubmitting(false)
    }
  }

  // Close modal and reset state
  const handleClose = () => {
    setAmount("")
    setError(null)
    setIsStakeModalOpen(false)
  }

  if (!isStakeModalOpen) return null

  return (
    <ModalOverlay onClick={handleClose}>
      {isLoading && <LoadingSpinner />}
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>Add Stake to Question</ModalTitle>
          <CloseButton onClick={handleClose}>
            <X size={20} />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          <CurrentStakeInfo>
            <span>Current Stake:</span>
            <div>
              <CurrencyDollar size={20} color="#25c028" weight="fill" />
              {question.stakeAmount}
            </div>
          </CurrentStakeInfo>

          <p>Enter the amount you want to add to the question reward:</p>

          <InputContainer>
            <CurrencyDollar size={20} weight="fill" />
            <StakeInput type="text" value={amount} onChange={handleAmountChange} placeholder="0.00" autoFocus />
          </InputContainer>

          {error && <ErrorMessage>{error}</ErrorMessage>}

          <StakeButton onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Processing..." : "Add Stake"}
          </StakeButton>
        </ModalBody>
      </ModalContent>
    </ModalOverlay>
  )
}

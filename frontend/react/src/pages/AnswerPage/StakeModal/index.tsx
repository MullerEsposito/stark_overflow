"use client"

import React, { useState } from "react"
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
import { useStaking } from "../hooks/useStaking"

import type { Question } from "@app-types/index"
import { useStatusMessage } from "@hooks/useStatusMessage"
import { useWallet } from "@hooks/useWallet"
import { useContract } from "@hooks/useContract"
import { cairo } from "starknet"
import { formatters } from "@utils/formatters"

interface StakeModalProps {
  question: Question
  setQuestion: React.Dispatch<React.SetStateAction<Question | null>>
}

export function StakeModal({ question, setQuestion }: StakeModalProps) {
  const [amount, setAmount] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const amountInWei = formatters.convertStringDecimalToWei(amount);
  const scaledAmount = cairo.uint256(amountInWei);

  const { isConnected } = useAccount()
  const { openConnectModal } = useWallet()
  const { setStatusMessage } = useStatusMessage()
  const {
    isStakeModalOpen,
    setIsStakeModalOpen,
  } = useStaking()

  const {
    addFundsToQuestion,
    stakingLoading,
    stakingError,
    clearStakingError
  } = useContract()

  // Handle adding stake to the question
  const onStake = async (amount: string) => {
    if (!isConnected) {
      openConnectModal()
      return
    }

    setStatusMessage({ type: "info", message: "Processing stake transaction..." })
    clearStakingError()

    if (!amount || Number(scaledAmount.low) <= 0) {
      setError("Please enter a valid amount")
      return
    }

    setLoading(true)

    try {
      const success = await addFundsToQuestion(Number(question.id), scaledAmount)

      if (success) {
        // Fetch updated stake amount from contract
        const newStakeAmount = question.stakeAmount + Number(amount)

        // Update question with new stake amount 
        setQuestion(prevQuestion => {
          if (!prevQuestion) return null
          return {
            ...prevQuestion,
            stakeAmount: newStakeAmount,
          }
        })

        setStatusMessage({
          type: "success",
          message: `Successfully added $${amount} to the question reward!`,
        })
        setIsStakeModalOpen(false)
      } else {
        setStatusMessage({
          type: "error",
          message: "Failed to add stake. Please try again.",
        })
      }
    } catch (error) {
      console.error("Stake transaction error:", error)
      setStatusMessage({
        type: "error",
        message: "Failed to add stake. Please try again.",
      })
    } finally {
      setLoading(false)
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
    if (!amount || Number(amount) <= 0) {
      setError("Please enter a valid amount")
      return
    }

    // Check if user is connected
    if (!isConnected) {
      openConnectModal()
      return
    }

    setError(null)

    try {
      // Call the onStake callback
      await onStake(amount)

      // Reset form
      setAmount("")
    } catch (err) {
      console.error("Error staking:", err)
      setError("Failed to stake. Please try again.")
    }
  }

  // Close modal and reset state
  const handleClose = () => {
    setAmount("")
    setError(null)
    clearStakingError()
    setIsStakeModalOpen(false)
  }

  // Show staking error if any
  if (stakingError && !error) {
    setError(stakingError)
  }

  if (!isStakeModalOpen) return null

  return (
    <ModalOverlay onClick={handleClose}>
      {stakingLoading && <LoadingSpinner />}
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
            <StakeInput
              type="text"
              value={amount}
              onChange={handleAmountChange}
              placeholder="0.00"
              autoFocus
              disabled={stakingLoading}
            />
          </InputContainer>

          {error && <ErrorMessage>{error}</ErrorMessage>}

          <StakeButton onClick={handleSubmit} disabled={stakingLoading || !amount || loading}>
            {stakingLoading || loading ? "Processing..." : "Add Stake"}
          </StakeButton>
        </ModalBody>
      </ModalContent>
    </ModalOverlay>
  )
}

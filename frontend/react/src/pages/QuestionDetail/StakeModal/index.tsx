"use client"

import type React from "react"

import { useState } from "react"
import { CurrencyDollar, X } from "phosphor-react"
import { useAccount } from "@starknet-react/core"
import { useWallet } from "../../../providers/wallet-connect-context"
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
} from "./styles"

interface StakeModalProps {
  isOpen: boolean
  onClose: () => void
  onStake: (amount: string) => void
  currentStake: string
}

export function StakeModal({ isOpen, onClose, onStake, currentStake }: StakeModalProps) {
  const [amount, setAmount] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { isConnected } = useAccount()
  const { openConnectModal } = useWallet()

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
    onClose()
  }

  if (!isOpen) return null

  return (
    <ModalOverlay onClick={handleClose}>
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
              {currentStake}
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

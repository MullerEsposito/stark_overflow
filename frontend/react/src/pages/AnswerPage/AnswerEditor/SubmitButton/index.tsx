import { NavLink } from "react-router-dom";
import { SubmitButtonContainer } from "./styles"
import { useWallet } from "@hooks/useWallet";
import { useAnswers } from "../../hooks/useAnswers";
import { useStatusMessage } from "@hooks/useStatusMessage";
import { shortenAddress } from "@utils/shortenAddress";
import { useAccount, useSendTransaction } from "@starknet-react/core";
import { useAnswerEditor } from "../useAnswerEditor";
import { useContract } from "@hooks/useContract";


export function SubmitButton({ questionId }: { questionId: number }) {
  const { openConnectModal } = useWallet()
  const { answers, setAnswers } = useAnswers()
  const { setStatusMessage } = useStatusMessage()
  const { isConnected, address } = useAccount()
  const { content, setContent, isSubmitting, setIsSubmitting, transactionHash, setActiveTab, setTransactionHash, setUploadedFiles, setError } = useAnswerEditor()
  const { contract } = useContract()

  // send submit request
  const { sendAsync: submitAnswer, error: sendError } = useSendTransaction({
    calls: contract && address && content.trim() && questionId && isConnected
      ? [contract.populate("submit_answer", [BigInt(questionId), content])]
      : undefined,
  })

  const onAnswerSubmitted = (newAnswer: string) => {
    // Add the new answer to the list
    setAnswers([
      ...answers,
      {
        id: `a${answers.length + 1}`,
        authorAddress: address || "0x0",
        authorName: shortenAddress(address || "0x0") || "Anonymous",
        content: newAnswer,
        timestamp: "Just now",
        isCorrect: false,
        votes: 0,
      },
    ])

    setStatusMessage({
      type: "success",
      message: "Your answer has been submitted successfully!",
    })

    // Clear status message after 5 seconds
    setTimeout(() => {
      setStatusMessage({ type: null, message: "" })
    }, 5000)
  }

  const handleSubmit = async () => {
    // Validate content
    if (!content.trim()) {
      setError("Answer cannot be empty")
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
      // Submit answer to contract
      const response = await submitAnswer()

      setTransactionHash(response.transaction_hash)

      if (response.transaction_hash && !sendError) {
        // Show success message
        setTimeout(() => {
          setStatusMessage({
            type: "success",
            message: response.transaction_hash
              ? `Answer submitted successfully! Transaction: ${response.transaction_hash}`
              : "Answer submitted successfully!",
          })
        })

        // Reset the form
        setContent("")
        setActiveTab("write")
        setUploadedFiles([])

        // Clear success message after 5 seconds
        setTimeout(() => {
          setStatusMessage({ type: null, message: "" })
          onAnswerSubmitted(content)
        }, 5000)
      } else {
        // Handle submission failure
        setError(sendError ? sendError.message : "Failed to submit answer. Please try again.")
      }
    } catch (err) {
      console.error("Error submitting answer:", err)
      setError("Failed to submit answer. Please try again")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <SubmitButtonContainer data-cy='submit-answer' onClick={handleSubmit} disabled={isSubmitting}>
      {isSubmitting ? "Submitting..." : "Submit Answer"}
      {transactionHash && (
        <span>
          <NavLink to={`https://starkscan.io/tx/${transactionHash}`} target="_blank" rel="noopener noreferrer">
            View on Starkscan
          </NavLink>
        </span>
      )}
    </SubmitButtonContainer>
  )
}
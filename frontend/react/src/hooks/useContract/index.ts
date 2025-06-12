/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback } from "react"
import { useAccount } from "@starknet-react/core"
import { ContractAnswer, ContractQuestion } from "../../services/contract"
import { contractQuestionToFrontend, contractAnswerToFrontend } from "../../utils/contractTypeMapping"
import { Question, Answer } from "../../pages/AnswerPage/types"
import { formatters } from "@utils/formatters"
import { useContractContext } from "./contractContext"


interface ContractState {
  isLoading: boolean
  error: string | null
  transactionHash: string | null
}

export function useContract() {
  const { isConnected } = useAccount()
  const { contract, contractReady, abiError } = useContractContext()

  const [questionState, setQuestionState] = useState<ContractState>({
    isLoading: false,
    error: null,
    transactionHash: null
  })

  const [answersState, setAnswersState] = useState<ContractState>({
    isLoading: false,
    error: null,
    transactionHash: null
  })
  const [markCorrectState, setMarkCorrectState] = useState<ContractState>({
    isLoading: false,
    error: null,
    transactionHash: null
  })

  const [voteState, setVoteState] = useState<ContractState>({
    isLoading: false,
    error: null,
    transactionHash: null
  })



  // Fetch question from contract
  const fetchQuestion = useCallback(async (questionId: string): Promise<Question | null> => {
    if (!contract || abiError) {
      setQuestionState({ isLoading: false, error: abiError || "Contract not initialized / Wallet not connected", transactionHash: null })
      return null
    }

    setQuestionState({ isLoading: true, error: null, transactionHash: null })

    try {
      const result = await contract.get_question(formatters.numberToBigInt(Number(questionId))) as ContractQuestion



      if (!result.description || !formatters.bigIntToAddress(result.id)) {
        setQuestionState({ isLoading: false, error: "Question not found", transactionHash: null })
        return null
      }

      const question = contractQuestionToFrontend(result)

      setQuestionState({ isLoading: false, error: null, transactionHash: null })
      return question
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch question"
      setQuestionState({ isLoading: false, error: errorMessage, transactionHash: null })
      return null
    }
  }, [contract, abiError])

  // Fetch answers for a question
  const fetchAnswers = useCallback(async (questionId: string): Promise<Answer[]> => {
    if (!contract || abiError) {
      setAnswersState({ isLoading: false, error: abiError || "Contract not initialized / Wallet not connected", transactionHash: null })
      return []
    }

    setAnswersState({ isLoading: true, error: null, transactionHash: null })

    try {
      const [contractAnswers, correctAnswerId] = await Promise.all([
        contract.get_answers(formatters.numberToBigInt(Number(questionId))) as Promise<ContractAnswer[]>,
        contract.get_correct_answer(formatters.numberToBigInt(Number(questionId))).catch(() => BigInt(0)) as Promise<bigint>
      ])

      const answers = contractAnswers.map((contractAnswer: ContractAnswer) =>
        contractAnswerToFrontend(
          contractAnswer,
          contractAnswer.id === correctAnswerId
        )
      )

      setAnswersState({ isLoading: false, error: null, transactionHash: null })
      return answers
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch answers"
      setAnswersState({ isLoading: false, error: errorMessage, transactionHash: null })
      return []
    }
  }, [contract, abiError])


  // Mark answer as correct
  const markAnswerAsCorrect = useCallback(async (questionId: string, answerId: string): Promise<boolean> => {
    if (!contract || abiError || !isConnected) {
      setMarkCorrectState({
        isLoading: false,
        error: abiError || "Contract not initialized or wallet not connected",
        transactionHash: null
      })
      return false
    }

    setMarkCorrectState({ isLoading: true, error: null, transactionHash: null })

    try {
      const questionIdBigInt = formatters.numberToBigInt(Number(questionId))
      const answerIdBigInt = formatters.numberToBigInt(Number(answerId))

      // Call the contract function
      const result = await contract.mark_answer_as_correct(questionIdBigInt, answerIdBigInt)

      setMarkCorrectState({
        isLoading: false,
        error: null,
        transactionHash: result?.transaction_hash || null
      })

      return true
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to mark answer as correct"
      setMarkCorrectState({ isLoading: false, error: errorMessage, transactionHash: null })
      return false
    }
  }, [contract, abiError, isConnected])

  // Check if an answer has already been marked as correct for a question
  const getCorrectAnswer = useCallback(async (questionId: string): Promise<string | null> => {
    if (!contract || abiError) {
      return null
    }

    try {
      const result = await contract.get_correct_answer(formatters.numberToBigInt(Number(questionId))) as bigint
      return result && result !== BigInt(0) ? result.toString() : null
    } catch (error) {
      console.error("Error fetching correct answer:", error)
      return null
    }
  }, [contract, abiError])

  // Vote on answer
  const voteAnswer = useCallback(async (questionId: string, answerId: string, isUpvote: boolean): Promise<boolean> => {
    if (!contract || abiError || !isConnected) {
      setVoteState({
        isLoading: false,
        error: abiError || "Contract not initialized or wallet not connected",
        transactionHash: null
      })
      return false
    }

    setVoteState({ isLoading: true, error: null, transactionHash: null })

    try {
      const questionIdBigInt = formatters.numberToBigInt(Number(questionId))
      const answerIdBigInt = formatters.numberToBigInt(Number(answerId))

      // Call the contract function
      const result = await contract.vote_answer(questionIdBigInt, answerIdBigInt, isUpvote)

      setVoteState({
        isLoading: false,
        error: null,
        transactionHash: result?.transaction_hash || null
      })

      return true
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to vote on answer"
      setVoteState({ isLoading: false, error: errorMessage, transactionHash: null })
      return false
    }
  }, [contract, abiError, isConnected])

  // Get answer votes
  const getAnswerVotes = useCallback(async (answerId: string): Promise<{ upvotes: number; downvotes: number } | null> => {
    if (!contract || abiError) {
      return null
    }

    try {
      const answerIdBigInt = formatters.numberToBigInt(Number(answerId))
      const [upvotes, downvotes] = await contract.get_answer_votes(answerIdBigInt) as [bigint, bigint]

      return {
        upvotes: Number(upvotes),
        downvotes: Number(downvotes)
      }
    } catch (error) {
      console.error("Error fetching answer votes:", error)
      return null
    }
  }, [contract, abiError])

  // Get user's vote on an answer
  const getUserVote = useCallback(async (answerId: string): Promise<"up" | "down" | null> => {
    if (!contract || abiError || !isConnected) {
      return null
    }

    try {
      const answerIdBigInt = formatters.numberToBigInt(Number(answerId))
      const vote = await contract.get_user_vote(answerIdBigInt) as bigint

      if (vote === BigInt(1)) return "up"
      if (vote === BigInt(2)) return "down"
      return null
    } catch (error) {
      console.error("Error fetching user vote:", error)
      return null
    }
  }, [contract, abiError, isConnected])


  // Clear errors
  const clearQuestionError = useCallback(() => setQuestionState(prev => ({ ...prev, error: null })), [])
  const clearAnswersError = useCallback(() => setAnswersState(prev => ({ ...prev, error: null })), [])
  const clearMarkCorrectError = useCallback(() => setMarkCorrectState(prev => ({ ...prev, error: null })), [])
  const clearVoteError = useCallback(() => setVoteState(prev => ({ ...prev, error: null })), [])
  return {
    // Question fetching
    fetchQuestion,
    questionLoading: questionState.isLoading,
    questionError: questionState.error,
    clearQuestionError,

    // Answers fetching
    fetchAnswers,
    answersLoading: answersState.isLoading,
    answersError: answersState.error,
    clearAnswersError,

    // Mark answer as correct
    markAnswerAsCorrect,
    markCorrectLoading: markCorrectState.isLoading,
    markCorrectError: markCorrectState.error,
    markCorrectTransactionHash: markCorrectState.transactionHash,
    clearMarkCorrectError,
    getCorrectAnswer,

    // Answer voting
    voteAnswer,
    voteLoading: voteState.isLoading,
    voteError: voteState.error,
    voteTransactionHash: voteState.transactionHash,
    clearVoteError,
    getAnswerVotes,
    getUserVote,

    // General
    isConnected,
    contractReady,
    contract,
  }
}
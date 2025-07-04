import { useState, ReactNode, useCallback, useEffect } from 'react'
import { useAccount, useContract, useSendTransaction } from "@starknet-react/core"
import { ContractContext } from './contract.context'
import { formatters } from '@utils/formatters'
import { contractAnswerToFrontend, contractQuestionToFrontend } from '@utils/contractTypeMapping'
import { ERROR_MESSAGES } from './errors'
import { ContractState, Question, Answer, StarkOverflowABI } from '@app-types/index'
import { Question as ContractQuestion, Answer as ContractAnswer } from '@app-types/contract-types'

interface ContractProviderProps {
  children: ReactNode
}

export function ContractProvider({ children }: ContractProviderProps) {
  const { isConnected, address } = useAccount()

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

  // Check if environment variables are properly set
  const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS
  const [contractReady, setContractReady] = useState(false)
  const [initializationError, setInitializationError] = useState<string | null>(null)

  const { contract } = useContract<typeof StarkOverflowABI>({ 
    abi: StarkOverflowABI, 
    address: contractAddress
  })

  // Validate contract initialization
  useEffect(() => {
    if (!contractAddress) {
      setInitializationError("Contract address not configured. Please check your environment variables.")
      setContractReady(false)
      return
    }

    if (contract) {
      setContractReady(true)
      setInitializationError(null)
    } else {
      setContractReady(false)
    }
  }, [contract, contractAddress])

  const fetchQuestion = useCallback(async (questionId: number): Promise<Question | null> => {
    if (!contract || !contractReady) {
      const errorMsg = initializationError || ERROR_MESSAGES.CONTRACT_NOT_INITIALIZED
      setQuestionState({ isLoading: false, error: errorMsg, transactionHash: null })
      return null
    }

    setQuestionState({ isLoading: true, error: null, transactionHash: null })

    try {
      const contractQuestion = (await contract.get_question(formatters.numberToBigInt(questionId))) as unknown as ContractQuestion

      if (!contractQuestion.description || !contractQuestion.id) {
        setQuestionState({ isLoading: false, error: ERROR_MESSAGES.QUESTION_NOT_FOUND, transactionHash: null })
        return null
      }

      const question = contractQuestionToFrontend(contractQuestion)
      setQuestionState({ isLoading: false, error: null, transactionHash: null })
      return question
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : ERROR_MESSAGES.FETCH_QUESTION_FAILED
      setQuestionState({ isLoading: false, error: errorMessage, transactionHash: null })
      return null
    }
  }, [contract, contractReady, initializationError])

  const fetchAnswers = useCallback(async (questionId: number): Promise<Answer[]> => {
    if (!contract || !contractReady) {
      const errorMsg = initializationError || ERROR_MESSAGES.CONTRACT_NOT_INITIALIZED
      setAnswersState({ isLoading: false, error: errorMsg, transactionHash: null })
      return []
    }

    setAnswersState({ isLoading: true, error: null, transactionHash: null })

    try {
      const [contractAnswers, correctAnswerId] = await Promise.all([
        (await contract.get_answers(formatters.numberToBigInt(questionId))) as unknown as ContractAnswer[],
        contract.get_correct_answer(formatters.numberToBigInt(questionId)).catch(() => BigInt(0))
      ])

      const answers = contractAnswers.map((contractAnswer) =>
        contractAnswerToFrontend(
          contractAnswer,
          contractAnswer.id === correctAnswerId
        )
      )

      setAnswersState({ isLoading: false, error: null, transactionHash: null })
      return answers
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : ERROR_MESSAGES.FETCH_ANSWERS_FAILED
      setAnswersState({ isLoading: false, error: errorMessage, transactionHash: null })
      return []
    }
  }, [contract, contractReady, initializationError])

  const clearQuestionError = () => setQuestionState(prev => ({ ...prev, error: null }))
  const clearAnswersError = () => setAnswersState(prev => ({ ...prev, error: null }))

  const { sendAsync: markAnswerAsCorrectSendAsync } = useSendTransaction({
    calls: undefined,
  })

  const markAnswerAsCorrect = useCallback(async (questionId: string, answerId: string): Promise<boolean> => {
    if (!contract || !contractReady || !isConnected) {
      const errorMsg = initializationError || "Contract not initialized or wallet not connected"
      setMarkCorrectState({
        isLoading: false,
        error: errorMsg,
        transactionHash: null
      })
      return false
    }

    const transaction = contract && questionId && answerId
      ? [contract.populate("mark_answer_as_correct", [formatters.numberToBigInt(Number(questionId)), formatters.numberToBigInt(Number(answerId))])]
      : undefined

    setMarkCorrectState({ isLoading: true, error: null, transactionHash: null })

    try {
      setMarkCorrectState({
        isLoading: false,
        error: null,
        transactionHash: null
      })

      const response = await markAnswerAsCorrectSendAsync(transaction)

      if (response) {
        setMarkCorrectState({
          isLoading: false,
          error: null,
          transactionHash: response.transaction_hash || null
        })
      }

      return true
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to mark answer as correct"
      setMarkCorrectState({ isLoading: false, error: errorMessage, transactionHash: null })
      return false
    }
  }, [contract, contractReady, isConnected, markAnswerAsCorrectSendAsync, initializationError])

  // Check if an answer has already been marked as correct for a question
  const getCorrectAnswer = useCallback(async (questionId: string): Promise<string | null> => {
    if (!contract || !contractReady) {
      return null
    }

    try {
      const result = await contract.get_correct_answer(formatters.numberToBigInt(Number(questionId))) as bigint
      return result && result !== BigInt(0) ? result.toString() : null
    } catch (error) {
      console.error("Error fetching correct answer:", error)
      return null
    }
  }, [contract, contractReady])

  return (
    <ContractContext.Provider value={{
      contract,
      contractReady,
      isConnected,
      address,
      questionLoading: questionState.isLoading,
      answersLoading: answersState.isLoading,
      questionError: questionState.error,
      answersError: answersState.error,
      markCorrectLoading: markCorrectState.isLoading,
      markCorrectError: markCorrectState.error,
      fetchQuestion,
      fetchAnswers,
      clearQuestionError,
      clearAnswersError,
      markAnswerAsCorrect,
      getCorrectAnswer
    }}>
      {children}
    </ContractContext.Provider>
  )
} 

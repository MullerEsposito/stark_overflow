import { useState, ReactNode, useCallback } from 'react'
import { useAccount, useContract } from "@starknet-react/core"
import { ContractContext } from './contract.context'
import { formatters } from '@utils/formatters'
import { contractAnswerToFrontend, contractQuestionToFrontend } from '@utils/contractTypeMapping'
import { ERROR_MESSAGES } from './errors'
import { ContractState, Question, Answer, StarkOverflowABI } from '@app-types/index'

interface ContractProviderProps {
  children: ReactNode
}

import { StarknetTypedContract } from "@starknet-react/core"

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

  const { contract } = useContract<typeof StarkOverflowABI>({ abi: StarkOverflowABI, address: import.meta.env.VITE_CONTRACT_ADDRESS }) as { contract: StarknetTypedContract<typeof StarkOverflowABI> | undefined }

  const fetchQuestion = useCallback(async (questionId: number): Promise<Question | null> => {
    if (!contract) {
      setQuestionState({ isLoading: false, error: ERROR_MESSAGES.CONTRACT_NOT_INITIALIZED, transactionHash: null })
      return null
    }

    setQuestionState({ isLoading: true, error: null, transactionHash: null })

    try {
      const contractQuestion = await contract.get_question(formatters.numberToBigInt(questionId))

      if (!contractQuestion.description || !contractQuestion.id) {
        setQuestionState({ isLoading: false, error: ERROR_MESSAGES.QUESTION_NOT_FOUND, transactionHash: null })
        return null
      }

      const question = contractQuestionToFrontend(contractQuestion)
      console.log(question)
      setQuestionState({ isLoading: false, error: null, transactionHash: null })
      return question
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : ERROR_MESSAGES.FETCH_QUESTION_FAILED
      setQuestionState({ isLoading: false, error: errorMessage, transactionHash: null })
      return null
    }
  }, [contract])

  const fetchAnswers = useCallback(async (questionId: number): Promise<Answer[]> => {
    if (!contract) {
      setAnswersState({ isLoading: false, error: ERROR_MESSAGES.CONTRACT_NOT_INITIALIZED, transactionHash: null })
      return []
    }

    setAnswersState({ isLoading: true, error: null, transactionHash: null })

    try {
      const [contractAnswers, correctAnswerId] = await Promise.all([
        contract.get_answers(formatters.numberToBigInt(questionId)),
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
  }, [contract])

  const clearQuestionError = () => setQuestionState(prev => ({ ...prev, error: null }))
  const clearAnswersError = () => setAnswersState(prev => ({ ...prev, error: null }))

  return (
    <ContractContext.Provider value={{
      contract,
      contractReady: !!contract,
      isConnected,
      address,
      questionLoading: questionState.isLoading,
      answersLoading: answersState.isLoading,
      questionError: questionState.error,
      answersError: answersState.error,
      fetchQuestion,
      fetchAnswers,
      clearQuestionError,
      clearAnswersError
    }}>
      {children}
    </ContractContext.Provider>
  )
} 

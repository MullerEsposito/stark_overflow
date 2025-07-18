import { useState, ReactNode, useCallback, useMemo } from 'react'
import { useAccount, useContract, useSendTransaction } from "@starknet-react/core"
import { Contract, RpcProvider } from 'starknet'
import { ContractContext } from './contract.context'
import { formatters } from '@utils/formatters'
import { contractAnswerToFrontend, contractQuestionToFrontend, contractForumToFrontend } from '@utils/contractTypeMapping'
import { ERROR_MESSAGES } from './errors'
import { ContractState, Question, Answer, Forum, StarkOverflowABI } from '@app-types/index'
import { Question as ContractQuestion, Answer as ContractAnswer, ContractForum, Uint256 } from '@app-types/contract-types'

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

  const [stakingState, setStakingState] = useState<ContractState>({
    isLoading: false,
    error: null,
    transactionHash: null
  })

  const [forumsState, setForumsState] = useState<ContractState>({
    isLoading: false,
    error: null,
    transactionHash: null
  })

  const [ownerState, setOwnerState] = useState<ContractState>({
    isLoading: false,
    error: null,
    transactionHash: null
  })

  const { contract } = useContract<typeof StarkOverflowABI>({ abi: StarkOverflowABI, address: import.meta.env.VITE_CONTRACT_ADDRESS })

  // Create a read-only contract instance that works without wallet connection
  const readOnlyContract = useMemo(() => {
    if (!import.meta.env.VITE_CONTRACT_ADDRESS) return null

    try {
      const provider = new RpcProvider({
        nodeUrl: import.meta.env.VITE_RPC_URL ?? "https://starknet-sepolia.public.blastapi.io/rpc/v0_7"
      })
      return new Contract(StarkOverflowABI, import.meta.env.VITE_CONTRACT_ADDRESS, provider)
    } catch (error) {
      console.error('Error creating read-only contract:', error)
      return null
    }
  }, [])

  // Use the appropriate contract instance based on the operation type
  const getContractForReading = useCallback(() => readOnlyContract || contract, [readOnlyContract, contract])
  const getContractForWriting = useCallback(() => contract, [contract])


  const fetchQuestion = useCallback(async (questionId: number): Promise<Question | null> => {
    const contractInstance = await getContractForReading()
    if (!contractInstance) {
      setQuestionState({ isLoading: false, error: ERROR_MESSAGES.CONTRACT_NOT_INITIALIZED, transactionHash: null })
      return null
    }

    setQuestionState({ isLoading: true, error: null, transactionHash: null })

    try {
      /* const contractQuestion = await (contractInstance.get_question(BigInt(questionId))) as unknown as ContractQuestion */

      const [contractQuestion, totalStaked] = await Promise.all([
        (await contractInstance.get_question(BigInt(questionId))) as unknown as ContractQuestion,
        (await contractInstance.get_total_staked_on_question(BigInt(questionId)) as Promise<bigint>)
      ])

      if (!contractQuestion.description || !contractQuestion.id) {
        setQuestionState({ isLoading: false, error: ERROR_MESSAGES.QUESTION_NOT_FOUND, transactionHash: null })
        return null
      }

      const question = contractQuestionToFrontend(contractQuestion)
      question.stakeAmount = formatters.convertWeiToDecimal(Number(totalStaked))
      setQuestionState({ isLoading: false, error: null, transactionHash: null })
      return question
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : ERROR_MESSAGES.FETCH_QUESTION_FAILED
      setQuestionState({ isLoading: false, error: errorMessage, transactionHash: null })
      return null
    }
  }, [getContractForReading])

  const fetchAnswers = useCallback(async (questionId: number): Promise<Answer[]> => {
    const contractInstance = getContractForReading()
    if (!contractInstance) {
      setAnswersState({ isLoading: false, error: ERROR_MESSAGES.CONTRACT_NOT_INITIALIZED, transactionHash: null })
      return []
    }

    setAnswersState({ isLoading: true, error: null, transactionHash: null })

    try {
      const [contractAnswers, correctAnswerId] = await Promise.all([
        (await contractInstance.get_answers(BigInt(questionId))) as unknown as ContractAnswer[],
        contractInstance.get_correct_answer(BigInt(questionId)).catch(() => BigInt(0))
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
  }, [getContractForReading])

  const { sendAsync: markAnswerAsCorrectSendAsync } = useSendTransaction({
    calls: undefined,
  })

  const { sendAsync: addFundsToQuestionSendAsync } = useSendTransaction({
    calls: undefined,
  })

  const markAnswerAsCorrect = useCallback(async (questionId: string, answerId: string): Promise<boolean> => {
    const contractInstance = getContractForWriting()
    if (!contractInstance || !isConnected) {
      setMarkCorrectState({
        isLoading: false,
        error: "Contract not initialized or wallet not connected",
        transactionHash: null
      })
      return false
    }

    const transaction = contractInstance && questionId && answerId
      ? [contractInstance.populate("mark_answer_as_correct", [BigInt(Number(questionId)), BigInt(Number(answerId))])]
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
  }, [getContractForWriting, isConnected, markAnswerAsCorrectSendAsync])

  // Add funds to question
  const addFundsToQuestion = useCallback(async (questionId: number, amount: Uint256): Promise<boolean> => {
    const contractInstance = await getContractForWriting()
    if (!contractInstance || !isConnected) {
      setStakingState({
        isLoading: false,
        error: "Contract not initialized or wallet not connected",
        transactionHash: null
      })
      return false
    }

    setStakingState({ isLoading: true, error: null, transactionHash: null })

    try {
      // first approve the amount , then add funds to question
      const transaction = [
        {
          contractAddress: import.meta.env.VITE_TOKEN_ADDRESS,
          entrypoint: "approve",
          calldata: [contractInstance.address, amount.low, amount.high],
        },
        contractInstance.populate("stake_on_question", [
          BigInt(questionId),
          amount
        ])]

      const response = await addFundsToQuestionSendAsync(transaction)

      if (response) {
        setStakingState({
          isLoading: false,
          error: null,
          transactionHash: response.transaction_hash || null
        })
        return true
      }

      return false
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to add funds to question"
      setStakingState({ isLoading: false, error: errorMessage, transactionHash: null })
      return false
    }
  }, [getContractForWriting, isConnected, addFundsToQuestionSendAsync])

  // Get total staked amount on question
  const getTotalStakedOnQuestion = useCallback(async (questionId: number): Promise<number> => {
    const contractInstance = await getContractForReading()
    if (!contractInstance) {
      return 0
    }

    try {
      const result = await contractInstance.get_total_staked_on_question(BigInt(questionId)) as bigint
      console.log("getTotalStakedOnQuestion", formatters.convertWeiToDecimal(Number(result)))
      return formatters.convertWeiToDecimal(Number(result))
      // return formatters.bigIntToNumber(Number(result))
    } catch (error) {
      console.error("Error fetching total staked amount:", error)
      return 0
    }
  }, [getContractForReading])

  // Check if an answer has already been marked as correct for a question
  const getCorrectAnswer = useCallback(async (questionId: string): Promise<string | null> => {
    const contractInstance = getContractForReading()
    if (!contractInstance) {
      return null
    }

    try {
      const result = await contractInstance.get_correct_answer(BigInt(Number(questionId))) as bigint
      return result && result !== BigInt(0) ? result.toString() : null
    } catch (error) {
      console.error("Error fetching correct answer:", error)
      return null
    }
  }, [getContractForReading])

  // Forum functions
  const fetchForums = useCallback(async (): Promise<Forum[]> => {
    const contractInstance = getContractForReading()
    if (!contractInstance) {
      setForumsState({ isLoading: false, error: ERROR_MESSAGES.CONTRACT_NOT_INITIALIZED, transactionHash: null })
      return []
    }

    setForumsState({ isLoading: true, error: null, transactionHash: null })

    try {
      const contractForums = await contractInstance.get_forums() as unknown as ContractForum[]

      const forums = contractForums.map(contractForum => contractForumToFrontend(contractForum))

      setForumsState({ isLoading: false, error: null, transactionHash: null })
      return forums
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch forums"
      setForumsState({ isLoading: false, error: errorMessage, transactionHash: null })
      return []
    }
  }, [getContractForReading])

  const fetchForum = useCallback(async (forumId: string): Promise<Forum | null> => {
    const contractInstance = getContractForReading()
    if (!contractInstance) {
      setForumsState({ isLoading: false, error: ERROR_MESSAGES.CONTRACT_NOT_INITIALIZED, transactionHash: null })
      return null
    }

    setForumsState({ isLoading: true, error: null, transactionHash: null })

    try {
      const contractForum = await contractInstance.get_forum(BigInt(forumId)) as unknown as ContractForum

      if (!contractForum.id) {
        setForumsState({ isLoading: false, error: "Forum not found", transactionHash: null })
        return null
      }

      const forum = contractForumToFrontend(contractForum)
      setForumsState({ isLoading: false, error: null, transactionHash: null })
      return forum
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch forum"
      setForumsState({ isLoading: false, error: errorMessage, transactionHash: null })
      return null
    }
  }, [getContractForReading])

  const { sendAsync: createForumSendAsync } = useSendTransaction({
    calls: undefined,
  })

  const { sendAsync: updateForumSendAsync } = useSendTransaction({
    calls: undefined,
  })

  const { sendAsync: deleteForumSendAsync } = useSendTransaction({
    calls: undefined,
  })

  const createForum = useCallback(async (name: string, iconUrl: string): Promise<string | null> => {
    const contractInstance = getContractForWriting()
    if (!contractInstance || !isConnected) {
      setForumsState({
        isLoading: false,
        error: "Contract not initialized or wallet not connected",
        transactionHash: null
      })
      return null
    }

    setForumsState({ isLoading: true, error: null, transactionHash: null })

    try {
      const transaction = [contractInstance.populate("create_forum", [name, iconUrl])]
      const response = await createForumSendAsync(transaction)

      if (response) {
        setForumsState({
          isLoading: false,
          error: null,
          transactionHash: response.transaction_hash || null
        })
        return response.transaction_hash || null
      }

      return null
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to create forum"
      setForumsState({ isLoading: false, error: errorMessage, transactionHash: null })
      return null
    }
  }, [getContractForWriting, isConnected, createForumSendAsync])

  const updateForum = useCallback(async (forumId: string, name: string, iconUrl: string): Promise<string | null> => {
    const contractInstance = getContractForWriting()
    if (!contractInstance || !isConnected) {
      setForumsState({
        isLoading: false,
        error: "Contract not initialized or wallet not connected",
        transactionHash: null
      })
      return null
    }

    setForumsState({ isLoading: true, error: null, transactionHash: null })

    try {
      const transaction = [contractInstance.populate("update_forum", [BigInt(forumId), name, iconUrl])]
      const response = await updateForumSendAsync(transaction)

      if (response) {
        setForumsState({
          isLoading: false,
          error: null,
          transactionHash: response.transaction_hash || null
        })
        return response.transaction_hash || null
      }

      return null
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to update forum"
      setForumsState({ isLoading: false, error: errorMessage, transactionHash: null })
      return null
    }
  }, [getContractForWriting, isConnected, updateForumSendAsync])

  const deleteForum = useCallback(async (forumId: string): Promise<string | null> => {
    const contractInstance = getContractForWriting()
    if (!contractInstance || !isConnected) {
      setForumsState({
        isLoading: false,
        error: "Contract not initialized or wallet not connected",
        transactionHash: null
      })
      return null
    }

    setForumsState({ isLoading: true, error: null, transactionHash: null })

    try {
      const transaction = [contractInstance.populate("delete_forum", [BigInt(forumId)])]
      const response = await deleteForumSendAsync(transaction)

      if (response) {
        setForumsState({
          isLoading: false,
          error: null,
          transactionHash: response.transaction_hash || null
        })
        return response.transaction_hash || null
      }

      return null
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to delete forum"
      setForumsState({ isLoading: false, error: errorMessage, transactionHash: null })
      return null
    }
  }, [getContractForWriting, isConnected, deleteForumSendAsync])

  const checkIsOwner = useCallback(async (): Promise<boolean> => {
    const contractInstance = getContractForReading()
    if (!contractInstance || !address) {
      setOwnerState({ isLoading: false, error: ERROR_MESSAGES.CONTRACT_NOT_INITIALIZED, transactionHash: null })
      return false
    }

    setOwnerState({ isLoading: true, error: null, transactionHash: null })

    try {
      const ownerAddressBigInt = await contractInstance.owner() as bigint
      const ownerAddress = formatters.bigIntToAddress(ownerAddressBigInt)
      const isOwner = ownerAddress.toLowerCase() === address.toLowerCase()

      setOwnerState({ isLoading: false, error: null, transactionHash: null })
      return isOwner
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to check owner"
      setOwnerState({ isLoading: false, error: errorMessage, transactionHash: null })
      return false
    }
  }, [getContractForReading, address])

  const clearQuestionError = () => setQuestionState(prev => ({ ...prev, error: null }))
  const clearAnswersError = () => setAnswersState(prev => ({ ...prev, error: null }))
  const clearStakingError = () => setStakingState(prev => ({ ...prev, error: null }))
  const clearForumsError = () => setForumsState(prev => ({ ...prev, error: null }))
  const clearOwnerError = () => setOwnerState(prev => ({ ...prev, error: null }))

  return (
    <ContractContext.Provider value={{
      contract,
      contractReady: !!(readOnlyContract || contract),
      isConnected,
      address,
      questionLoading: questionState.isLoading,
      answersLoading: answersState.isLoading,
      questionError: questionState.error,
      answersError: answersState.error,
      markCorrectLoading: markCorrectState.isLoading,
      markCorrectError: markCorrectState.error,
      stakingLoading: stakingState.isLoading,
      stakingError: stakingState.error,
      forumsLoading: forumsState.isLoading,
      forumsError: forumsState.error,
      ownerLoading: ownerState.isLoading,
      ownerError: ownerState.error,
      fetchQuestion,
      fetchAnswers,
      fetchForums,
      fetchForum,
      createForum,
      updateForum,
      deleteForum,
      checkIsOwner,
      clearQuestionError,
      clearAnswersError,
      markAnswerAsCorrect,
      getCorrectAnswer,
      addFundsToQuestion,
      getTotalStakedOnQuestion,
      clearStakingError,
      clearForumsError,
      clearOwnerError
    }}>
      {children}
    </ContractContext.Provider>
  )
} 
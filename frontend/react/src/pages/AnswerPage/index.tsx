"use client"

import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { AnswerEditor } from "./AnswerEditor"
import { StakeModal } from "./StakeModal"
import { Question } from "./Question"
import { Answers } from "./Answers"

import { AnswersProvider } from "./providers/AnswersProvider"
import { StakingProvider } from "./providers/StakingProvider"
import { ContractProvider } from "@hooks/useContract/ContractProvider"

import { QuestionDetailContainer, StatusMessage } from "./styles"
import { useStatusMessage } from "@hooks/useStatusMessage"
import { useContract } from "@hooks/useContract"
import { Question as QuestionType } from "./types"
import { useAccount } from "@starknet-react/core"

export function AnswerPage() {
  return (
    <ContractProvider>
      <AnswerPageContent />
    </ContractProvider>
  )
}

function AnswerPageContent() {
  const { questionId } = useParams<{ questionId: string }>()
  const { statusMessage } = useStatusMessage()
  const { isConnected } = useAccount()


  const [question, setQuestion] = useState<QuestionType | null>(null)

  const {
    fetchQuestion,
    questionLoading,
    questionError,
    clearQuestionError,
    contractReady
  } = useContract()

  // Fetch question data from contract
  useEffect(() => {
    if (questionId && contractReady) {
      console.log(`Fetching question with ID: ${questionId}`)

      const loadQuestion = async () => {
        const contractQuestion = await fetchQuestion(questionId)
        if (contractQuestion) {
          setQuestion(contractQuestion)
        }
      }

      loadQuestion()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionId, contractReady])

  if (!isConnected && !contractReady) {
    return (
      <QuestionDetailContainer>
        <div style={{ padding: "20px", textAlign: "center" }}>
          <p>Please connect your wallet to view this question</p>
        </div>
      </QuestionDetailContainer>
    )
  }

  // Show loading state
  if (questionLoading || !contractReady) {
    return (
      <QuestionDetailContainer>
        <div style={{ padding: "20px", textAlign: "center" }}>
          <p>Loading question...</p>
        </div>
      </QuestionDetailContainer>
    )
  }

  // Show error state
  if (questionError) {
    return (
      <QuestionDetailContainer>
        <div style={{ padding: "20px", textAlign: "center" }}>
          <p>Error loading question: {questionError}</p>
          <button onClick={clearQuestionError}>Retry</button>
        </div>
      </QuestionDetailContainer>
    )
  }

  // Show not found if no question
  if (!question) {
    return (
      <QuestionDetailContainer>
        <div style={{ padding: "20px", textAlign: "center" }}>
          <p>Question not found</p>
        </div>
      </QuestionDetailContainer>
    )
  }

  return (
    <QuestionDetailContainer>
      <StakingProvider>
        <Question question={question} />

        <AnswersProvider questionId={questionId || ""}>
          <Answers question={question} setQuestion={setQuestion} />

          {question.isOpen && <AnswerEditor questionId={questionId || ""} />}
        </AnswersProvider>        {statusMessage?.type && (
          <StatusMessage type={statusMessage.type}>
            {statusMessage.message}
          </StatusMessage>
        )}

        <StakeModal question={question} setQuestion={setQuestion} />
      </StakingProvider>
    </QuestionDetailContainer>
  )
}

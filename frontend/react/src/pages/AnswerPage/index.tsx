"use client"

import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { AnswerEditor } from "./AnswerEditor"
import { StakeModal } from "./StakeModal"
import { Question } from "./Question"
import { Answers } from "./Answers"

import { AnswersProvider } from "./providers/AnswersProvider"
import { StakingProvider } from "./providers/StakingProvider"

import { QuestionDetailContainer, StatusMessage } from "./styles"
import { mockQuestion } from "./mocks"
import { useStatusMessage } from "@hooks/useStatusMessage"

export function AnswerPage() {
  const { questionId } = useParams<{ questionId: string }>()
  const { statusMessage } = useStatusMessage()

  const [question, setQuestion] = useState(mockQuestion)

  // Simulate fetching question data
  useEffect(() => {
    // In a real app, fetch question data from API/blockchain
    console.log(`Fetching question with ID: ${questionId}`)
    // setQuestion(fetchedQuestion)
  }, [questionId])

  return (
    <QuestionDetailContainer>
      <StakingProvider>
        <Question question={question} />

        <AnswersProvider>
          <Answers question={question} setQuestion={setQuestion} />

          {question.isOpen && <AnswerEditor />}
        </AnswersProvider>

        {statusMessage?.type && (
          <StatusMessage type={statusMessage.type}>
            {statusMessage.message}
          </StatusMessage>
        )}

        <StakeModal question={question} setQuestion={setQuestion} />
      </StakingProvider>
    </QuestionDetailContainer>
  )
}

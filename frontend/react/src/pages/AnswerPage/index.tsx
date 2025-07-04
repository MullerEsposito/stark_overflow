"use client"

import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { AnswerEditor } from "./AnswerEditor"
import { StakeModal } from "./StakeModal"
import { Question } from "./Question"
import { Answers } from "./Answers"

import { AnswersProvider } from "./hooks/useAnswers/answersProvider"
import { StakingProvider } from "./hooks/useStaking/staking.provider"
import { ContractProvider } from "@hooks/useContract/contract.provider"

import { QuestionDetailContainer, StatusMessage } from "./styles"
import { useStatusMessage } from "@hooks/useStatusMessage"
import { useContract } from "@hooks/useContract"
import { Question as QuestionType } from "@app-types/index"
import { AnswerEditorProvider } from "./AnswerEditor/useAnswerEditor/answerEditor.provider"

export function AnswerPage() {
  return (
    <ContractProvider>
      <AnswerPageContent />
    </ContractProvider>
  )
}

function AnswerPageContent() {
  const params = useParams<{ questionId: string }>()
  const questionId = Number(params.questionId)
  const { statusMessage } = useStatusMessage()

  const [question, setQuestion] = useState<QuestionType | null>(null)
  const [retryAttempts, setRetryAttempts] = useState(0)

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
      const loadQuestion = async () => {
        const contractQuestion = await fetchQuestion(questionId)
        if (contractQuestion) {
          setQuestion(contractQuestion)
          setRetryAttempts(0) // Reset retry attempts on success
        }
      }

      loadQuestion()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionId, contractReady, retryAttempts])

  // Retry function
  const handleRetry = () => {
    clearQuestionError()
    setRetryAttempts(prev => prev + 1)
  }

  // Show contract initialization error
  if (!contractReady && !questionLoading) {
    return (
      <QuestionDetailContainer>
        <div style={{ padding: "20px", textAlign: "center" }}>
          <h3>Contract Initialization Error</h3>
          <p>
            Unable to connect to the smart contract. This usually happens when:
          </p>
          <ul style={{ textAlign: "left", display: "inline-block", marginBottom: "20px" }}>
            <li>Environment variables are not properly configured</li>
            <li>Network connection issues</li>
            <li>Contract address is incorrect</li>
          </ul>
          <div>
            <button 
              onClick={handleRetry}
              style={{
                padding: "10px 20px",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                marginRight: "10px"
              }}
            >
              Retry Connection
            </button>
            <button 
              onClick={() => window.location.reload()}
              style={{
                padding: "10px 20px",
                backgroundColor: "#6c757d",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer"
              }}
            >
              Refresh Page
            </button>
          </div>
        </div>
      </QuestionDetailContainer>
    )
  }

  // Show loading state
  if (questionLoading || !contractReady) {
    return (
      <QuestionDetailContainer>
        <div style={{ padding: "20px", textAlign: "center" }}>
          <div style={{ marginBottom: "10px" }}>
            <div 
              style={{
                width: "40px",
                height: "40px",
                border: "4px solid #f3f3f3",
                borderTop: "4px solid #007bff",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
                margin: "0 auto"
              }}
            />
          </div>
          <p>{!contractReady ? "Initializing contract..." : "Loading question..."}</p>
        </div>
      </QuestionDetailContainer>
    )
  }

  // Show error state with detailed information
  if (questionError) {
    return (
      <QuestionDetailContainer>
        <div style={{ padding: "20px", textAlign: "center" }}>
          <h3>Error Loading Question</h3>
          <div style={{ 
            backgroundColor: "#f8d7da", 
            color: "#721c24", 
            padding: "15px", 
            borderRadius: "5px", 
            margin: "20px 0",
            border: "1px solid #f5c6cb"
          }}>
            <strong>Error:</strong> {questionError}
          </div>
          
          {questionError.includes("Contract not found") && (
            <div style={{ marginBottom: "20px", textAlign: "left", display: "inline-block" }}>
              <h4>Possible Solutions:</h4>
              <ul>
                <li>Check if the contract address in your .env file is correct</li>
                <li>Ensure you're connected to the correct network</li>
                <li>Verify the contract is deployed and accessible</li>
                <li>Try refreshing the page or reconnecting your wallet</li>
              </ul>
            </div>
          )}

          <div>
            <button 
              onClick={handleRetry}
              style={{
                padding: "10px 20px",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                marginRight: "10px"
              }}
            >
              Retry ({retryAttempts + 1})
            </button>
            <button 
              onClick={() => window.location.reload()}
              style={{
                padding: "10px 20px",
                backgroundColor: "#6c757d",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer"
              }}
            >
              Refresh Page
            </button>
          </div>
        </div>
      </QuestionDetailContainer>
    )
  }

  // Show not found if no question
  if (!question) {
    return (
      <QuestionDetailContainer>
        <div style={{ padding: "20px", textAlign: "center" }}>
          <h3>Question Not Found</h3>
          <p>The question with ID {questionId} could not be found.</p>
          <button 
            onClick={handleRetry}
            style={{
              padding: "10px 20px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer"
            }}
          >
            Try Again
          </button>
        </div>
      </QuestionDetailContainer>
    )
  }

  return (
    <QuestionDetailContainer>
      <StakingProvider>
        <Question question={question} />

        <AnswersProvider questionId={questionId}>
          <Answers question={question} setQuestion={setQuestion} />

          {question.isOpen && (
            <AnswerEditorProvider>
              <AnswerEditor questionId={questionId} />
            </AnswerEditorProvider>
          )}
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

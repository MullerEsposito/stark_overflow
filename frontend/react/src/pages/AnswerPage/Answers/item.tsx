import { CheckCircle, ThumbsDown, ThumbsUp } from "phosphor-react"
import { UserAvatar } from "../styles"
import { AnswerContent, AnswerDivider, AnswerFooter, AnswerHeader, AnswerItem, CorrectAnswerBadge, MarkCorrectButton, VoteButton, VoteContainer, VoteCount } from "./styles"
import * as React from "react"
import { useContext, useState, Suspense, useEffect } from "react"
import { useAccount } from "@starknet-react/core"
import { shortenAddress } from "@utils/shortenAddress"

import { AnswersContext } from "../hooks/useAnswers/answersContext"
import type { Answer, Question } from "@app-types/index"
import { useWallet } from "@hooks/useWallet"
import { useStatusMessage } from "@hooks/useStatusMessage"
import { useContract } from "@hooks/useContract"
import Tooltip from "@components/Tooltip"

const ReactMarkdown = React.lazy(() => import("react-markdown"))
const remarkGfm = await import("remark-gfm").then((mod) => mod.default || mod)

interface AnswersProps {
  answer: Answer;
  question?: Question;
  setQuestion?: React.Dispatch<React.SetStateAction<Question | null>>
}

export function AnswersItem({ answer, question, setQuestion }: AnswersProps) {
  const { isConnected, address } = useAccount()
  const { openConnectModal } = useWallet()
  const { answers, setAnswers } = useContext(AnswersContext)
  const { setStatusMessage } = useStatusMessage()
  const { markAnswerAsCorrect, getReputationByUser } = useContract()

  const [reputationScore, setReputationScore] = useState<string | null>(null)
  React.useMemo(async() => {
    if (!answer?.authorAddress) return "0"
    const reputation = await getReputationByUser(answer?.authorAddress)
    setReputationScore(reputation)
  }, [answer?.authorAddress])

  const handleMarkCorrect = async (answerId: string) => {
    if (!isConnected) {
      openConnectModal()
      return
    }

    // Check if user is the question author
    const isQuestionAuthor = address && address.toLowerCase() === question?.authorAddress.toLowerCase()
    if (!isQuestionAuthor) {
      setStatusMessage({
        type: "error",
        message: "Only the question author can mark an answer as correct.",
      })
      return
    }

    // Check if question is still open
    if (!question?.isOpen) {
      setStatusMessage({
        type: "error",
        message: "This question has already been resolved.",
      })
      return
    }

    // Check if any answer is already marked as correct
    const hasCorrectAnswer = answers.some((answer) => answer.isCorrect)
    if (hasCorrectAnswer) {
      setStatusMessage({
        type: "error",
        message: "An answer has already been marked as correct for this question.",
      })
      return
    }

    setStatusMessage({ type: "info", message: "Processing transaction..." })

    try {
      const response = await markAnswerAsCorrect(question?.id, answerId)

      if (response) {
        // Update answers state to mark the correct answer
        setAnswers(
          answers.map((answer) => ({
            ...answer,
            isCorrect: answer.id === answerId,
          })),
        )

        setStatusMessage({
          type: "success",
          message: "Answer marked as correct! Funds have been transferred to the responder.",
        })

        // Update question with new status 
        setQuestion?.(prevQuestion => {
          if (!prevQuestion) return null
          return {
            ...prevQuestion,
            isOpen: false,
          }
        })
      }
    } catch (error) {
      console.error("Transaction error:", error)

      let errorMessage = "Failed to mark answer as correct. Please try again."

      // Handle specific contract errors
      if (error instanceof Error) {
        if (error.message.includes("Only the author of the question can mark the answer as correct")) {
          errorMessage = "Only the question author can mark an answer as correct."
        } else if (error.message.includes("The question is already resolved")) {
          errorMessage = "This question has already been resolved."
        } else if (error.message.includes("The specified answer does not exist for this question")) {
          errorMessage = "The selected answer is not valid for this question."
        }
      }

      setStatusMessage({
        type: "error",
        message: errorMessage,
      })
    } finally {
      // Clear status message after 5 seconds
      setTimeout(() => {
        setStatusMessage({ type: null, message: "" })
      }, 5000)
    }
  }

  const handleVote = async (answerId: string, direction: "up" | "down") => {
    if (!isConnected) {
      openConnectModal()
      return
    }

    setAnswers(
      answers.map((answer) => {
        if (answer.id === answerId) {
          return {
            ...answer,
            votes: direction === "up" ? answer.votes + 1 : answer.votes - 1,
          }
        }
        return answer
      }),
    )
  }

  const isQuestionAuthor = address && address.toLowerCase() === question?.authorAddress.toLowerCase()

  return (
    <AnswerItem key={answer.id} $isCorrect={answer.isCorrect}>
      <AnswerHeader>
        <UserAvatar
          src={`https://avatars.dicebear.com/api/identicon/${answer.authorAddress}.svg`}
          alt={answer.authorName}
        />
        <div>
          <span>{answer.authorName}</span>
          <small>{shortenAddress(answer.authorAddress)}</small>
          <time>{answer.timestamp}</time>
          <Tooltip content={reputationScore ? `Reputation score of the user. 
            The reputation is calculated based on the number of votes received.` : "Loading reputation..."}
            position="right"
          >
            <span>{reputationScore ? `Reputation: ${reputationScore}` : "Loading reputation..."}</span>
          </Tooltip>
        </div>                {answer.isCorrect && (
          <CorrectAnswerBadge>
            <CheckCircle size={16} weight="fill" />
            Correct Answer
          </CorrectAnswerBadge>
        )}
      </AnswerHeader>

      <AnswerContent>
        <Suspense fallback={<p>Carregando visualização...</p>}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              img: ({ ...props }) => (
                <img
                  src={props.src || "/placeholder.svg"}
                  alt={props.alt || ""}
                  style={{ maxWidth: "100%", borderRadius: "4px", margin: "8px 0" }}
                />
              ),
            }}
          >
            {answer.content}
          </ReactMarkdown>
        </Suspense>
      </AnswerContent>
      <AnswerFooter>
        <VoteContainer>
          <VoteButton onClick={() => handleVote(answer.id, "up")}>
            <ThumbsUp size={16} />
          </VoteButton>
          <VoteCount>{answer.votes}</VoteCount>
          <VoteButton onClick={() => handleVote(answer.id, "down")}>
            <ThumbsDown size={16} />
          </VoteButton>
        </VoteContainer>

        {isQuestionAuthor && question.isOpen && !answer.isCorrect && (
          <MarkCorrectButton onClick={() => handleMarkCorrect(answer.id)}>Mark as Correct</MarkCorrectButton>
        )}
      </AnswerFooter>
      <AnswerDivider />
    </AnswerItem>
  )
}
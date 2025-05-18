import { CheckCircle, ThumbsDown, ThumbsUp } from "phosphor-react"
import { UserAvatar } from "../styles"
import { AnswerContent, AnswerDivider, AnswerFooter, AnswerHeader, AnswerItem, AnswersContainer, AnswersList, CorrectAnswerBadge, MarkCorrectButton, PaginationButton, PaginationContainer, SortingOptions, SortOption, VoteButton, VoteContainer, VoteCount } from "./styles"
import { useContext, useState } from "react"
import { useAccount } from "@starknet-react/core"
import { shortenAddress } from "@utils/shortenAddress"

import { AnswersContext } from "../providers/AnswersProvider/answersContext"

import type { Question } from "../types"
import { useWallet } from "@hooks/useWallet"
import { useStatusMessage } from "@hooks/useStatusMessage"

const ReactMarkdown = await import("react-markdown").then((mod) => mod.default || mod)
const remarkGfm = await import("remark-gfm").then((mod) => mod.default || mod)

interface AnswersProps {
  question: Question
  setQuestion: (question: Question) => void
}

export function Answers({ question, setQuestion }: AnswersProps) {
  const [sortBy, setSortBy] = useState<"votes" | "date">("votes")
  const [currentPage, setCurrentPage] = useState(1)

  const { isConnected, address } = useAccount()
  const { openConnectModal } = useWallet()
  const { answers, setIsLoading, setAnswers } = useContext(AnswersContext)
  const { setStatusMessage } = useStatusMessage()

  // Sort answers based on selected option
  const sortedAnswers = [...answers].sort((a, b) => {
    if (sortBy === "votes") {
      return b.votes - a.votes
    } else {
      // Simple date sorting for mock data
      return a.timestamp.includes("Today") && !b.timestamp.includes("Today") ? -1 : 1
    }
  })

  // Handle marking an answer as correct
  const handleMarkCorrect = async (answerId: string) => {
    if (!isConnected) {
      openConnectModal()
      return
    }

    setIsLoading(true)
    setStatusMessage({ type: "info", message: "Processing transaction..." })

    try {
      // Simulate blockchain transaction
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Update answers state
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

      // Update question status
      setQuestion({
        ...question,
        isOpen: false,
      })
    } catch (error) {
      console.error("Transaction error:", error)
      setStatusMessage({
        type: "error",
        message: "Failed to mark answer as correct. Please try again.",
      })
    } finally {
      setIsLoading(false)
      // Clear status message after 5 seconds
      setTimeout(() => {
        setStatusMessage(null)
      }, 5000)
    }
  }

  // Handle voting on an answer
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

  // Check if current user is the question author
  const isQuestionAuthor = address && address.toLowerCase() === question.authorAddress.toLowerCase()

  return (
    <AnswersContainer>
      <h2>Answers</h2>
      <SortingOptions>
        <SortOption active={sortBy === "votes"} onClick={() => setSortBy("votes")}>
          Votes
        </SortOption>
        <SortOption active={sortBy === "date"} onClick={() => setSortBy("date")}>
          Date
        </SortOption>
      </SortingOptions>

      <AnswersList>
        {sortedAnswers.length === 0 ? (
          <p>No answers yet. Be the first to answer!</p>
        ) : (
          sortedAnswers.map((answer) => (
            <AnswerItem key={answer.id} isCorrect={answer.isCorrect}>
              <AnswerHeader>
                <UserAvatar
                  src={`https://avatars.dicebear.com/api/identicon/${answer.authorAddress}.svg`}
                  alt={answer.authorName}
                />
                <div>
                  <span>{answer.authorName}</span>
                  <small>{shortenAddress(answer.authorAddress)}</small>
                  <time>{answer.timestamp}</time>
                </div>
                {answer.isCorrect && (
                  <CorrectAnswerBadge>
                    <CheckCircle size={16} weight="fill" />
                    Correct Answer
                  </CorrectAnswerBadge>
                )}
              </AnswerHeader>

              <AnswerContent>
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
          ))
        )}
      </AnswersList>

      {answers.length > 5 && (
        <PaginationContainer>
          <PaginationButton disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
            Previous
          </PaginationButton>
          <span>
            Page {currentPage} of {Math.ceil(answers.length / 5)}
          </span>
          <PaginationButton
            disabled={currentPage === Math.ceil(answers.length / 5)}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
          </PaginationButton>
        </PaginationContainer>
      )}
    </AnswersContainer>
  )
}
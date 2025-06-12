import { CheckCircle, ThumbsDown, ThumbsUp } from "phosphor-react"
import { UserAvatar } from "../styles"
import { AnswerContent, AnswerDivider, AnswerFooter, AnswerHeader, AnswerItem, AnswersContainer, AnswersList, CorrectAnswerBadge, MarkCorrectButton, PaginationButton, PaginationContainer, SortingOptions, SortOption, VoteButton, VoteContainer, VoteCount } from "./styles"
import * as React from "react"
import { useContext, useState, Suspense } from "react"
import { useAccount } from "@starknet-react/core"
import { shortenAddress } from "@utils/shortenAddress"

import { AnswersContext } from "../providers/AnswersProvider/answersContext"

import type { Question } from "../types"
import { useWallet } from "@hooks/useWallet"
import { useStatusMessage } from "@hooks/useStatusMessage"
import { useContract } from "@hooks/useContract"

const ReactMarkdown = React.lazy(() => import("react-markdown"))
const remarkGfm = await import("remark-gfm").then((mod) => mod.default || mod)

interface AnswersProps {
  question: Question
  setQuestion: (question: Question) => void
}

export function Answers({ question, setQuestion }: AnswersProps) {
  const [sortBy, setSortBy] = useState<"votes" | "date">("votes")
  const [currentPage, setCurrentPage] = useState(1)
  const [userVotes, setUserVotes] = useState<Record<string, "up" | "down" | null>>({})
  const [isVoting, setIsVoting] = useState<Record<string, boolean>>({})
  const { isConnected, address } = useAccount()
  const { openConnectModal } = useWallet()
  const { answers, setAnswers } = useContext(AnswersContext)
  const { setStatusMessage } = useStatusMessage()
  const { markAnswerAsCorrect, markCorrectLoading, voteAnswer } = useContract()

  // Sort answers based on selected option
  const sortedAnswers = [...answers].sort((a, b) => {
    if (sortBy === "votes") {
      return b.votes - a.votes
    } else {
      // Simple date sorting for mock data
      return a.timestamp.includes("Today") && !b.timestamp.includes("Today") ? -1 : 1
    }
  })  // Handle marking an answer as correct
  const handleMarkCorrect = async (answerId: string) => {
    if (!isConnected) {
      openConnectModal()
      return
    }

    // Check if user is the question author
    const isQuestionAuthor = address && address.toLowerCase() === question.authorAddress.toLowerCase()
    if (!isQuestionAuthor) {
      setStatusMessage({
        type: "error",
        message: "Only the question author can mark an answer as correct.",
      })
      return
    }

    // Check if question is still open
    if (!question.isOpen) {
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
      // Use the markAnswerAsCorrect method from useContract
      const success = await markAnswerAsCorrect(question.id, answerId)

      if (success) {
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

        // Update question status
        setQuestion({
          ...question,
          isOpen: false,
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
  }  // Handle voting on an answer
  const handleVote = async (answerId: string, direction: "up" | "down") => {
    if (!isConnected) {
      openConnectModal()
      return
    }

    // Check if user has already voted on this answer
    const currentVote = userVotes[answerId]

    // Prevent voting if user is trying to vote in the same direction again
    if (currentVote === direction) {
      setStatusMessage({
        type: "info",
        message: `You have already ${direction === "up" ? "upvoted" : "downvoted"} this answer.`,
      })
      return
    }

    setIsVoting(prev => ({ ...prev, [answerId]: true }))
    setStatusMessage({ type: "info", message: "Processing vote..." })

    try {
      const isUpvote = direction === "up"

      // Call the smart contract voting function
      const success = await voteAnswer(question.id, answerId, isUpvote)

      if (success) {
        // Update local state optimistically
        setAnswers(
          answers.map((answer) => {
            if (answer.id === answerId) {
              let newVotes = answer.votes

              // Handle vote changes
              if (currentVote === "up" && direction === "down") {
                newVotes -= 2 // Remove upvote and add downvote
              } else if (currentVote === "down" && direction === "up") {
                newVotes += 2 // Remove downvote and add upvote
              } else if (direction === "up") {
                newVotes += 1 // New upvote
              } else {
                newVotes -= 1 // New downvote
              }

              return {
                ...answer,
                votes: newVotes,
              }
            }
            return answer
          }),
        )

        // Update user vote state
        setUserVotes(prev => ({
          ...prev,
          [answerId]: direction,
        }))

        setStatusMessage({
          type: "success",
          message: "Vote submitted successfully to the blockchain!",
        })
      }
    } catch (error) {
      console.error("Vote error:", error)

      let errorMessage = "Failed to submit vote. Please try again."

      // Handle specific contract errors
      if (error instanceof Error) {
        if (error.message.includes("User has already voted this way")) {
          errorMessage = `You have already ${direction === "up" ? "upvoted" : "downvoted"} this answer.`
        } else if (error.message.includes("Cannot vote on your own answer")) {
          errorMessage = "You cannot vote on your own answer."
        } else if (error.message.includes("Answer does not exist")) {
          errorMessage = "This answer no longer exists."
        }
      }

      setStatusMessage({
        type: "error",
        message: errorMessage,
      })
    } finally {
      setIsVoting(prev => ({ ...prev, [answerId]: false }))
      // Clear status message after 5 seconds
      setTimeout(() => {
        setStatusMessage({ type: null, message: "" })
      }, 5000)
    }
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
              </AnswerContent>              <AnswerFooter>
                <VoteContainer>                  <VoteButton
                  onClick={() => handleVote(answer.id, "up")}
                  disabled={isVoting[answer.id]}
                  style={{
                    color: userVotes[answer.id] === "up" ? "#2ecc71" : "#666",
                    opacity: isVoting[answer.id] ? 0.5 : 1
                  }}
                >
                  <ThumbsUp size={16} />
                </VoteButton>
                  <VoteCount style={{ fontWeight: "bold" }}>{answer.votes}</VoteCount>
                  <VoteButton
                    onClick={() => handleVote(answer.id, "down")}
                    disabled={isVoting[answer.id]}
                    style={{
                      color: userVotes[answer.id] === "down" ? "#e74c3c" : "#666",
                      opacity: isVoting[answer.id] ? 0.5 : 1
                    }}
                  >
                    <ThumbsDown size={16} />
                  </VoteButton>
                </VoteContainer>                {isQuestionAuthor && question.isOpen && !answer.isCorrect && (
                  <MarkCorrectButton
                    onClick={() => handleMarkCorrect(answer.id)}
                    disabled={markCorrectLoading}
                  >
                    {markCorrectLoading ? "Processing..." : "Mark as Correct"}
                  </MarkCorrectButton>
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
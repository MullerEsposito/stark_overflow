"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useAccount } from "@starknet-react/core"
import { CheckCircle, CurrencyDollar, GithubLogo, ThumbsDown, ThumbsUp } from "phosphor-react"
import { useWallet } from "../../providers/wallet-connect-context"
import { shortenAddress } from "../../utils/shortenAddress"
import { AnswerEditor } from "./AnswerEditor"
import { StakeModal } from "./StakeModal"
import {
  QuestionDetailContainer,
  QuestionHeader,
  QuestionTitle,
  QuestionMeta,
  QuestionContent as StyledQuestionContent,
  QuestionFooter,
  AnswersContainer,
  AnswersList,
  AnswerItem,
  AnswerHeader,
  AnswerContent as StyledAnswerContent,
  AnswerFooter,
  UserAvatar,
  ActionButton,
  StakeInfo,
  SortingOptions,
  SortOption,
  PaginationContainer,
  PaginationButton,
  MarkCorrectButton,
  CorrectAnswerBadge,
  VoteContainer,
  VoteButton,
  VoteCount,
  RepositoryLink,
  StatusMessage,
  LoadingSpinner,
  AnswerDivider,
  QuestionTag,
  TagsContainer,
} from "./styles"
import styled from "styled-components"
// Add this near the top of the file with other imports
const ReactMarkdown = await import("react-markdown").then((mod) => mod.default || mod)
const remarkGfm = await import("remark-gfm").then((mod) => mod.default || mod)

// Mock data for the question
const mockQuestion = {
  id: "q1",
  title: "I'm facing problems on Github",
  content: `Good afternoon, alright?

Here on mine I had several errors during the build and until then I made the corrections and it ran again, but now I made the last correction and it no longer runs. How do I make it run?

![Screenshot of GitHub errors](/placeholder.png?height=300&width=600&query=github%20errors%20screenshot)`,
  authorAddress: "0x123456789abcdef",
  authorName: "Jhane Doe",
  timestamp: "yesterday at 16:24",
  stakeAmount: "2500.00",
  tags: ["github", "build", "errors"],
  repositoryUrl: "https://github.com/user/repo",
  isOpen: true,
}

// Mock data for answers
const mockAnswers = [
  {
    id: "a1",
    authorAddress: "0x987654321fedcba",
    authorName: "Jhon Doe",
    content: `Good night @Jhane Doe on line 26 of your deploy-docs.yml file there is a command followed by what I believe to be a comment:

\`\`\`yaml
name: Deploy Docs
on:
  push:
    branches: [ main ]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node
        uses: actions/setup-node@v2
        with:
          node-version: '16'
      - run: npm ci
      - run: npm run build:docs # This is causing your issue
      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: \${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./docs
\`\`\`

Try changing line 26 to \`npm run docs:build\` if that's the correct script in your package.json.`,
    timestamp: "Today at 02:00",
    isCorrect: false,
    votes: 3,
  },
  {
    id: "a2",
    authorAddress: "0xabcdef123456789",
    authorName: "Alex Smith",
    content:
      "Have you tried clearing your cache and running `npm install` again? Sometimes dependencies get corrupted.",
    timestamp: "Today at 09:15",
    isCorrect: false,
    votes: 1,
  },
]

// Find the QuestionContent styled component and replace it with:
export const QuestionContent = styled(StyledQuestionContent)`
  margin-bottom: 24px;
  line-height: 1.6;
  font-size: 1rem;
  
  img {
    max-width: 100%;
    border-radius: 8px;
    margin: 16px 0;
    display: block; /* Ensure images display properly */
  }
  
  pre {
    background: ${({ theme }) => theme.secondary || "#1e1e1e"};
    padding: 16px;
    border-radius: 8px;
    overflow-x: auto;
    margin: 16px 0;
  }
  
  code {
    font-family: monospace;
  }
`

// Find the AnswerContent styled component and replace it with:
export const AnswerContent = styled(StyledAnswerContent)`
  line-height: 1.6;
  font-size: 1rem;
  
  img {
    max-width: 100%;
    border-radius: 8px;
    margin: 16px 0;
    display: block; /* Ensure images display properly */
  }
  
  pre {
    background: ${({ theme }) => theme.secondary || "#1e1e1e"};
    padding: 16px;
    border-radius: 8px;
    overflow-x: auto;
    margin: 16px 0;
  }
  
  code {
    font-family: monospace;
  }
`

export function QuestionDetail() {
  const { questionId } = useParams<{ questionId: string }>()
  const navigate = useNavigate()
  const { isConnected, address } = useAccount()
  const { openConnectModal } = useWallet()

  const [question, setQuestion] = useState(mockQuestion)
  const [answers, setAnswers] = useState(mockAnswers)
  const [isStakeModalOpen, setIsStakeModalOpen] = useState(false)
  const [sortBy, setSortBy] = useState<"votes" | "date">("votes")
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error" | "info" | null; message: string }>({
    type: null,
    message: "",
  })

  // Simulate fetching question data
  useEffect(() => {
    // In a real app, fetch question data from API/blockchain
    console.log(`Fetching question with ID: ${questionId}`)
    // setQuestion(fetchedQuestion)
  }, [questionId])

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
        setStatusMessage({ type: null, message: "" })
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

  // Handle adding stake to the question
  const handleAddStake = async (amount: string) => {
    if (!isConnected) {
      openConnectModal()
      return
    }

    setIsLoading(true)
    setStatusMessage({ type: "info", message: "Processing stake transaction..." })

    try {
      // Simulate blockchain transaction
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Update question with new stake amount
      const currentAmount = Number.parseFloat(question.stakeAmount.replace(",", ""))
      const newAmount = currentAmount + Number.parseFloat(amount)

      setQuestion({
        ...question,
        stakeAmount: newAmount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
      })

      setStatusMessage({
        type: "success",
        message: `Successfully added ${amount} to the question reward!`,
      })
    } catch (error) {
      console.error("Stake transaction error:", error)
      setStatusMessage({
        type: "error",
        message: "Failed to add stake. Please try again.",
      })
    } finally {
      setIsLoading(false)
      setIsStakeModalOpen(false)
      // Clear status message after 5 seconds
      setTimeout(() => {
        setStatusMessage({ type: null, message: "" })
      }, 5000)
    }
  }

  // Check if current user is the question author
  const isQuestionAuthor = address && address.toLowerCase() === question.authorAddress.toLowerCase()

  return (
    <QuestionDetailContainer>
      {/* Question Section */}
      <QuestionHeader>
        <UserAvatar
          src={`https://avatars.dicebear.com/api/identicon/${question.authorAddress}.svg`}
          alt={question.authorName}
        />
        <div>
          <QuestionMeta>
            <span>{question.authorName}</span>
            <time>{question.timestamp}</time>
          </QuestionMeta>
          <QuestionTitle>
            {question.isOpen ? (
              <CheckCircle size={20} color="#d4821e" weight="fill" />
            ) : (
              <CheckCircle size={20} color="#2e8b57" weight="fill" />
            )}
            <h1>{question.title}</h1>
          </QuestionTitle>
          <TagsContainer>
            {question.tags.map((tag) => (
              <QuestionTag key={tag}>{tag}</QuestionTag>
            ))}
          </TagsContainer>
        </div>
      </QuestionHeader>

      <QuestionContent>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            img: ({ node, ...props }: any) => (
              <img
                src={props.src || "/placeholder.svg"}
                alt={props.alt || ""}
                style={{ maxWidth: "100%", borderRadius: "4px", margin: "8px 0" }}
              />
            ),
          }}
        >
          {question.content}
        </ReactMarkdown>
      </QuestionContent>

      <QuestionFooter>
        {question.repositoryUrl && (
          <RepositoryLink href={question.repositoryUrl} target="_blank" rel="noopener noreferrer">
            <GithubLogo size={20} />
            Link to repository
          </RepositoryLink>
        )}
        <StakeInfo>
          <CurrencyDollar size={24} color="#25c028" weight="fill" />
          <span>{question.stakeAmount}</span>
          {question.isOpen && <ActionButton onClick={() => setIsStakeModalOpen(true)}>Add Stake</ActionButton>}
        </StakeInfo>
      </QuestionFooter>

      {/* Answers Section */}
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
                      img: ({ node, ...props }: any) => (
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

      {/* Answer Editor Section */}
      {question.isOpen && (
        <div>
          <h2>Answer this question</h2>
          <AnswerEditor
            questionId={questionId || ""}
            onAnswerSubmitted={(newAnswer) => {
              // Add the new answer to the list
              setAnswers([
                ...answers,
                {
                  id: `a${answers.length + 1}`,
                  authorAddress: address || "0x0",
                  authorName: shortenAddress(address || "0x0") || "Anonymous",
                  content: newAnswer,
                  timestamp: "Just now",
                  isCorrect: false,
                  votes: 0,
                },
              ])

              setStatusMessage({
                type: "success",
                message: "Your answer has been submitted successfully!",
              })

              // Clear status message after 5 seconds
              setTimeout(() => {
                setStatusMessage({ type: null, message: "" })
              }, 5000)
            }}
          />
        </div>
      )}

      {/* Status Messages */}
      {statusMessage.type && <StatusMessage type={statusMessage.type}>{statusMessage.message}</StatusMessage>}

      {/* Loading Indicator */}
      {isLoading && <LoadingSpinner />}

      {/* Stake Modal */}
      <StakeModal
        isOpen={isStakeModalOpen}
        onClose={() => setIsStakeModalOpen(false)}
        onStake={handleAddStake}
        currentStake={question.stakeAmount}
      />
    </QuestionDetailContainer>
  )
}

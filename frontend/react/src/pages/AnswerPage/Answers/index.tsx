import { CheckCircle, ThumbsDown, ThumbsUp } from "phosphor-react";
import { UserAvatar } from "../styles";
import {
  AnswerContent,
  AnswerDivider,
  AnswerFooter,
  AnswerHeader,
  AnswerItem,
  AnswersContainer,
  AnswersList,
  CorrectAnswerBadge,
  MarkCorrectButton,
  PaginationButton,
  PaginationContainer,
  SortingOptions,
  SortOption,
  VoteButton,
  VoteContainer,
  VoteCount,
} from "./styles";
import * as React from "react";
import { useContext, useState, Suspense } from "react";
import { useAccount } from "@starknet-react/core";
import { shortenAddress } from "@utils/shortenAddress";
import { useTranslation } from "react-i18next";
import { AnswersContext } from "../hooks/useAnswers/answersContext";
import type { Question } from "@app-types/index";
import { useWallet } from "@hooks/useWallet";
import { useStatusMessage } from "@hooks/useStatusMessage";
import { useContract } from "@hooks/useContract";

const ReactMarkdown = React.lazy(() => import("react-markdown"));
const remarkGfm = await import("remark-gfm").then((mod) => mod.default || mod);

interface AnswersProps {
  question: Question;
  setQuestion: (question: Question) => void;
}

export function Answers({ question, setQuestion }: AnswersProps) {
  const { t } = useTranslation("answer");
  const [sortBy, setSortBy] = useState<"votes" | "date">("votes");
  const [currentPage, setCurrentPage] = useState(1);

  const { isConnected, address } = useAccount();
  const { openConnectModal } = useWallet();
  const { answers, setAnswers } = useContext(AnswersContext);
  const { setStatusMessage } = useStatusMessage();
  const { markAnswerAsCorrect } = useContract();

  const sortedAnswers = [...answers].sort((a, b) => {
    if (sortBy === "votes") {
      return b.votes - a.votes;
    } else {
      return a.timestamp.includes("Today") && !b.timestamp.includes("Today")
        ? -1
        : 1;
    }
  });

  const handleMarkCorrect = async (answerId: string) => {
    if (!isConnected) {
      openConnectModal();
      return;
    }
    
    const isQuestionAuthor = address && address.toLowerCase() === question.authorAddress.toLowerCase();
    if (!isQuestionAuthor) {
      setStatusMessage({ type: "error", message: t('errorNotAuthor') });
      return;
    }

    if (!question.isOpen) {
      setStatusMessage({ type: "error", message: t('errorQuestionResolved') });
      return;
    }

    const hasCorrectAnswer = answers.some((answer) => answer.isCorrect);
    if (hasCorrectAnswer) {
      setStatusMessage({ type: "error", message: t('errorAnswerAlreadyMarked') });
      return;
    }

    setStatusMessage({ type: "info", message: t('statusMarkingCorrect') });

    try {
      const response = await markAnswerAsCorrect(question.id, answerId);

      if (response) {
        setAnswers(
          answers.map((answer) => ({
            ...answer,
            isCorrect: answer.id === answerId,
          }))
        );

        setStatusMessage({
          type: "success",
          message: t('statusMarkCorrectSuccess'),
        });

        setQuestion({
          ...question,
          isOpen: false,
        });
      }
    } catch (error) {
      console.error("Transaction error:", error);

      let errorMessageKey = 'statusMarkCorrectError';

      if (error instanceof Error) {
        if (error.message.includes("Only the author of the question can mark the answer as correct")) {
          errorMessageKey = 'errorNotAuthor';
        } else if (error.message.includes("The question is already resolved")) {
          errorMessageKey = 'errorQuestionResolved';
        } else if (error.message.includes("The specified answer does not exist for this question")) {
            errorMessageKey = 'errorInvalidAnswer';
        }
      }

      setStatusMessage({
        type: "error",
        message: t(errorMessageKey),
      });
    } finally {
      setTimeout(() => {
        setStatusMessage({ type: null, message: "" });
      }, 5000);
    }
  };

  const handleVote = async (answerId: string, direction: "up" | "down") => {
    if (!isConnected) {
      openConnectModal();
      return;
    }

    setAnswers(
      answers.map((answer) => {
        if (answer.id === answerId) {
          return {
            ...answer,
            votes: direction === "up" ? answer.votes + 1 : answer.votes - 1,
          };
        }
        return answer;
      })
    );
  };

  const isQuestionAuthor =
    address && address.toLowerCase() === question.authorAddress.toLowerCase();

  return (
    <AnswersContainer>
      <h2>{t("answersTitle")}</h2>
      <SortingOptions>
        <SortOption active={sortBy === "votes"} onClick={() => setSortBy("votes")}>
          {t("sortVotes")}
        </SortOption>
        <SortOption active={sortBy === "date"} onClick={() => setSortBy("date")}>
          {t("sortDate")}
        </SortOption>
      </SortingOptions>
      <AnswersList>
        {sortedAnswers.length === 0 ? (
          <p>{t("noAnswers")}</p>
        ) : (
          sortedAnswers.map((answer) => (
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
                </div>{" "}
                {answer.isCorrect && (
                  <CorrectAnswerBadge>
                    <CheckCircle size={16} weight="fill" />
                    {t("correctAnswer")}
                  </CorrectAnswerBadge>
                )}
              </AnswerHeader>
              <AnswerContent>
                <Suspense fallback={<p>{t("loadingPreview")}</p>}>
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      img: ({ ...props }) => (
                        <img
                          src={props.src || "/placeholder.svg"}
                          alt={props.alt || ""}
                          style={{
                            maxWidth: "100%",
                            borderRadius: "4px",
                            margin: "8px 0",
                          }}
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
                  <MarkCorrectButton
                    onClick={() => handleMarkCorrect(answer.id)}
                  >
                    {t("markAsCorrect")}
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
          <PaginationButton
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            {t("paginationPrevious")}
          </PaginationButton>
          <span>
            {t("paginationPage", {
              currentPage,
              totalPages: Math.ceil(answers.length / 5),
            })}
          </span>
          <PaginationButton
            disabled={currentPage === Math.ceil(answers.length / 5)}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            {t("paginationNext")}
          </PaginationButton>
        </PaginationContainer>
      )}
    </AnswersContainer>
  );
}

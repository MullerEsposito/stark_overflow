import { CheckCircle, CurrencyDollar, GithubLogo } from "phosphor-react";
import { ActionButton, QuestionContainer, QuestionContent, QuestionFooter, QuestionHeader, QuestionMeta, QuestionTag, QuestionTitle, RepositoryLink, StakeInfo, TagsContainer } from "./styles";
import { UserAvatar } from "../styles";

import type { Question } from "@app-types/index";
import React, { Suspense } from "react";
import { useStaking } from "../hooks/useStaking";

const ReactMarkdown = React.lazy(() => import("react-markdown"))
const remarkGfm = await import("remark-gfm").then((mod) => mod.default || mod)


interface QuestionProps {
  question: Question
}

export function Question({ question }: QuestionProps) {
  const { setIsStakeModalOpen } = useStaking()

  return (
    <QuestionContainer>
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
            {question.content}
          </ReactMarkdown>
        </Suspense>
      </QuestionContent>

      <QuestionFooter>
        {question.repositoryUrl && (
          <RepositoryLink
            href={question.repositoryUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <GithubLogo size={20} />
            Link to repository
          </RepositoryLink>
        )}
        <StakeInfo>
          <CurrencyDollar size={20} color="#25c028" weight="fill" />
          <span>{question.stakeAmount.toFixed(2)}</span>

          {question.isOpen && (
            <ActionButton data-cy="add-stake-btn-card" onClick={() => setIsStakeModalOpen(true)}>
              Add Stake
            </ActionButton>
          )}
        </StakeInfo>
      </QuestionFooter>
    </QuestionContainer>
  )
}
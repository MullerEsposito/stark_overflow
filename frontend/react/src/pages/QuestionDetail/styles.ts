import styled, { css, keyframes } from "styled-components"

export const QuestionDetailContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  color: ${({ theme }) => theme.text};
  position: relative;
`

export const QuestionHeader = styled.header`
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  
  @media (max-width: 600px) {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
`

export const QuestionTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
  
  h1 {
    font-size: 1.5rem;
    font-weight: 700;
    color: ${({ theme }) => theme.text};
    margin: 0;
  }
  
  @media (max-width: 600px) {
    justify-content: center;
    
    h1 {
      font-size: 1.3rem;
    }
  }
`

export const QuestionMeta = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 8px;
  
  span {
    font-weight: 600;
    color: ${({ theme }) => theme.text};
  }
  
  time {
    font-size: 0.8rem;
    color: ${({ theme }) => theme.textSecondary};
  }
`

export const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
  
  @media (max-width: 600px) {
    justify-content: center;
  }
`

export const QuestionTag = styled.span`
  background: ${({ theme }) => theme.secondary || "#1e1e1e"};
  color: ${({ theme }) => theme.text};
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
`

export const QuestionContent = styled.div`
  margin-bottom: 24px;
  line-height: 1.6;
  font-size: 1rem;
  
  img {
    max-width: 100%;
    border-radius: 8px;
    margin: 16px 0;
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

export const QuestionFooter = styled.footer`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  padding-bottom: 20px;
  border-bottom: 1px solid ${({ theme }) => theme.borderColor};
  
  @media (max-width: 600px) {
    flex-direction: column;
    gap: 16px;
  }
`

export const RepositoryLink = styled.a`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #7c3aed;
  text-decoration: none;
  font-weight: 500;
  
  &:hover {
    text-decoration: underline;
  }
`

export const StakeInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  
  span {
    font-weight: 700;
    font-size: 1.1rem;
    color: #25c028;
  }
`

export const ActionButton = styled.button`
  background: #7c3aed;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 12px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  
  &:hover {
    background: #6d28d9;
  }
  
  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
  }
`

export const AnswersContainer = styled.section`
  margin-bottom: 40px;
  
  h2 {
    font-size: 1.5rem;
    margin-bottom: 16px;
  }
`

export const SortingOptions = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
`

export const SortOption = styled.button<{ active: boolean }>`
  background: none;
  border: none;
  color: ${({ active, theme }) => (active ? "#7c3aed" : theme.textSecondary)};
  font-weight: ${({ active }) => (active ? "600" : "400")};
  cursor: pointer;
  padding: 4px 0;
  border-bottom: 2px solid ${({ active }) => (active ? "#7c3aed" : "transparent")};
  
  &:hover {
    color: ${({ active, theme }) => (active ? "#7c3aed" : theme.text)};
  }
`

export const AnswersList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`

export const AnswerItem = styled.article<{ isCorrect: boolean }>`
  background: ${({ theme, isCorrect }) =>
    isCorrect ? `linear-gradient(to right, ${theme.cardBackground}, rgba(46, 139, 87, 0.1))` : theme.cardBackground};
  border: 1px solid ${({ theme, isCorrect }) => (isCorrect ? "rgba(46, 139, 87, 0.3)" : theme.borderColor)};
  border-radius: 8px;
  padding: 16px;
  position: relative;
  
  ${({ isCorrect }) =>
    isCorrect &&
    `
    box-shadow: 0 0 10px rgba(46, 139, 87, 0.2);
  `}
`

export const AnswerDivider = styled.div`
  height: 1px;
  background: ${({ theme }) => theme.borderColor};
  margin: 16px 0 8px;
`

export const AnswerHeader = styled.header`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  
  div {
    display: flex;
    flex-direction: column;
    
    span {
      font-weight: 600;
    }
    
    small {
      color: ${({ theme }) => theme.textSecondary};
      font-size: 0.8rem;
    }
    
    time {
      font-size: 0.8rem;
      color: ${({ theme }) => theme.textSecondary};
    }
  }
  
  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
  }
`

export const CorrectAnswerBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  background: rgba(46, 139, 87, 0.1);
  color: #2e8b57;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
  margin-left: auto;
  
  @media (max-width: 600px) {
    margin-left: 0;
    margin-top: 8px;
  }
`

export const UserAvatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
`

export const AnswerContent = styled.div`
  line-height: 1.6;
  font-size: 1rem;
  
  img {
    max-width: 100%;
    border-radius: 8px;
    margin: 16px 0;
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

export const AnswerFooter = styled.footer`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
  
  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
`

export const VoteContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

export const VoteButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.text};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border-radius: 4px;
  
  &:hover {
    background: ${({ theme }) => theme.secondary || "#1e1e1e"};
  }
`

export const VoteCount = styled.span`
  font-weight: 600;
  min-width: 24px;
  text-align: center;
`

export const MarkCorrectButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(46, 139, 87, 0.1);
  color: #2e8b57;
  border: 1px solid rgba(46, 139, 87, 0.3);
  border-radius: 4px;
  padding: 8px 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: rgba(46, 139, 87, 0.2);
  }
`

export const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-top: 24px;
  
  span {
    color: ${({ theme }) => theme.textSecondary};
    font-size: 0.9rem;
  }
`

export const PaginationButton = styled.button`
  background: ${({ theme }) => theme.secondary || "#1e1e1e"};
  color: ${({ theme }) => theme.text};
  border: none;
  border-radius: 4px;
  padding: 8px 12px;
  cursor: pointer;
  transition: background 0.2s;
  
  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.borderColor};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`

export const LoadingSpinner = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 40px;
  height: 40px;
  border: 4px solid rgba(124, 58, 237, 0.1);
  border-radius: 50%;
  border-top: 4px solid #7c3aed;
  animation: ${spin} 1s linear infinite;
  z-index: 1000;
`

export const StatusMessage = styled.div<{ type: "success" | "error" | "info" | null }>`
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 12px 16px;
  border-radius: 8px;
  font-weight: 500;
  z-index: 1000;
  animation: fadeIn 0.3s ease-out;
  
  ${({ type }) => {
    switch (type) {
      case "success":
        return css`
          background-color: rgba(16, 185, 129, 0.1);
          color: #10b981;
          border: 1px solid rgba(16, 185, 129, 0.2);
        `
      case "error":
        return css`
          background-color: rgba(239, 68, 68, 0.1);
          color: #ef4444;
          border: 1px solid rgba(239, 68, 68, 0.2);
        `
      case "info":
        return css`
          background-color: rgba(59, 130, 246, 0.1);
          color: #3b82f6;
          border: 1px solid rgba(59, 130, 246, 0.2);
        `
      default:
        return ""
    }
  }}
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`

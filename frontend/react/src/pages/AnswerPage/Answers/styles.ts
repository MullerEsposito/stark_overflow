import styled from "styled-components"

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
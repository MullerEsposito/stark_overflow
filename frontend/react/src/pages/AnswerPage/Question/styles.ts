import styled from "styled-components";

export const QuestionContainer = styled.div``

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
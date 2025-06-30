import styled from "styled-components";

export const QuestionContainer = styled.div`
  background: ${({ theme }) => theme.cardBackground};
  padding: 24px;
  border-radius: 8px;
  margin-bottom: 24px;
  border: 1px solid ${({ theme }) => theme.borderColor};

  @media (max-width: 768px) {
    padding: 16px;
    margin-bottom: 16px;
  }

  @media (max-width: 480px) {
    padding: 12px;
    margin-bottom: 12px;
  }

  @media (max-width: 320px) {
    padding: 8px;
    margin-bottom: 8px;
  }
`

export const QuestionHeader = styled.header`
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  
  @media (max-width: 600px) {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 12px;
    margin-bottom: 20px;
  }

  @media (max-width: 480px) {
    gap: 8px;
    margin-bottom: 16px;
  }

  @media (max-width: 320px) {
    gap: 6px;
    margin-bottom: 12px;
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

  @media (max-width: 768px) {
    margin-bottom: 6px;
    
    span {
      font-size: 0.9rem;
    }
    
    time {
      font-size: 0.75rem;
    }
  }

  @media (max-width: 480px) {
    margin-bottom: 4px;
    
    span {
      font-size: 0.85rem;
    }
    
    time {
      font-size: 0.7rem;
    }
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
    word-break: break-word;
  }
  
  @media (max-width: 600px) {
    justify-content: center;
    flex-direction: column;
    gap: 8px;
    
    h1 {
      font-size: 1.3rem;
      text-align: center;
    }
  }

  @media (max-width: 768px) {
    h1 {
      font-size: 1.2rem;
    }
  }

  @media (max-width: 480px) {
    gap: 6px;
    margin-bottom: 6px;
    
    h1 {
      font-size: 1.1rem;
    }
  }

  @media (max-width: 320px) {
    gap: 4px;
    margin-bottom: 4px;
    
    h1 {
      font-size: 1rem;
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

  @media (max-width: 480px) {
    gap: 6px;
    margin-top: 6px;
  }

  @media (max-width: 320px) {
    gap: 4px;
    margin-top: 4px;
  }
`

export const QuestionTag = styled.span`
  background: ${({ theme }) => theme.secondary || "#1e1e1e"};
  color: ${({ theme }) => theme.text};
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  white-space: nowrap;

  @media (max-width: 768px) {
    font-size: 0.75rem;
    padding: 3px 6px;
  }

  @media (max-width: 480px) {
    font-size: 0.7rem;
    padding: 2px 5px;
  }

  @media (max-width: 320px) {
    font-size: 0.65rem;
    padding: 2px 4px;
  }
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

  @media (max-width: 768px) {
    margin-bottom: 20px;
    font-size: 0.95rem;
    line-height: 1.5;
    
    img {
      margin: 12px 0;
    }
    
    pre {
      padding: 12px;
      margin: 12px 0;
    }
  }

  @media (max-width: 480px) {
    margin-bottom: 16px;
    font-size: 0.9rem;
    line-height: 1.4;
    
    img {
      margin: 8px 0;
    }
    
    pre {
      padding: 8px;
      margin: 8px 0;
    }
  }

  @media (max-width: 320px) {
    margin-bottom: 12px;
    font-size: 0.85rem;
    line-height: 1.3;
    
    img {
      margin: 6px 0;
    }
    
    pre {
      padding: 6px;
      margin: 6px 0;
    }
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
    align-items: flex-start;
  }

  @media (max-width: 768px) {
    margin-bottom: 32px;
    padding-bottom: 16px;
  }

  @media (max-width: 480px) {
    margin-bottom: 24px;
    padding-bottom: 12px;
    gap: 12px;
  }

  @media (max-width: 320px) {
    margin-bottom: 20px;
    padding-bottom: 8px;
    gap: 8px;
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

  @media (max-width: 768px) {
    font-size: 0.9rem;
    gap: 6px;
  }

  @media (max-width: 480px) {
    font-size: 0.85rem;
    gap: 4px;
  }
`

export const StakeInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
  
  span {
    font-weight: 700;
    font-size: 1.1rem;
    color: #25c028;
  }

  @media (max-width: 768px) {
    gap: 6px;
    
    span {
      font-size: 1rem;
    }
  }

  @media (max-width: 480px) {
    gap: 4px;
    
    span {
      font-size: 0.9rem;
    }
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
  white-space: nowrap;
  
  &:hover {
    background: #6d28d9;
  }
  
  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    padding: 6px 10px;
    font-size: 0.9rem;
  }

  @media (max-width: 480px) {
    padding: 5px 8px;
    font-size: 0.85rem;
  }

  @media (max-width: 320px) {
    padding: 4px 6px;
    font-size: 0.8rem;
  }
`
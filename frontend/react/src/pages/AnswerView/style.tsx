import styled from 'styled-components';

export const AnswerViewContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
  color: ${({ theme }) => theme.text};
  background-color: ${({ theme }) => theme.background};
`;

export const QuestionDetailContainer = styled.div`
  background-color: ${({ theme }) => theme.forum.topicCard.background};
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  position: relative;
`;

export const QuestionTitle = styled.h1`
  font-size: 1.5rem;
  margin-bottom: 16px;
  color: ${({ theme }) => theme.text};
  display: flex;
  align-items: center;
  gap: 8px;
  
  &::before {
    content: '';
    display: inline-block;
    width: 8px;
    height: 8px;
    background-color: #7c3aed;
    border-radius: 50%;
  }
`;

export const QuestionContent = styled.div`
  margin-bottom: 16px;
  line-height: 1.6;
  white-space: pre-wrap;
`;

export const QuestionMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid ${({ theme }) => theme.borderColor};
  font-size: 0.9rem;
  color: ${({ theme }) => theme.textSecondary};
`;

export const AuthorInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
`;

export const StakeInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
`;

export const AnswersSection = styled.div`
  margin-top: 32px;
  position: relative;
`;

export const AnswersSectionTitle = styled.h2`
  font-size: 1.2rem;
  margin-bottom: 16px;
  color: ${({ theme }) => theme.text};
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  &::after {
    content: 'Votes';
    font-size: 0.8rem;
    color: ${({ theme }) => theme.textSecondary};
    margin-right: 16px;
  }
`;

export const NewAnswerSection = styled.div`
  margin-top: 32px;
  background-color: ${({ theme }) => theme.forum.topicCard.background};
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
`;

export const NewAnswerTitle = styled.h3`
  font-size: 1.1rem;
  margin-bottom: 16px;
  color: ${({ theme }) => theme.text};
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const AnswerTextarea = styled.textarea`
  width: 100%;
  min-height: 100px;
  padding: 12px;
  border: 1px solid ${({ theme }) => theme.borderColor};
  border-radius: 8px;
  background-color: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  font-family: inherit;
  resize: vertical;
  margin-bottom: 16px;
  
  &:focus {
    outline: none;
    border-color: #7c3aed;
  }
`;

export const SubmitButton = styled.button`
  background-color: #7c3aed;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.2s;
  align-self: flex-end;
  text-transform: uppercase;
  font-weight: 500;
  letter-spacing: 0.5px;
  
  &:hover {
    background-color: #6d28d9;
  }
  
  &:disabled {
    background-color: #a78bfa;
    cursor: not-allowed;
  }
`;

export const AnswerList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin: 16px 0;
`;

export const VoteButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.textSecondary};
  cursor: pointer;
  font-size: 1.2rem;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    color: #7c3aed;
  }
`;

export const VoteContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 16px;
`;

export const VoteCount = styled.span`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.text};
  margin: 4px 0;
`;

export const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

export const LoadingSpinner = styled.div`
  border: 4px solid rgba(255, 255, 255, 0.1);
  border-top: 4px solid #7c3aed;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

export const NotificationContainer = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 16px;
  border-radius: 8px;
  background-color: #1e1e1e;
  color: white;
  border-left: 4px solid #7c3aed;
  z-index: 1000;
  animation: slideIn 0.3s ease-out;

  @keyframes slideIn {
    from { transform: translateX(100%); }
    to { transform: translateX(0); }
  }
`;
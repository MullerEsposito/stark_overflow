import React, { useState } from 'react';
import styled from 'styled-components';
import { shortenAddress } from '../../utils/address';

interface AnswerProps {
  id: string;
  content: string;
  responderAddress: string;
  submissionDate: string;
  isCorrect: boolean;
  isQuestionAuthor: boolean;
  currentStake: string;
  onMarkCorrect: (answerId: string) => Promise<void>;
  onStake: (amount: string) => Promise<void>;
}

const AnswerContainer = styled.div<{ isCorrect: boolean }>`
  border: 1px solid ${props => props.isCorrect ? '#4CAF50' : '#e0e0e0'};
  border-radius: 8px;
  padding: 20px;
  margin: 16px 0;
  background-color: ${props => props.isCorrect ? '#E8F5E9' : '#ffffff'};
  transition: all 0.3s ease;

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

const ResponderInfo = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  color: #666;
  font-size: 0.9rem;
`;

const Content = styled.div`
  margin: 16px 0;
  line-height: 1.6;
  white-space: pre-wrap;
`;

const ActionButton = styled.button`
  background-color: #1976d2;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s;

  &:hover {
    background-color: #1565c0;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    width: 100%;
    margin-top: 8px;
  }
`;

const StakeContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 16px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const StakeInput = styled.input`
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 120px;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const StakeInfo = styled.div`
  color: #666;
  font-size: 0.9rem;
`;

const ErrorMessage = styled.div`
  color: #d32f2f;
  font-size: 0.8rem;
  margin-top: 8px;
`;

export const Answer: React.FC<AnswerProps> = ({
  id,
  content,
  responderAddress,
  submissionDate,
  isCorrect,
  isQuestionAuthor,
  currentStake,
  onMarkCorrect,
  onStake,
}) => {
  const [stakeAmount, setStakeAmount] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleMarkCorrect = async () => {
    try {
      setIsLoading(true);
      setError('');
      await onMarkCorrect(id);
    } catch (err) {
      setError('Failed to mark answer as correct. Please try again.');
      console.error('Error marking answer as correct:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStake = async () => {
    if (!stakeAmount || parseFloat(stakeAmount) <= 0) {
      setError('Please enter a valid stake amount');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      await onStake(stakeAmount);
      setStakeAmount('');
    } catch (err) {
      setError('Failed to stake funds. Please try again.');
      console.error('Error staking funds:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnswerContainer isCorrect={isCorrect}>
      <ResponderInfo>
        <span>Answered by {shortenAddress(responderAddress)} on {submissionDate}</span>
      </ResponderInfo>

      <Content>{content}</Content>

      <StakeContainer>
        <StakeInfo>Current Stake: {currentStake} ETH</StakeInfo>
        <StakeInput
          type="number"
          min="0"
          step="0.01"
          value={stakeAmount}
          onChange={(e) => setStakeAmount(e.target.value)}
          placeholder="Stake amount"
          disabled={isLoading}
        />
        <ActionButton
          onClick={handleStake}
          disabled={isLoading || !stakeAmount}
        >
          {isLoading ? 'Processing...' : 'Add Stake'}
        </ActionButton>

        {isQuestionAuthor && !isCorrect && (
          <ActionButton
            onClick={handleMarkCorrect}
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'Mark as Correct'}
          </ActionButton>
        )}
      </StakeContainer>

      {error && <ErrorMessage>{error}</ErrorMessage>}
    </AnswerContainer>
  );
};
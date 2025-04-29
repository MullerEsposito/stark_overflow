import React, { useState, useEffect } from 'react';
import { Answer } from '../../components/Answer';
import { BlockchainService } from '../../services/blockchain';
import { AnswerList, LoadingOverlay, LoadingSpinner, NotificationContainer } from '../../components/Answer/style';

interface Answer {
  id: string;
  content: string;
  responderAddress: string;
  submissionDate: string;
  isCorrect: boolean;
}

interface AnswerViewProps {
  questionId: string;
  authorAddress: string;
  currentUserAddress: string;
}

export const AnswerView: React.FC<AnswerViewProps> = ({
  questionId,
  authorAddress,
  currentUserAddress,
}) => {
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [currentStake, setCurrentStake] = useState('0');
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState('');

  useEffect(() => {
    loadCurrentStake();
  }, [questionId]);

  const loadCurrentStake = async () => {
    try {
      const stake = await BlockchainService.getCurrentStake(questionId);
      setCurrentStake(stake);
    } catch (error) {
      console.error('Error loading current stake:', error);
      showNotification('Failed to load current stake');
    }
  };

  const handleMarkCorrect = async (answerId: string) => {
    try {
      setIsLoading(true);
      const result = await BlockchainService.markAnswerAsCorrect(questionId, answerId);
      
      if (result.success) {
        setAnswers(prevAnswers =>
          prevAnswers.map(answer => ({
            ...answer,
            isCorrect: answer.id === answerId
          }))
        );
        showNotification('Answer marked as correct successfully!');
      }
    } catch (error) {
      console.error('Error marking answer as correct:', error);
      showNotification('Failed to mark answer as correct');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStake = async (amount: string) => {
    try {
      setIsLoading(true);
      const result = await BlockchainService.addStake(questionId, amount);
      
      if (result.success) {
        await loadCurrentStake();
        showNotification(`Successfully staked ${amount} ETH!`);
      }
    } catch (error) {
      console.error('Error staking funds:', error);
      showNotification('Failed to stake funds');
    } finally {
      setIsLoading(false);
    }
  };

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(''), 5000);
  };

  return (
    <div>
      <AnswerList>
        {answers.map(answer => (
          <Answer
            key={answer.id}
            id={answer.id}
            content={answer.content}
            responderAddress={answer.responderAddress}
            submissionDate={answer.submissionDate}
            isCorrect={answer.isCorrect}
            isQuestionAuthor={currentUserAddress === authorAddress}
            currentStake={currentStake}
            onMarkCorrect={handleMarkCorrect}
            onStake={handleStake}
          />
        ))}      </AnswerList>

      {isLoading && (
        <LoadingOverlay>
          <LoadingSpinner />
        </LoadingOverlay>
      )}

      {notification && (
        <NotificationContainer>
          {notification}
        </NotificationContainer>
      )}
    </div>
  );
};
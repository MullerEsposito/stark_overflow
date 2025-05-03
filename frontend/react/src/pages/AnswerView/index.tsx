import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Answer } from '../../components/Answer';
import { BlockchainService } from '../../services/blockchain';
import { AnswerList, LoadingOverlay, LoadingSpinner, NotificationContainer } from '../../components/Answer/style';

interface AnswerData {
  id: string;
  content: string;
  responderAddress: string;
  submissionDate: string;
  isCorrect: boolean;
}

interface AnswerViewProps {
  questionId?: string;
  authorAddress?: string;
  currentUserAddress?: string;
  initialAnswers?: AnswerData[];
}

export const AnswerView: React.FC<AnswerViewProps> = ({
  questionId,
  authorAddress: initialAuthorAddress,
  currentUserAddress: initialCurrentUserAddress,
  initialAnswers
}) => {
  const { id: urlId } = useParams<{ id: string }>();
  const id = questionId || urlId;
  const [answers, setAnswers] = useState<AnswerData[]>(initialAnswers || []);
  const [currentStake, setCurrentStake] = useState('0');
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState('');
  const [authorAddress, setAuthorAddress] = useState(initialAuthorAddress || '');
  const [currentUserAddress, setCurrentUserAddress] = useState(initialCurrentUserAddress || '');

  useEffect(() => {
    // Only set mock data if no initial data was provided
    if (!initialAnswers && answers.length === 0) {
      setAnswers([
        {
          id: '1',
          content: 'This is a sample answer to demonstrate the functionality.',
          responderAddress: '0x789',
          submissionDate: '2023-01-01',
          isCorrect: false
        }
      ]);
    }
    
    // Only set mock addresses if no initial addresses were provided
    if (!initialAuthorAddress) {
      setAuthorAddress('0x123');
    }
    
    if (!initialCurrentUserAddress) {
      setCurrentUserAddress('0x456');
    }
    
    // Load stake
    if (id) {
      loadCurrentStake();
    }
  }, [id, initialAnswers, initialAuthorAddress, initialCurrentUserAddress, answers.length]);

  const loadCurrentStake = async () => {
    try {
      const stake = await BlockchainService.getCurrentStake(id || '');
      setCurrentStake(stake);
    } catch (error) {
      console.error('Error loading current stake:', error);
      showNotification('Failed to load current stake');
    }
  };

  const handleMarkCorrect = async (answerId: string) => {
    try {
      setIsLoading(true);
      const result = await BlockchainService.markAnswerAsCorrect(id || '', answerId);
      
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
      const result = await BlockchainService.addStake(id || '', amount);
      
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
        ))}
      </AnswerList>

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
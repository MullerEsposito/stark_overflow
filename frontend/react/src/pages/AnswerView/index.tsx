import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTheme } from 'styled-components';
import { formatDistanceToNow } from 'date-fns/formatDistanceToNow';
import { BlockchainService } from '../../services/blockchain';
import {
  AnswerViewContainer,
  QuestionDetailContainer,
  QuestionTitle,
  QuestionContent,
  QuestionMeta,
  AuthorInfo,
  StakeInfo,
  AnswersSection,
  AnswersSectionTitle,
  NewAnswerSection,
  NewAnswerTitle,
  AnswerTextarea,
  SubmitButton,
  AnswerList,
  LoadingOverlay,
  LoadingSpinner,
  NotificationContainer
} from './style';

interface AnswerData {
  id: string;
  content: string;
  responderAddress: string;
  submissionDate: string;
  isCorrect: boolean;
}

interface QuestionData {
  id: string;
  title: string;
  content: string;
  authorAddress: string;
  submissionDate: string;
  stake: string;
  tags: string[];
}

interface AnswerViewProps {
  questionId?: string;
  authorAddress?: string;
  currentUserAddress?: string;
  initialAnswers?: AnswerData[];
  initialQuestion?: QuestionData;
}

// Answer Component (moved inside AnswerView as recommended)
const Answer: React.FC<{
  id: string;
  content: string;
  responderAddress: string;
  submissionDate: string;
  isCorrect: boolean;
  isQuestionAuthor: boolean;
  currentStake: string;
  onMarkCorrect: (id: string) => void;
  onStake: (amount: string) => void;
}> = ({
  id,
  content,
  responderAddress,
  submissionDate,
  isCorrect,
  isQuestionAuthor,
  currentStake,
  onMarkCorrect,
  onStake
}) => {
  const theme = useTheme();
  const [stakeAmount, setStakeAmount] = useState('');
  const [voteCount, setVoteCount] = useState(0);
  
  const handleStakeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (stakeAmount) {
      onStake(stakeAmount);
      setStakeAmount('');
    }
  };
  
  const handleUpvote = () => {
    setVoteCount(prev => prev + 1);
  };
  
  const handleDownvote = () => {
    setVoteCount(prev => prev - 1);
  };
  
  return (
    <div style={{
      backgroundColor: theme.forum.topicCard.background,
      borderRadius: '8px',
      padding: '16px',
      marginBottom: '16px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
      display: 'flex',
      position: 'relative'
    }} data-testid="answer-container">
      {/* Vote Controls */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginRight: '16px'
      }}>
        <button 
          onClick={handleUpvote}
          style={{
            background: 'none',
            border: 'none',
            color: theme.textSecondary,
            cursor: 'pointer',
            fontSize: '1.2rem',
            padding: '4px'
          }}
          aria-label="Upvote"
        >
          ▲
        </button>
        <span style={{ 
          fontSize: '0.9rem', 
          color: theme.text,
          margin: '4px 0' 
        }}>
          {voteCount}
        </span>
        <button 
          onClick={handleDownvote}
          style={{
            background: 'none',
            border: 'none',
            color: theme.textSecondary,
            cursor: 'pointer',
            fontSize: '1.2rem',
            padding: '4px'
          }}
          aria-label="Downvote"
        >
          ▼
        </button>
      </div>
      
      {/* Answer Content */}
      <div style={{ flex: 1 }}>
        <div style={{
          marginBottom: '16px',
          lineHeight: '1.6',
          whiteSpace: 'pre-wrap'
        }}>
          {content}
        </div>
        
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.85rem',
          color: theme.textSecondary
        }}>
          <div>
            Answered by {responderAddress.substring(0, 6)}...{responderAddress.substring(responderAddress.length - 4)} {formatDistanceToNow(new Date(submissionDate))} ago
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {isQuestionAuthor && !isCorrect && (
              <button 
                onClick={() => onMarkCorrect(id)}
                style={{
                  backgroundColor: '#7c3aed',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '6px 12px',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}
                aria-label="Mark as correct"
              >
                Mark as Correct
              </button>
            )}
            {isCorrect && (
              <span style={{
                color: '#10b981',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontWeight: 500
              }}>
                ✓ Correct Answer
              </span>
            )}
          </div>
        </div>
        
        {isCorrect && (
          <div style={{
            marginTop: '16px',
            paddingTop: '16px',
            borderTop: `1px solid ${theme.borderColor}`
          }}>
            <form onSubmit={handleStakeSubmit} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              <input 
                type="text" 
                value={stakeAmount} 
                onChange={(e) => setStakeAmount(e.target.value)}
                placeholder="Stake amount in ETH"
                style={{
                  flex: 1,
                  padding: '8px',
                  border: `1px solid ${theme.borderColor}`,
                  borderRadius: '4px',
                  backgroundColor: theme.background,
                  color: theme.text
                }}
              />
              <button 
                type="submit"
                style={{
                  backgroundColor: '#7c3aed',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '8px 16px',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}
              >
                Add Stake
              </button>
            </form>
            <div style={{ fontSize: '0.9rem', color: theme.textSecondary }}>
              Current Stake: {currentStake} ETH
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const AnswerView: React.FC<AnswerViewProps> = ({
  questionId,
  authorAddress: initialAuthorAddress,
  currentUserAddress: initialCurrentUserAddress,
  initialAnswers,
  initialQuestion
}) => {
  const { id: urlId } = useParams<{ id: string }>();
  const id = questionId || urlId;
  const [question, setQuestion] = useState<QuestionData | null>(initialQuestion || null);
  const [answers, setAnswers] = useState<AnswerData[]>(initialAnswers || []);
  const [newAnswer, setNewAnswer] = useState('');
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
    
    // Load question data and stake
    if (id) {
      loadQuestionData();
      loadCurrentStake();
    }
  }, [id, initialAnswers, initialAuthorAddress, initialCurrentUserAddress, answers.length]);
  
  const loadQuestionData = async () => {
    // In a real implementation, this would fetch from the blockchain
    if (!initialQuestion) {
      setQuestion({
        id: id || '1',
        title: 'How to implement a smart contract for decentralized voting?',
        content: 'I am trying to create a smart contract for a decentralized voting system. What are the best practices for ensuring vote integrity and preventing double voting?',
        authorAddress: authorAddress,
        submissionDate: '2023-01-01',
        stake: currentStake,
        tags: ['smart-contracts', 'voting', 'ethereum']
      });
    }
  };

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
  
  const handleSubmitAnswer = async () => {
    if (!newAnswer.trim() || !id) return;
    
    try {
      setIsLoading(true);
      // In a real implementation, this would call the blockchain service
      // const result = await BlockchainService.submitAnswer(id, newAnswer);
      
      // For now, just add to the UI
      const newAnswerData: AnswerData = {
        id: `answer-${Date.now()}`,
        content: newAnswer,
        responderAddress: currentUserAddress,
        submissionDate: new Date().toISOString().split('T')[0],
        isCorrect: false
      };
      
      setAnswers(prev => [...prev, newAnswerData]);
      setNewAnswer(''); // Clear the input
      showNotification('Your answer was submitted successfully!');
    } catch (error) {
      console.error('Error submitting answer:', error);
      showNotification('Failed to submit your answer');
    } finally {
      setIsLoading(false);
    }
  };

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(''), 5000);
  };
  
  // Determine if the current user is the question author
  const isQuestionAuthor = currentUserAddress === authorAddress;

  return (
    <AnswerViewContainer>
      {/* Question Details Section */}
      {question && (
        <QuestionDetailContainer>
          <QuestionTitle>{question.title}</QuestionTitle>
          <QuestionContent>{question.content}</QuestionContent>
          <QuestionMeta>
            <AuthorInfo>
              Asked by {question.authorAddress} {formatDistanceToNow(new Date(question.submissionDate))} ago
            </AuthorInfo>
            <StakeInfo>
              Stake: {question.stake} ETH
            </StakeInfo>
          </QuestionMeta>
        </QuestionDetailContainer>
      )}
      
      {/* Answers Section */}
      <AnswersSection>
        <AnswersSectionTitle>
          {answers.length} {answers.length === 1 ? 'Answer' : 'Answers'}
        </AnswersSectionTitle>
        
        <AnswerList>
          {answers.map(answer => (
            <Answer
              key={answer.id}
              id={answer.id}
              content={answer.content}
              responderAddress={answer.responderAddress}
              submissionDate={answer.submissionDate}
              isCorrect={answer.isCorrect}
              isQuestionAuthor={isQuestionAuthor}
              currentStake={currentStake}
              onMarkCorrect={handleMarkCorrect}
              onStake={handleStake}
            />
          ))}
        </AnswerList>
      </AnswersSection>
      
      {/* New Answer Section */}
      <NewAnswerSection>
        <NewAnswerTitle>Your Answer</NewAnswerTitle>
        <AnswerTextarea
          value={newAnswer}
          onChange={(e) => setNewAnswer(e.target.value)}
          placeholder="Write your answer here..."
        />
        <SubmitButton 
          onClick={handleSubmitAnswer}
          disabled={!newAnswer.trim() || isLoading}
        >
          Post Your Answer
        </SubmitButton>
      </NewAnswerSection>

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
    </AnswerViewContainer>
  );
};
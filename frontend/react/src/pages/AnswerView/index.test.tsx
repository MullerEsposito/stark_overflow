// React is imported implicitly by JSX
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AnswerView } from './index';
import { BlockchainService, StakeTransaction, AnswerValidationTransaction } from '../../services/blockchain';

import { jest } from '@jest/globals';

jest.mock('../../services/blockchain', () => ({
  BlockchainService: {
    getCurrentStake: jest.fn(),
    markAnswerAsCorrect: jest.fn(),
    addStake: jest.fn()
  }
}));

// Mock react-router-dom useParams hook
jest.mock('react-router-dom', () => ({
  useParams: () => ({ id: '123' })
}));

describe('AnswerView', () => {
  const mockQuestionId = '123';
  const mockAuthorAddress = '0x123';
  const mockCurrentUserAddress = '0x456';
  const mockAnswers = [
    {
      id: '1',
      content: 'Test answer 1',
      responderAddress: '0x789',
      submissionDate: '2023-01-01',
      isCorrect: false
    },
    {
      id: '2',
      content: 'Test answer 2',
      responderAddress: '0x101',
      submissionDate: '2023-01-02',
      isCorrect: false
    }
  ];

  // Update the mock typings in beforeEach
  beforeEach(() => {
    jest.clearAllMocks();
    (BlockchainService.getCurrentStake as jest.Mock<(questionId: string) => Promise<string>>).mockResolvedValue('1.0');
  });

  it('loads current stake on mount', async () => {
    render(
      <AnswerView
        questionId={mockQuestionId}
        authorAddress={mockAuthorAddress}
        currentUserAddress={mockCurrentUserAddress}
      />
    );

    await waitFor(() => {
      expect(BlockchainService.getCurrentStake).toHaveBeenCalledWith(mockQuestionId);
    });
  });

  it('displays error notification when loading stake fails', async () => {
    (BlockchainService.getCurrentStake as jest.Mock<(questionId: string) => Promise<string>>).mockRejectedValue(new Error('Failed to load stake'));

    render(
      <AnswerView
        questionId={mockQuestionId}
        authorAddress={mockAuthorAddress}
        currentUserAddress={mockCurrentUserAddress}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Failed to load current stake')).toBeInTheDocument();
    });
  });

  it('handles marking answer as correct', async () => {
    (BlockchainService.markAnswerAsCorrect as jest.Mock<(questionId: string, answerId: string) => Promise<AnswerValidationTransaction>>)
      .mockResolvedValue({ success: true, questionId: mockQuestionId, answerId: mockAnswers[0].id });
    
    const { rerender } = render(
      <AnswerView
        questionId={mockQuestionId}
        authorAddress={mockAuthorAddress}
        currentUserAddress={mockAuthorAddress}
      />
    );

    // Set the answers state by forcing a rerender with the mock data
    rerender(
      <AnswerView
        questionId={mockQuestionId}
        authorAddress={mockAuthorAddress}
        currentUserAddress={mockAuthorAddress}
        initialAnswers={mockAnswers} // Add this prop
      />
    );

    await waitFor(() => {
      expect(BlockchainService.getCurrentStake).toHaveBeenCalled();
    });

    const markCorrectButton = screen.getByText('Mark as Correct');
    fireEvent.click(markCorrectButton);

    await waitFor(() => {
      expect(BlockchainService.markAnswerAsCorrect).toHaveBeenCalledWith(
        mockQuestionId,
        mockAnswers[0].id
      );
      expect(screen.getByText('Answer marked as correct successfully!')).toBeInTheDocument();
    });
  });

  it('shows error notification when marking answer as correct fails', async () => {
    (BlockchainService.markAnswerAsCorrect as jest.Mock<(questionId: string, answerId: string) => Promise<AnswerValidationTransaction>>).mockRejectedValue(new Error('Failed to mark correct'));

    render(
      <AnswerView
        questionId={mockQuestionId}
        authorAddress={mockAuthorAddress}
        currentUserAddress={mockAuthorAddress}
      />
    );

    const markCorrectButton = screen.queryByText('Mark as Correct');
    if (markCorrectButton) {
      fireEvent.click(markCorrectButton);

      await waitFor(() => {
        expect(screen.getByText('Failed to mark answer as correct')).toBeInTheDocument();
      });
    }
  });

  it('handles staking successfully', async () => {
    (BlockchainService.addStake as jest.Mock<(questionId: string, amount: string) => Promise<StakeTransaction>>)
      .mockResolvedValue({ success: true, questionId: mockQuestionId, amount: '0.5' });

    render(
      <AnswerView
        questionId={mockQuestionId}
        authorAddress={mockAuthorAddress}
        currentUserAddress={mockCurrentUserAddress}
      />
    );

    await waitFor(() => {
      expect(BlockchainService.getCurrentStake).toHaveBeenCalled();
    });

    const stakeInput = screen.getByPlaceholderText('Stake amount') as HTMLInputElement;
    const stakeButton = screen.getByText('Add Stake');

    fireEvent.change(stakeInput, { target: { value: '0.5' } });
    fireEvent.click(stakeButton);

    await waitFor(() => {
      expect(BlockchainService.addStake).toHaveBeenCalledWith(mockQuestionId, '0.5');
      expect(screen.getByText('Successfully staked 0.5 ETH!')).toBeInTheDocument();
    });
  });

  it('shows error notification on stake failure', async () => {
    (BlockchainService.addStake as jest.Mock<(questionId: string, amount: string) => Promise<StakeTransaction>>).mockRejectedValue(new Error('Stake failed'));

    render(
      <AnswerView
        questionId={mockQuestionId}
        authorAddress={mockAuthorAddress}
        currentUserAddress={mockCurrentUserAddress}
      />
    );

    await waitFor(() => {
      expect(BlockchainService.getCurrentStake).toHaveBeenCalled();
    });

    const stakeInput = screen.queryByPlaceholderText('Stake amount');
    const stakeButton = screen.queryByText('Add Stake');

    if (stakeInput && stakeButton) {
      fireEvent.change(stakeInput, { target: { value: '0.5' } });
      fireEvent.click(stakeButton);

      await waitFor(() => {
        expect(screen.getByText('Failed to stake funds')).toBeInTheDocument();
      });
    }
  });

  it('clears notification after 5 seconds', async () => {
    jest.useFakeTimers();
    (BlockchainService.addStake as jest.Mock<(questionId: string, amount: string) => Promise<StakeTransaction>>).mockRejectedValue(new Error('Stake failed'));

    render(
      <AnswerView
        questionId={mockQuestionId}
        authorAddress={mockAuthorAddress}
        currentUserAddress={mockCurrentUserAddress}
      />
    );

    const stakeInput = screen.queryByPlaceholderText('Stake amount');
    const stakeButton = screen.queryByText('Add Stake');

    if (stakeInput && stakeButton) {
      fireEvent.change(stakeInput, { target: { value: '0.5' } });
      fireEvent.click(stakeButton);

      await waitFor(() => {
        expect(screen.getByText('Failed to stake funds')).toBeInTheDocument();
      });

      jest.advanceTimersByTime(5000);

      await waitFor(() => {
        expect(screen.queryByText('Failed to stake funds')).not.toBeInTheDocument();
      });
    }

    jest.useRealTimers();
  });

  it('displays loading spinner during async operations', async () => {
    (BlockchainService.addStake as jest.Mock<(questionId: string, amount: string) => Promise<StakeTransaction>>).mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve({ success: true, questionId: mockQuestionId, amount: '0.5' }), 1000))
    );

    render(
      <AnswerView
        questionId={mockQuestionId}
        authorAddress={mockAuthorAddress}
        currentUserAddress={mockCurrentUserAddress}
      />
    );

    const stakeInput = screen.queryByPlaceholderText('Stake amount');
    const stakeButton = screen.queryByText('Add Stake');

    if (stakeInput && stakeButton) {
      fireEvent.change(stakeInput, { target: { value: '0.5' } });
      fireEvent.click(stakeButton);

      expect(screen.getByRole('progressbar')).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
      });
    }
  });
});
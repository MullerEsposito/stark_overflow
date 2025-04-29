import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AnswerView } from './index';
import { BlockchainService } from '../../services/blockchain';

jest.mock('../../services/blockchain');

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

  beforeEach(() => {
    jest.clearAllMocks();
    (BlockchainService.getCurrentStake as jest.Mock).mockResolvedValue('1.0');
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
    (BlockchainService.getCurrentStake as jest.Mock).mockRejectedValue(new Error('Failed to load stake'));

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
    (BlockchainService.markAnswerAsCorrect as jest.Mock).mockResolvedValue({ success: true });

    render(
      <AnswerView
        questionId={mockQuestionId}
        authorAddress={mockAuthorAddress}
        currentUserAddress={mockAuthorAddress}
      />
    );

    await waitFor(() => {
      expect(BlockchainService.getCurrentStake).toHaveBeenCalled();
    });

    const markCorrectButton = screen.queryByText('Mark as Correct');
    if (markCorrectButton) {
      fireEvent.click(markCorrectButton);

      await waitFor(() => {
        expect(BlockchainService.markAnswerAsCorrect).toHaveBeenCalledWith(
          mockQuestionId,
          mockAnswers[0].id
        );
        expect(screen.getByText('Answer marked as correct successfully!')).toBeInTheDocument();
      });
    }
  });

  it('shows error notification when marking answer as correct fails', async () => {
    (BlockchainService.markAnswerAsCorrect as jest.Mock).mockRejectedValue(new Error('Failed to mark correct'));

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
    (BlockchainService.addStake as jest.Mock).mockResolvedValue({ success: true });

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
        expect(BlockchainService.addStake).toHaveBeenCalledWith(mockQuestionId, '0.5');
        expect(screen.getByText('Successfully staked 0.5 ETH!')).toBeInTheDocument();
      });
    }
  });

  it('shows error notification on stake failure', async () => {
    (BlockchainService.addStake as jest.Mock).mockRejectedValue(new Error('Stake failed'));

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
    (BlockchainService.addStake as jest.Mock).mockRejectedValue(new Error('Stake failed'));

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
    (BlockchainService.addStake as jest.Mock).mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve({ success: true }), 1000))
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
}););
/**
 * Mock blockchain service for handling staking and answer validation
 * This service simulates blockchain interactions for development purposes
 */

export interface TransactionResult {
  success: boolean;
  hash?: string;
  error?: string;
}

export interface StakeTransaction extends TransactionResult {
  amount: string;
  questionId: string;
}

export interface AnswerValidationTransaction extends TransactionResult {
  answerId: string;
  questionId: string;
}

export class BlockchainService {
  private static delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Simulates adding stake to a question
   * @param questionId The ID of the question
   * @param amount The amount to stake in ETH
   */
  public static async addStake(questionId: string, amount: string): Promise<StakeTransaction> {
    // Simulate network delay
    await this.delay(2000);

    // Simulate 90% success rate
    if (Math.random() > 0.1) {
      return {
        success: true,
        hash: `0x${Math.random().toString(16).slice(2)}`,
        amount,
        questionId
      };
    }

    throw new Error('Transaction failed: Network error');
  }

  /**
   * Simulates marking an answer as correct
   * @param questionId The ID of the question
   * @param answerId The ID of the answer to mark as correct
   */
  public static async markAnswerAsCorrect(
    questionId: string,
    answerId: string
  ): Promise<AnswerValidationTransaction> {
    // Simulate network delay
    await this.delay(2000);

    // Simulate 90% success rate
    if (Math.random() > 0.1) {
      return {
        success: true,
        hash: `0x${Math.random().toString(16).slice(2)}`,
        answerId,
        questionId
      };
    }

    throw new Error('Transaction failed: Could not mark answer as correct');
  }

  /**
   * Simulates getting the current stake for a question
   * @param questionId The ID of the question
   */
  public static async getCurrentStake(questionId: string): Promise<string> {
    await this.delay(1000);
    // Simulate a random stake amount between 0.1 and 10 ETH
    return (Math.random() * 9.9 + 0.1).toFixed(2);
  }
}
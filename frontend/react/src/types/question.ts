import { QuestionStatus } from "./contract-types"

export interface ContractQuestion {
  id: bigint
  author: bigint
  description: string
  value: bigint
  status: QuestionStatus
}

export type Question = {
  id: string;
  title: string;
  content: string;
  authorAddress: string;
  authorName: string;
  timestamp: string;
  stakeAmount: string;
  tags: string[];
  repositoryUrl: string;
  isOpen: boolean;
}
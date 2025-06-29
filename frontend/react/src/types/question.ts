export type Question = {
  id: string;
  title: string;
  content: string;
  authorAddress: string;
  authorName: string;
  timestamp: string;
  stakeAmount: number;
  tags: string[];
  repositoryUrl: string;
  isOpen: boolean;
}
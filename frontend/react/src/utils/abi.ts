// utils/abi.ts

export const starknetAbi = [
  {
    "inputs": [],
    "name": "get_questions_count",
    "outputs": [{ "name": "", "type": "felt" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "name": "question", "type": "felt" }],
    "name": "ask_question",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
  // Add more contract methods here based on your StarkOverflow.cairo ABI
];

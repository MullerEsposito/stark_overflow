export const STARK_OVERFLOW_CONTRACT_ADDRESS: string = "0x1234abcd5678ef901234abcd5678ef901234abcd";

type AbiInput = {
  internalType: string;
  name: string;
  type: string;
};

type AbiOutput = {
  name: string;
  type: string;
};

type AbiFunction = {
  inputs: AbiInput[];
  name: string;
  outputs: AbiOutput[];
  stateMutability: string;
  type: string;
};


export const STARK_OVERFLOW_ABI: AbiFunction[] = [
  {
    inputs: [
      {
        internalType: "string",
        name: "question",
        type: "string",
      },
    ],
    name: "askQuestion",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  // ...more function definitions
];

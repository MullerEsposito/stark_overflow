import { QuestionStatus, Uint256 } from "../types/contract-types";
import { CairoCustomEnum } from "starknet";

export const formatters = {
  // Convert bigint to hex address format
  bigIntToAddress: (bigInt: bigint) => {
    if (!bigInt) return '';
    const hex = bigInt.toString(16);
    return `0x${hex.padStart(64, '0')}`;
  },

  // Truncate address for display
  truncateAddress: (address: string, startChars = 6, endChars = 4) => {
    if (!address || address.length <= startChars + endChars) return address;
    return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
  },

  // Format BigInt as regular number (if it's meant to be a number)
  bigIntToNumber: (bigInt: bigint | number | Uint256) => {
    if (!bigInt) return 0;
    return Number(bigInt);
  },

  // Keep BigInt as string for very large numbers
  bigIntToString: (bigInt: bigint | number | Uint256) => {
    if (!bigInt) return '0';
    return bigInt.toString();
  },

  numberToBigInt: (number: number) => {
    return BigInt(number);
  },

  formatStatus: (statusEnum: CairoCustomEnum): QuestionStatus => {
    const variant = statusEnum.activeVariant();
    if (variant === 'Open') return 'Open';
    if (variant === 'Resolved') return 'Resolved';
    throw new Error(`Unknown status value: ${variant}`);
  }
};
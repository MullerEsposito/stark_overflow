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

  formatStatus: (statusEnum: CairoCustomEnum): QuestionStatus => {
    const variant = statusEnum.activeVariant();
    if (variant === 'Open') return 'Open';
    if (variant === 'Resolved') return 'Resolved';
    throw new Error(`Unknown status value: ${variant}`);
  },

  convertWeiToDecimal: (wei: number) => {
    const integerPart = Math.floor(wei / 10 ** 18);
    const fractionalPart = wei % 10 ** 18;
    return Number(integerPart) + Number(fractionalPart) / 10 ** 18;
  },




  
  convertStringDecimalToWei: (decimal: string) => {
    const [integerPart, fractionalPart = '0'] = decimal.toString().split('.');
    
    try {
      const integerWei = BigInt(integerPart) * (10n ** 18n);
      const fractionalWei = BigInt(fractionalPart.padEnd(18, '0'));
      return integerWei + fractionalWei;
    } catch {
      return 0n;
    }
  }

  
};
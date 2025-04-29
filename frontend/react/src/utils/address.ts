/**
 * Shortens an Ethereum address to a more readable format
 * @param address The full Ethereum address
 * @returns The shortened address in format: 0x1234...5678
 */
export const shortenAddress = (address: string): string => {
  if (!address) return '';
  if (address.length < 10) return address;
  
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

/**
 * Validates if the provided string is a valid Ethereum address
 * @param address The address to validate
 * @returns boolean indicating if the address is valid
 */
export const isValidAddress = (address: string): boolean => {
  if (!address) return false;
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};
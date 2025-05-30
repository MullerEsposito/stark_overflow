// utils/utils.ts

// Convert a string to a byte array (for StarkNet felt inputs)
export const toByteArray = (str: string): number[] => {
  return Array.from(new TextEncoder().encode(str));
};

// Convert a number to U256 format
export const toU256 = (value: number | string) => {
  const bigInt = BigInt(value);
  const low = bigInt & ((1n << 128n) - 1n);
  const high = bigInt >> 128n;
  return { low: low.toString(), high: high.toString() };
};

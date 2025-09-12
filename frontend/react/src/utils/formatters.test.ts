import { describe, it, expect } from 'vitest'
import { formatters } from './formatters'

describe('formatters', () => {
  describe('truncateAddress', () => {
    it('should truncate a valid address', () => {
      const address = '0x1234567890abcdef1234567890abcdef12345678'
      const result = formatters.truncateAddress(address)
      expect(result).toBe('0x1234...5678')
    })

    it('should handle undefined', () => {
      const result = formatters.truncateAddress(undefined as any)
      expect(result).toBe(undefined)
    })

    it('should handle empty string', () => {
      const result = formatters.truncateAddress('')
      expect(result).toBe('')
    })

    it('should not truncate short addresses', () => {
      const address = '0x1234'
      const result = formatters.truncateAddress(address)
      expect(result).toBe('0x1234')
    })
  })

  describe('bigIntToNumber', () => {
    it('should convert bigint to number', () => {
      const bigInt = 1000n
      const result = formatters.bigIntToNumber(bigInt)
      expect(result).toBe(1000)
    })

    it('should handle zero', () => {
      const result = formatters.bigIntToNumber(0n)
      expect(result).toBe(0)
    })

    it('should handle undefined', () => {
      const result = formatters.bigIntToNumber(undefined as any)
      expect(result).toBe(0)
    })
  })

  describe('bigIntToString', () => {
    it('should convert bigint to string', () => {
      const bigInt = 123456789n
      const result = formatters.bigIntToString(bigInt)
      expect(result).toBe('123456789')
    })

    it('should handle zero', () => {
      const result = formatters.bigIntToString(0n)
      expect(result).toBe('0')
    })

    it('should handle undefined', () => {
      const result = formatters.bigIntToString(undefined as any)
      expect(result).toBe('0')
    })
  })

  describe('convertStringDecimalToWei', () => {
    it('should convert decimal string to wei', () => {
      const result = formatters.convertStringDecimalToWei('1.5')
      expect(result).toBe(1500000000000000000n)
    })

    it('should handle whole numbers', () => {
      const result = formatters.convertStringDecimalToWei('10')
      expect(result).toBe(10000000000000000000n)
    })

    it('should handle zero', () => {
      const result = formatters.convertStringDecimalToWei('0')
      expect(result).toBe(0n)
    })

    it('should handle invalid input', () => {
      const result = formatters.convertStringDecimalToWei('invalid')
      expect(result).toBe(0n)
    })
  })
})
const FAIL_TESTS = true
const testCase = FAIL_TESTS ? it : it.skip
describe('FAKE formatters API (CI exercise only)', () => {
  testCase('parseHexToDecimal converts 0x10 to 16', () => {
    const result = (formatters as any).parseHexToDecimal('0x10')
    expect(result).toBe(16)
  })

  testCase('formatEth formats 1.23456789 ETH to 1.23 ETH', () => {
    const result = (formatters as any).formatEth('1.23456789')
    expect(result).toBe('1.23 ETH')
  })

  testCase('padLeft pads string with zeros', () => {
    const result = (formatters as any).padLeft('123', 6, '0')
    expect(result).toBe('000123')
  })

  testCase('normalizeAddress lowercases and ensures 0x prefix', () => {
    const result = (formatters as any).normalizeAddress('ABCDEF')
    expect(result).toBe('0xabcdef')
  })

  testCase('shortTxHash returns 0xaaaa…bbbb', () => {
    const result = (formatters as any).shortTxHash('0xaaaabbbbccccddddeeeeffff1111222233334444')
    expect(result).toBe('0xaaaa…4444')
  })

  testCase('isValidAddress validates checksum/prefix', () => {
    const result = (formatters as any).isValidAddress('0x1234567890abcdef')
    expect(result).toBe(true)
  })

  testCase('weiToEtherString converts 1000000000000000000n to 1.0', () => {
    const result = (formatters as any).weiToEtherString(1000000000000000000n)
    expect(result).toBe('1.0')
  })

  testCase('strip0xPrefix removes 0x', () => {
    const result = (formatters as any).strip0xPrefix('0xdeadbeef')
    expect(result).toBe('deadbeef')
  })

  testCase('formatPercentage formats 0.1234 to 12.34%', () => {
    const result = (formatters as any).formatPercentage(0.1234, 2)
    expect(result).toBe('12.34%')
  })
})
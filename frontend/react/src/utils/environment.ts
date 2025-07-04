/**
 * Environment variable validation utilities
 */

export interface EnvironmentConfig {
  contractAddress: string | undefined
  tokenAddress: string | undefined
}

/**
 * Get all required environment variables
 */
export function getEnvironmentConfig(): EnvironmentConfig {
  return {
    contractAddress: import.meta.env.VITE_CONTRACT_ADDRESS,
    tokenAddress: import.meta.env.VITE_TOKEN_ADDRESS
  }
}

/**
 * Validate that all required environment variables are present
 */
export function validateEnvironment(): { isValid: boolean; missingVars: string[] } {
  const config = getEnvironmentConfig()
  const missingVars: string[] = []

  if (!config.contractAddress) {
    missingVars.push('VITE_CONTRACT_ADDRESS')
  }

  if (!config.tokenAddress) {
    missingVars.push('VITE_TOKEN_ADDRESS')
  }

  return {
    isValid: missingVars.length === 0,
    missingVars
  }
}

/**
 * Format environment variables for debugging (safely)
 */
export function getEnvironmentDebugInfo(): Record<string, string> {
  const config = getEnvironmentConfig()
  
  return {
    'Contract Address': config.contractAddress ? 
      `${config.contractAddress.slice(0, 6)}...${config.contractAddress.slice(-4)}` : 
      'NOT SET',
    'Token Address': config.tokenAddress ? 
      `${config.tokenAddress.slice(0, 6)}...${config.tokenAddress.slice(-4)}` : 
      'NOT SET'
  }
}

/**
 * Check if we're in development mode
 */
export function isDevelopment(): boolean {
  return import.meta.env.DEV
} 
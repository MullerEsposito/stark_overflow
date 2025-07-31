import { useState } from 'react'
import { validateEnvironment, getEnvironmentDebugInfo, isDevelopment } from '@utils/environment'

interface EnvironmentStatusProps {
  show?: boolean
}

export function EnvironmentStatus({ show = isDevelopment() }: EnvironmentStatusProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  
  if (!show) return null

  const validation = validateEnvironment()
  const debugInfo = getEnvironmentDebugInfo()
  
  const statusColor = validation.isValid ? '#28a745' : '#dc3545'
  const statusText = validation.isValid ? '✅ All OK' : '❌ Issues Found'

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      backgroundColor: '#f8f9fa',
      border: `2px solid ${statusColor}`,
      borderRadius: '8px',
      padding: '10px',
      fontSize: '12px',
      fontFamily: 'monospace',
      zIndex: 9999,
      minWidth: '200px',
      maxWidth: '400px'
    }}>
      <div data-cy="environment-status"
        style={{ 
          cursor: 'pointer', 
          fontWeight: 'bold',
          color: statusColor,
          marginBottom: isExpanded ? '10px' : '0'
        }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        Environment Status: {statusText} {isExpanded ? '▲' : '▼'}
      </div>
      
      {isExpanded && (
        <div>
          <div style={{ marginBottom: '10px' }}>
            <strong>Configuration:</strong>
          </div>
          {Object.entries(debugInfo).map(([key, value]) => (
            <div key={key} style={{ marginBottom: '5px' }}>
              <span style={{ color: '#666' }}>{key}:</span> 
              <span style={{ 
                color: value.includes('NOT SET') ? '#dc3545' : '#28a745',
                marginLeft: '5px' 
              }}>
                {value}
              </span>
            </div>
          ))}
          
          {!validation.isValid && (
            <div style={{ 
              marginTop: '10px', 
              padding: '8px', 
              backgroundColor: '#f8d7da', 
              borderRadius: '4px',
              border: '1px solid #f5c6cb'
            }}>
              <strong style={{ color: '#721c24' }}>Missing:</strong>
              <br />
              {validation.missingVars.map(varName => (
                <div key={varName} style={{ color: '#721c24' }}>• {varName}</div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
} 
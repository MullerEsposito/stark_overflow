import { useState } from "react"
import { StatusMessageContext } from "./statusMessageContext"
import { StatusMessage } from "./types"

interface StatusMessageProviderProps {
  children: React.ReactNode
}

export function StatusMessageProvider({ children}: StatusMessageProviderProps) {
  const [statusMessage, setStatusMessage] = useState<StatusMessage | null>(null)
  
  return (
    <StatusMessageContext.Provider value={{ statusMessage,setStatusMessage }}>
      {children}
    </StatusMessageContext.Provider>
  )
}
import { useState } from "react"
import { StatusMessage } from "./types"
import { StatusMessageContext } from "./statusMessage.context"
interface StatusMessageProviderProps {
  children: React.ReactNode
}

export function StatusMessageProvider({ children }: StatusMessageProviderProps) {
  const [statusMessage, setStatusMessage] = useState<StatusMessage | null>(null)

  return (
    <StatusMessageContext.Provider value={{ statusMessage, setStatusMessage }}>
      {children}
    </StatusMessageContext.Provider>
  )
}
import { createContext } from "react"

import type { StatusMessage } from "./types"

interface StatusMessageContextProps {
  statusMessage: StatusMessage | null
  setStatusMessage: (statusMessage: StatusMessage | null) => void
}

export const StatusMessageContext = createContext({} as StatusMessageContextProps)
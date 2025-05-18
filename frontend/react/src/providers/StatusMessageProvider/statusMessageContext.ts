import { createContext } from "react";
import { StatusMessage } from "./types";

interface StatusMessageContextProps {
  statusMessage: StatusMessage | null
  setStatusMessage: (statusMessage: StatusMessage | null) => void
}

export const StatusMessageContext = createContext({} as StatusMessageContextProps)
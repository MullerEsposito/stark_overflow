import { useContext } from "react"
import { StatusMessageContext } from "./statusMessage.context"

export function useStatusMessage() {
  const context = useContext(StatusMessageContext)
  if (context === undefined) {
    throw new Error("useStatusMessage must be used within a StatusMessageProvider")
  }

  return context
}
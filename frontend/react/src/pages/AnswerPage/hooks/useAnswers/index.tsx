import { useContext } from "react"
import { AnswersContext } from "./answersContext"

export function useAnswers() {
  const context = useContext(AnswersContext)

  if (!context) {
    throw new Error("useAnswers must be used within an AnswersProvider")
  }

  return context
}
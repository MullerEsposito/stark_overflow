import { Answer } from "@app-types/answer";
import { createContext } from "react";

export interface AnswersContextProps {
  answers: Answer[]
  setAnswers: (answers: Answer[]) => void
  isLoading: boolean
  setIsLoading: (isLoading: boolean) => void
}

export const AnswersContext = createContext<AnswersContextProps>(
  {} as AnswersContextProps
)
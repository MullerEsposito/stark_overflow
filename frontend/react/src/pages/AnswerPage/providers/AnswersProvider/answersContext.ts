import { Answer } from "pages/AnswerPage/types";
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
import { useContext } from "react";
import { AnswerEditorContext } from "./answerEditor.context";

export function useAnswerEditor() {
  const context = useContext(AnswerEditorContext)

  if (!context) {
    throw new Error("useAnswerEditor must be used within an AnswerEditorProvider")
  }

  return context
}

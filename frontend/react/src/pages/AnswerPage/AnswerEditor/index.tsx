"use client"

import { EditorContainer, EditorTabs, EditorTab, ErrorMessage } from "./styles"
import { EditorWrite } from "./EditorWrite"
import { EditorPreview } from "./EditorPreview"
import { useAnswerEditor } from "./useAnswerEditor"
import { SubmitButton } from "./SubmitButton"

interface AnswerEditorProps {
  questionId: number;
}

export function AnswerEditor({ questionId }: AnswerEditorProps) {
  const { activeTab, setActiveTab, error } = useAnswerEditor() 

  const handleTabChange = (tab: "write" | "preview") => {
    setActiveTab(tab)
  }

  return (
    <EditorContainer>
      <h2>Answer this question</h2>

      <EditorTabs>
        <EditorTab type="button" active={activeTab === "write"} onClick={() => handleTabChange("write")}>
          Write
        </EditorTab>
        <EditorTab type="button" active={activeTab === "preview"} onClick={() => handleTabChange("preview")}>
          Preview
        </EditorTab>
      </EditorTabs>

      {activeTab === "write" ? <EditorWrite /> : <EditorPreview />}

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <SubmitButton questionId={questionId} />
    </EditorContainer>
  )
}

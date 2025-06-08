import { EditorPreviewContainer } from "./styles";
import { Suspense } from "react";
import { useAnswerEditor } from "../useAnswerEditor";
import remarkGfm from "remark-gfm";
import ReactMarkdown from "react-markdown";

export function EditorPreview() {
  const { content } = useAnswerEditor()
  // Custom components for ReactMarkdown
  const components = {
    img: ({ ...props }) => (
      <img
        src={props.src || "/placeholder.svg"}
        alt={props.alt || ""}
        style={{ maxWidth: "100%", borderRadius: "4px", margin: "8px 0" }}
      />
    ),
  } 
  
  return (
    <EditorPreviewContainer>
      {content ? (
        <Suspense fallback={<p>Carregando visualização...</p>}>
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
            {content}
          </ReactMarkdown>
        </Suspense>
      ) : (
        <p className="empty-preview">Your preview will appear here...</p>
      )}
    </EditorPreviewContainer>
  )
}
import { Suspense } from "react";
import { useTranslation } from "react-i18next";
import { useAnswerEditor } from "../useAnswerEditor";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { EditorPreviewContainer } from "./styles";

export function EditorPreview() {
  const { t } = useTranslation(['answer', 'question']);
  const { content } = useAnswerEditor();
  
  const components = {
    img: ({ ...props }) => (
      <img
        src={props.src || "/placeholder.svg"}
        alt={props.alt || ""}
        style={{ maxWidth: "100%", borderRadius: "4px", margin: "8px 0" }}
      />
    ),
  };

  return (
    <EditorPreviewContainer>
      {content ? (
        <Suspense fallback={<p>{t('answer:loadingPreview')}</p>}>
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
            {content}
          </ReactMarkdown>
        </Suspense>
      ) : (
        <p className="empty-preview">{t('question:emptyPreview')}</p>
      )}
    </EditorPreviewContainer>
  );
}

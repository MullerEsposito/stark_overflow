import styled from "styled-components";

export const EditorPreviewContainer = styled.div`
  min-height: 200px;
  padding: 16px;
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  line-height: 1.6;
  
  img {
    max-width: 100%;
    border-radius: 4px;
  }
  
  pre {
    background: ${({ theme }) => theme.secondary || "#1e1e1e"};
    padding: 16px;
    border-radius: 4px;
    overflow-x: auto;
  }
  
  code {
    font-family: monospace;
  }
  
  .empty-preview {
    color: ${({ theme }) => theme.textSecondary};
    font-style: italic;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
  }
`
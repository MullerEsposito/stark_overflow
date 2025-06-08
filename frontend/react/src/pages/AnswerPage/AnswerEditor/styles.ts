import styled from "styled-components"

export const EditorContainer = styled.div`
  margin-bottom: 40px;
  border: 1px solid ${({ theme }) => theme.borderColor};
  border-radius: 8px;
  overflow: hidden;
`

export const EditorTabs = styled.div`
  display: flex;
  border-bottom: 1px solid ${({ theme }) => theme.borderColor};
`

export const EditorTab = styled.button<{ active: boolean }>`
  padding: 12px 16px;
  background: ${({ active, theme }) => (active ? theme.cardBackground : theme.background)};
  color: ${({ active, theme }) => (active ? theme.text : theme.textSecondary)};
  border: none;
  border-bottom: 2px solid ${({ active }) => (active ? "#7c3aed" : "transparent")};
  cursor: pointer;
  font-weight: ${({ active }) => (active ? "600" : "400")};
  transition: all 0.2s;
  
  &:hover {
    color: ${({ theme }) => theme.text};
  }
`

export const ErrorMessage = styled.div`
  color: #ef4444;
  padding: 8px 16px;
  font-size: 0.9rem;
  background: rgba(239, 68, 68, 0.1);
`

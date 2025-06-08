import styled from "styled-components"

export const EditorToolbarContainer = styled.div`
  display: flex;
  gap: 4px;
  padding: 8px;
  background: ${({ theme }) => theme.background};
  border-bottom: 1px solid ${({ theme }) => theme.borderColor};
`

export const ToolbarButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: none;
  border: 1px solid transparent;
  border-radius: 4px;
  color: ${({ theme }) => theme.text};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${({ theme }) => theme.secondary || "#1e1e1e"};
  }
`
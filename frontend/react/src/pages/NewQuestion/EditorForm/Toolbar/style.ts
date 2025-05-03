import styled from "styled-components";

export const ToolbarContainer = styled.div`
  display: flex;
  gap: 4px;
  padding: 8px;
  background: ${(props) => props.theme.background};
  border: 1px solid ${(props) => props.theme.borderColor};
  border-bottom: none;
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
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
  color: ${(props) => props.theme.text};
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: ${(props) => props.theme.borderColor};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`
import styled from "styled-components"

export const SubmitButtonContainer = styled.button`
  background: #7c3aed;
  color: white;
  border: none;
  border-radius: 0 0 8px 8px;
  padding: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  width: 100%;
  
  &:hover:not(:disabled) {
    background: #6d28d9;
  }
  
  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
  }
`
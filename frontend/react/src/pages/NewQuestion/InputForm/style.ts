import styled from "styled-components";

export const InputGroupContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

interface InputProps {
  hasError?: boolean
}

export const InputContainer = styled.div<InputProps>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border: 1px solid ${(props) => (props.hasError ? "#ef4444" : props.theme.borderColor)};
  border-radius: 6px;
  background: ${(props) => props.theme.background};
  transition: border-color 0.3s;

  &:focus-within {
    outline: none;
    border-color: ${(props) => (props.hasError ? "#ef4444" : "#7c3aed")};
    box-shadow: 0 0 0 2px ${(props) => (props.hasError ? "rgba(239, 68, 68, 0.2)" : "rgba(124, 58, 237, 0.2)")};
  }

  svg {
    color: #7c3aed;
  }

  input {
    background: transparent;
    border: none;
    color: ${(props) => props.theme.text};
    outline: none;
    width: 100%;
    font-size: 1rem;

    &::placeholder {
      color: ${(props) => props.theme.textSecondary};
      opacity: 0.7;
    }
  }
`

export const ErrorMessage = styled.span`
  color: #ef4444;
  font-size: 0.8rem;
  margin-top: -4px;
`
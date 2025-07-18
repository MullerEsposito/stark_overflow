import styled from "styled-components";

export const InputGroupContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  @media (max-width: 768px) {
    gap: 6px;
  }

  @media (max-width: 480px) {
    gap: 4px;
  }
`

interface InputProps {
  $hasError?: boolean
}

export const InputContainer = styled.div<InputProps>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border: 1px solid ${(props) => (props.$hasError ? "#ef4444" : props.theme.borderColor)};
  border-radius: 6px;
  background: ${(props) => props.theme.background};
  transition: border-color 0.3s;

  &:focus-within {
    outline: none;
    border-color: ${(props) => (props.$hasError ? "#ef4444" : "#7c3aed")};
    box-shadow: 0 0 0 2px ${(props) => (props.$hasError ? "rgba(239, 68, 68, 0.2)" : "rgba(124, 58, 237, 0.2)")};
  }

  svg {
    color: #7c3aed;
    flex-shrink: 0;
  }

  input {
    background: transparent;
    border: none;
    color: ${(props) => props.theme.text};
    outline: none;
    width: 100%;
    font-size: 1rem;
    min-width: 0;

    &::placeholder {
      color: ${(props) => props.theme.textSecondary};
      opacity: 0.7;
    }
  }

  @media (max-width: 768px) {
    padding: 8px 10px;
    gap: 6px;

    input {
      font-size: 0.95rem;
    }

    svg {
      width: 18px;
      height: 18px;
    }
  }

  @media (max-width: 480px) {
    padding: 6px 8px;
    gap: 4px;

    input {
      font-size: 0.9rem;
    }

    svg {
      width: 16px;
      height: 16px;
    }
  }

  @media (max-width: 320px) {
    padding: 4px 6px;
    gap: 3px;

    input {
      font-size: 0.85rem;
    }

    svg {
      width: 14px;
      height: 14px;
    }
  }
`

export const ErrorMessage = styled.span`
  color: #ef4444;
  font-size: 0.8rem;
  margin-top: -4px;

  @media (max-width: 768px) {
    font-size: 0.75rem;
    margin-top: -2px;
  }

  @media (max-width: 480px) {
    font-size: 0.7rem;
    margin-top: -1px;
  }
`
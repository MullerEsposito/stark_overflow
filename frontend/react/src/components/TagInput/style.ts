import styled from "styled-components";

export const TagInputGroupContainer = styled.div`
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

export const TagInputContainer = styled.div<InputProps>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border: 1px solid ${(props) => (props.$hasError ? "#ef4444" : props.theme.borderColor)};
  border-radius: 6px;
  background: ${(props) => props.theme.background};
  transition: border-color 0.3s;
  flex-wrap: wrap;

  &:focus-within {
    outline: none;
    border-color: ${(props) => (props.$hasError ? "#ef4444" : "#7c3aed")};
    box-shadow: 0 0 0 2px ${(props) => (props.$hasError ? "rgba(239, 68, 68, 0.2)" : "rgba(124, 58, 237, 0.2)")};
  }

  svg {
    color: #7c3aed;
    flex-shrink: 0;
  }

  @media (max-width: 768px) {
    padding: 8px 10px;
    gap: 6px;

    svg {
      width: 18px;
      height: 18px;
    }
  }

  @media (max-width: 480px) {
    padding: 6px 8px;
    gap: 4px;

    svg {
      width: 16px;
      height: 16px;
    }
  }

  @media (max-width: 320px) {
    padding: 4px 6px;
    gap: 3px;

    svg {
      width: 14px;
      height: 14px;
    }
  }
`;

export const TagsContainer = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
  flex: 1;
  min-width: 0;
`;

export const TagChip = styled.span`
  display: inline-flex;
  align-items: center;
  background-color: #7c3aed;
  color: white;
  padding: 2px 8px;
  border-radius: 16px;
  font-size: 0.875rem;
  gap: 4px;
  max-width: 150px;
  
  &:hover {
    background-color: #0056b3;
  }
`;

export const RemoveButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  color: ${(props) => props.theme.text};
  cursor: pointer;
  padding: 0;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  
  svg {
    color: ${(props) => props.theme.text};
  }
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }
`;

export const Input = styled.input`
  border: none;
  outline: none;
  flex: 1;
  min-width: 120px;
  padding: 4px;
  font-size: 1rem;
  background: transparent;
  color: ${(props) => props.theme.text};
  
  &::placeholder {
    color: ${(props) => props.theme.textSecondary};
    opacity: 0.7;
  }
  
  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`; 
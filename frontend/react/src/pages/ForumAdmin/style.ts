import styled, { css } from "styled-components";

export const Button = styled.button<{ variant: "cancel" | "create" }>`
  padding: 10px 16px;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  border: none;
  cursor: pointer;
  transition: 0.2s;
  white-space: nowrap;
  
  ${({ variant, theme }) =>
    variant === "create"
      ? css`
          background: #7c3aed;
          color: white;
          
          &:hover:not(:disabled) {
            background: #6d28d9;
          }
          
          &:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }
        `
      : css`
          background: ${theme.borderColor};
          color: ${theme.text};
          
          &:hover {
            background: ${theme.textSecondary};
            color: ${theme.background};
          }
        `}

  @media (max-width: 768px) {
    padding: 12px 16px;
    font-size: 1rem;
    justify-content: center;
    width: 100%;
  }

  @media (max-width: 480px) {
    padding: 10px 14px;
    font-size: 0.9rem;
    gap: 6px;
  }

  @media (max-width: 320px) {
    padding: 8px 12px;
    font-size: 0.85rem;
    gap: 4px;
  }
`

export const AlertMessage = styled.div<{ variant: "success" | "error" }>`
  margin-top: 20px;
  padding: 10px;
  background-color: ${({ variant }) => variant === "success" ? "#d4edda" : "#f8d7da"};
  color: ${({ variant }) => variant === "success" ? "#155724" : "#721c24"};
  border: ${({ variant }) => variant === "success" ? "1px solid #c3e6cb" : "1px solid #f5c6cb"};
  border-radius: 5px;
  width: 100%;
  font-size: 14px;
`
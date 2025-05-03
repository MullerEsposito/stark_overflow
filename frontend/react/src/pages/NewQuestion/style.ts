import styled, { css, keyframes } from "styled-components"

export const Container = styled.div`
  background: ${(props) => props.theme.cardBackground};
  color: ${(props) => props.theme.text};
  padding: 24px;
  border-radius: 8px;
  width: 100%;
  max-width: 800px;
  margin: 24px auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  h2 {
    margin-bottom: 24px;
    font-size: 1.5rem;
  }

  @media (max-width: 850px) {
    width: 90%;
    padding: 16px;
  }
`

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;

  .buttons {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 12px;
  }
`

export const Button = styled.button<{ variant: "cancel" | "publish" }>`
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
  
  ${({ variant, theme }) =>
    variant === "publish"
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
`

const statusAnimation = keyframes`
  0% {
    opacity: 0;
    transform: translateY(-10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`

export const TransactionStatus = styled.div<{ status: "idle" | "processing" | "success" | "error" }>`
  padding: 12px;
  border-radius: 6px;
  margin-top: 16px;
  text-align: center;
  animation: ${statusAnimation} 0.3s ease-out;
  
  ${({ status }) => {
    switch (status) {
      case "processing":
        return css`
          background-color: rgba(59, 130, 246, 0.1);
          color: #3b82f6;
          border: 1px solid rgba(59, 130, 246, 0.2);
        `
      case "success":
        return css`
          background-color: rgba(16, 185, 129, 0.1);
          color: #10b981;
          border: 1px solid rgba(16, 185, 129, 0.2);
        `
      case "error":
        return css`
          background-color: rgba(239, 68, 68, 0.1);
          color: #ef4444;
          border: 1px solid rgba(239, 68, 68, 0.2);
        `
      default:
        return ""
    }
  }}
`

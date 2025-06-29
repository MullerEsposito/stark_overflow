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
    font-weight: 700;
  }

  @media (max-width: 850px) {
    width: 90%;
    padding: 16px;
    margin: 16px auto;
    
    h2 {
      font-size: 1.3rem;
      margin-bottom: 20px;
    }
  }

  @media (max-width: 768px) {
    width: 95%;
    padding: 12px;
    margin: 12px auto;
    
    h2 {
      font-size: 1.2rem;
      margin-bottom: 16px;
    }
  }

  @media (max-width: 480px) {
    width: 98%;
    padding: 8px;
    margin: 8px auto;
    
    h2 {
      font-size: 1.1rem;
      margin-bottom: 12px;
    }
  }

  @media (max-width: 320px) {
    width: 100%;
    padding: 6px;
    margin: 6px auto;
    
    h2 {
      font-size: 1rem;
      margin-bottom: 10px;
    }
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
    flex-wrap: wrap;
  }

  @media (max-width: 768px) {
    gap: 16px;

    .buttons {
      flex-direction: column;
      gap: 8px;
      margin-top: 8px;
    }
  }

  @media (max-width: 480px) {
    gap: 12px;

    .buttons {
      gap: 6px;
      margin-top: 6px;
    }
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
  white-space: nowrap;
  
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
  word-break: break-word;
  
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

  @media (max-width: 768px) {
    padding: 10px;
    margin-top: 12px;
    font-size: 0.9rem;
  }

  @media (max-width: 480px) {
    padding: 8px;
    margin-top: 8px;
    font-size: 0.85rem;
  }
`

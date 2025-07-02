import styled, { css } from "styled-components"

export const QuestionDetailContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  color: ${({ theme }) => theme.text};
  position: relative;
  width: 100%;

  @media (max-width: 768px) {
    padding: 16px;
  }

  @media (max-width: 480px) {
    padding: 12px;
  }

  @media (max-width: 320px) {
    padding: 8px;
  }
`

export const UserAvatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;

  @media (max-width: 768px) {
    width: 36px;
    height: 36px;
  }

  @media (max-width: 480px) {
    width: 32px;
    height: 32px;
  }

  @media (max-width: 320px) {
    width: 28px;
    height: 28px;
  }
`

export const StatusMessage = styled.div<{ type: "success" | "error" | "info" | null }>`
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 12px 16px;
  border-radius: 8px;
  font-weight: 500;
  z-index: 1000;
  animation: fadeIn 0.3s ease-out;
  max-width: 300px;
  word-break: break-word;
  
  ${({ type }) => {
    switch (type) {
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
      case "info":
        return css`
          background-color: rgba(59, 130, 246, 0.1);
          color: #3b82f6;
          border: 1px solid rgba(59, 130, 246, 0.2);
        `
      default:
        return ""
    }
  }}

  @media (max-width: 768px) {
    bottom: 16px;
    right: 16px;
    left: 16px;
    max-width: none;
    padding: 10px 14px;
    font-size: 0.9rem;
  }

  @media (max-width: 480px) {
    bottom: 12px;
    right: 12px;
    left: 12px;
    padding: 8px 12px;
    font-size: 0.85rem;
  }

  @media (max-width: 320px) {
    bottom: 8px;
    right: 8px;
    left: 8px;
    padding: 6px 10px;
    font-size: 0.8rem;
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`

import styled, { css } from "styled-components"

export const QuestionDetailContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  color: ${({ theme }) => theme.text};
  position: relative;
`

export const UserAvatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
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

import styled, { keyframes } from "styled-components"

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`

export const ModalContent = styled.div`
  background: ${({ theme }) => theme.cardBackground};
  border-radius: 8px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  animation: modalFadeIn 0.3s ease-out;
  
  @keyframes modalFadeIn {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid ${({ theme }) => theme.borderColor};
`

export const ModalTitle = styled.h3`
  margin: 0;
  font-size: 1.2rem;
  color: ${({ theme }) => theme.text};
`

export const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.textSecondary};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border-radius: 4px;
  
  &:hover {
    background: ${({ theme }) => theme.secondary || "#1e1e1e"};
    color: ${({ theme }) => theme.text};
  }
`

export const ModalBody = styled.div`
  padding: 20px;
  
  p {
    margin-bottom: 16px;
    color: ${({ theme }) => theme.text};
  }
`

export const CurrentStakeInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 12px;
  background: ${({ theme }) => theme.background};
  border-radius: 6px;
  
  span {
    font-weight: 500;
    color: ${({ theme }) => theme.text};
  }
  
  div {
    display: flex;
    align-items: center;
    gap: 4px;
    font-weight: 700;
    color: #25c028;
  }
`

export const InputContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  border: 1px solid ${({ theme }) => theme.borderColor};
  border-radius: 6px;
  margin-bottom: 16px;
  
  &:focus-within {
    border-color: #7c3aed;
    box-shadow: 0 0 0 2px rgba(124, 58, 237, 0.2);
  }
`

export const StakeInput = styled.input`
  background: none;
  border: none;
  color: ${({ theme }) => theme.text};
  font-size: 1.2rem;
  width: 100%;
  outline: none;
  
  &::placeholder {
    color: ${({ theme }) => theme.textSecondary};
    opacity: 0.7;
  }
`

export const StakeButton = styled.button`
  background: #7c3aed;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  width: 100%;
  margin-top: 8px;
  
  &:hover:not(:disabled) {
    background: #6d28d9;
  }
  
  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
  }
`

export const ErrorMessage = styled.div`
  color: #ef4444;
  padding: 8px 12px;
  font-size: 0.9rem;
  background: rgba(239, 68, 68, 0.1);
  border-radius: 4px;
  margin-bottom: 16px;
`

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`

export const LoadingSpinner = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 40px;
  height: 40px;
  border: 4px solid rgba(124, 58, 237, 0.1);
  border-radius: 50%;
  border-top: 4px solid #7c3aed;
  animation: ${spin} 1s linear infinite;
  z-index: 1000;
`
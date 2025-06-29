import styled from 'styled-components';

export const FlowCardContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  width: 100%;
  color: white;
  
  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
  }
  
  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }
  
  @media (min-width: 1200px) {
    grid-template-columns: repeat(5, 1fr);
    gap: 16px;
  }
`;

export const StepContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  cursor: pointer;
  background-color: ${({ theme }) => theme.card};
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
  }
`;

export const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 1.5rem 1.5rem 0 1.5rem;
  font-size: 1.5rem;
  z-index: 2;
  clip-path: polygon(0% 0%, 80% -50%, 100% 50%, 90% 100%, 0% 100%, 10% 50%);
  background: ${({ theme }) => theme.primary};
  height: 50px;
  width: 50px;
  
  @media (min-width: 640px) {
    font-size: 1.75rem;
    height: 60px;
    width: 60px;
  }
  
  @media (min-width: 1024px) {
    font-size: 2rem;
    height: 70px;
    width: 70px;
  }
`;

export const StepContent = styled.div`
  position: relative;
  padding: 1rem 1.5rem 1.5rem 1.5rem;
  z-index: 2;
  flex: 1;

  &::after {
    position: absolute;
    top: 0;
    left: 0;
    content: '';
    width: 90%;
    height: 100%;
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: 0;
    background-color: ${({ theme }) => theme.buttonHover};
  }

  &:hover {
    &::after {
      opacity: 0.3;
    }
  }
`;

export const StepTitle = styled.h3`
  color: ${({ theme }) => theme.text};
  font-size: 1.1rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  z-index: 2;
  
  @media (min-width: 640px) {
    font-size: 1.25rem;
  }
`;

export const StepDescription = styled.p`
  color: ${({ theme }) => theme.textSecondary};
  font-size: 0.85rem;
  opacity: 0.8;
  z-index: 2;
  line-height: 1.4;
  
  @media (min-width: 640px) {
    font-size: 0.9rem;
  }
`;
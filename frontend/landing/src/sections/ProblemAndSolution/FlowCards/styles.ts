import styled from 'styled-components';

export const FlowCardContainer = styled.div`
  display: flex;
  width: 100%;
  overflow: hidden;
  color: white;

  @media (max-width: 768px) {
    overflow-x: scroll;
  }
`;

export const StepContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  position: relative;
  cursor: pointer;
`;

export const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0 1.5rem;
  font-size: 2rem;
  z-index: 2;
  clip-path: polygon(0% 0%, 80% -50%, 100% 50%, 90% 100%, 0% 100%, 10% 50%);
  background: ${({ theme }) => theme.primary};
  height: 70px;
`;

export const StepContent = styled.div`
  position: relative;
  padding: 1.5rem 1rem 1.5rem 1rem;
  z-index: 2;

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
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  z-index: 2;
`;

export const StepDescription = styled.p`
color: ${({ theme }) => theme.textSecondary};
  font-size: 0.9rem;
  opacity: 0.8;
  z-index: 2;
`;
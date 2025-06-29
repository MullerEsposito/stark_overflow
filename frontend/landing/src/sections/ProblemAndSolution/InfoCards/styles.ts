import styled from "styled-components";

export const InfoCardsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 32px;
  max-width: 1200px;
  margin: 0 auto;
  gap: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
    gap: 30px;
  }
  
  @media (max-width: 480px) {
    gap: 24px;
    margin-top: 24px;
  }
`;

export const InfoCard = styled.div`
  display: flex;
  height: auto;
  min-height: 120px;
  flex-direction: column;
  flex: 1;
  padding: 20px;
  gap: 12px;
  background-color: ${({ theme }) => theme.card};
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  @media (min-width: 480px) {
    padding: 24px;
    gap: 16px;
    min-height: 140px;
  }

  h1 {
    background: linear-gradient(to right, #957bc7, #ff6527);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-size: 1.5rem;
    font-weight: 700;
    
    @media (min-width: 480px) {
      font-size: 1.75rem;
    }
    
    @media (min-width: 768px) {
      font-size: 2rem;
    }
  }

  p {
    font-size: 1rem;
    line-height: 1.6;
    color: ${({ theme }) => theme.textSecondary};
    
    @media (min-width: 480px) {
      font-size: 1.125rem;
      line-height: 1.8rem;
    }
  }
`;
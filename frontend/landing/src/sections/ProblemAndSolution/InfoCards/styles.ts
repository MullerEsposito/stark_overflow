import styled from "styled-components";

export const InfoCardsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 32px;
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
    gap: 30px;
  }
`;

export const InfoCard = styled.div`
  display: flex;
  height: 140px;
  flex-direction: column;
  flex: 1;
  padding-right: 16px;
  gap: 16px;

  h1 {
    background: linear-gradient(to right, #957bc7, #ff6527);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  p {
    font-size: 1.125rem;
    line-height: 1.8rem;
  }
`;
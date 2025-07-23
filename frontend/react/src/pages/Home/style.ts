import styled from "styled-components";

export const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  max-width: 900px;
  margin: auto;
  width: 100%;

  h1 {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
    text-align: center;
  }

  @media (max-width: 768px) {
    padding: 16px;
    
    h1 {
      font-size: 1.75rem;
      margin-bottom: 1.25rem;
    }
  }

  @media (max-width: 480px) {
    padding: 12px;
    
    h1 {
      font-size: 1.5rem;
      margin-bottom: 1rem;
    }
  }

  @media (max-width: 320px) {
    padding: 8px;
    
    h1 {
      font-size: 1.25rem;
      margin-bottom: 0.75rem;
    }
  }
`;
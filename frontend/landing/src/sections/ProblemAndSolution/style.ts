import styled from "styled-components";

export const TheProblemContainer = styled.section`
  min-width: 100vw;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  margin: 20px 0;
  
  @media (min-width: 480px) {
    padding: 24px;
  }
  
  @media (min-width: 768px) {
    padding: 32px;
  }
`;

export const Title = styled.h2`
  font-size: 1.75rem;
  margin: 4rem 0 3rem;
  text-align: center;
  font-weight: 600;
  line-height: 1.2;

  @media (min-width: 480px) {
    font-size: 2rem;
    margin: 5rem 0 4rem;
  }
  
  @media (min-width: 768px) {
    font-size: 2.5rem;
    margin: 8rem 0 5rem;
  }

  span {
    color: #4ADE80; /* Verde */
  }
`;

export const Section = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;
  width: 100%;
  padding: 0 16px;
  
  @media (min-width: 480px) {
    padding: 0 20px;
  }
  
  @media (min-width: 768px) {
    padding: 0 24px;
  }
`;
import styled from "styled-components";

export const TheProblemContainer = styled.section`
  min-width: 100vw;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  margin: 20px 0;
  
`;

export const Title = styled.h2`
  font-size: 2.5rem;
  margin: 8rem 0 5rem;
  text-align: center;
  font-weight: 600;

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
`;
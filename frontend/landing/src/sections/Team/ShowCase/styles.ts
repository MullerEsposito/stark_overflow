import styled from 'styled-components';

export const ShowcaseContainer = styled.section`
  background-color: ${({ theme }) => theme.background};
  padding: 3rem 1rem;
  width: 100%;
  
  @media (min-width: 480px) {
    padding: 3.5rem 1.5rem;
  }
  
  @media (min-width: 768px) {
    padding: 4rem 2rem;
  }
`;

export const ShowcaseTitle = styled.h2`
  font-size: 1.5rem;
  color: ${({ theme }) => theme.text};
  margin-bottom: 0.5rem;
  text-align: center;
  line-height: 1.2;

  @media (min-width: 480px) {
    font-size: 1.75rem;
  }
  
  @media (min-width: 768px) {
    font-size: 2rem;
  }

  span {
    color: #40c057;
  }
`;

export const ShowcaseSubtitle = styled.p`
  color: #e6e6e6;
  font-size: 0.9rem;
  margin-bottom: 2rem;
  text-align: center;
  
  @media (min-width: 480px) {
    font-size: 1rem;
    margin-bottom: 2.5rem;
  }
  
  @media (min-width: 768px) {
    margin-bottom: 3rem;
  }
`;

export const MembersGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;

  @media (min-width: 480px) {
    gap: 2rem;
  }
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 2.5rem;
  }
  
  @media (min-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
  }
`;

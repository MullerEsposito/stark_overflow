import styled from 'styled-components';

export const ShowcaseContainer = styled.section`
  background-color: ${({ theme }) => theme.background};
  padding: 4rem 2rem;
  width: 100%;
`;

export const ShowcaseTitle = styled.h2`
  font-size: 2rem;
  color: ${({ theme }) => theme.text};
  margin-bottom: 0.5rem;

  span {
    color: #40c057;
  }
`;

export const ShowcaseSubtitle = styled.p`
  color: #e6e6e6;
  font-size: 1rem;
  margin-bottom: 3rem;
`;

export const MembersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 2rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

import styled from "styled-components";

export const CardsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
  width: 100%;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
`;

export const Card = styled.div`
  display: flex;
  align-items: center;
  background-color: ${(props) => props.theme.cardBackground};
  padding: 2.5rem 2rem;
  border-radius: 16px;
  border: 1.5px solid ${(props) => props.theme.borderColor};
  box-shadow: ${(props) => props.theme.shadow.sm};
  transition: box-shadow 0.2s, border-color 0.2s, background 0.2s, transform 0.2s cubic-bezier(0.22, 1, 0.36, 1);

  &:hover {
    box-shadow: ${(props) => props.theme.shadow.md};
    border-color: ${(props) => props.theme.primaryLight};
    background: ${(props) => props.theme.cardBackgroundSecondary};
    transform: translateY(-8px) scale(1.03);
  }
  &:active {
    transform: translateY(2px) scale(0.98);
  }

  img {
    width: 72px;
    height: 68px;
    border-radius: 12px;
    box-shadow: ${(props) => props.theme.shadow.sm};
  }

  section {
    display: flex;
    flex-direction: column;
    margin-left: 1.5rem;

    small {
      font-size: 0.75rem;
      color: ${(props) => props.theme.textTertiary};
      letter-spacing: 0.05em;
      font-weight: 500;
    }
    strong {
      font-size: 1.15rem;
      font-weight: 700;
      color: ${(props) => props.theme.text};
      margin-bottom: 0.25rem;
    }
    div {
      display: flex;
      margin-top: 0.625rem;
      gap: 1rem;
      span {
        display: flex;
        gap: 0.25rem;
        font-size: 0.85rem;
        align-items: center;
        color: ${(props) => props.theme.textSecondary};
      }
    }
  }
`;
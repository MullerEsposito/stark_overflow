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
  padding: 2rem 1.25rem;
  border-radius: 8px;
  border: 1px solid ${(props) => props.theme.borderColor};
  transition: transform 0.2s, box-shadow 0.2s;
  min-height: 120px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  img {
    width: 72px;
    height: 68px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  section {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-width: 0;

    small {
      font-size: 0.625rem;
      color: #8d8d99;
      margin-bottom: 0.25rem;
    }
    
    strong {
      font-size: 1rem;
      font-weight: bolder;
      color: ${(props) => props.theme.text};
      margin-bottom: 0.5rem;
      word-break: break-word;
    }

    div {
      display: flex;
      margin-top: 0.625rem;
      gap: 1rem;
      flex-wrap: wrap;

      span {
        display: flex;
        gap: 0.25rem;
        font-size: 0.75rem;
        align-items: center;
        white-space: nowrap;
      }
    }
  }

  @media (max-width: 768px) {
    padding: 1.5rem 1rem;
    min-height: 100px;

    img {
      width: 60px;
      height: 56px;
    }

    section {
      strong {
        font-size: 0.9rem;
      }

      div span {
        font-size: 0.7rem;
      }
    }
  }

  @media (max-width: 480px) {
    padding: 1.25rem 0.75rem;
    min-height: 90px;

    img {
      width: 48px;
      height: 44px;
    }

    section {
      strong {
        font-size: 0.85rem;
      }

      div {
        gap: 0.75rem;
        
        span {
          font-size: 0.65rem;
        }
      }
    }
  }

  @media (max-width: 320px) {
    padding: 1rem 0.5rem;
    min-height: 80px;

    img {
      width: 40px;
      height: 36px;
    }

    section {
      strong {
        font-size: 0.8rem;
      }

      div {
        gap: 0.5rem;
        
        span {
          font-size: 0.6rem;
        }
      }
    }
  }
`;
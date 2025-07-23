import styled from "styled-components";

export const SearchInputContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.forum.topicCard.background};
  padding: 0.5rem 1rem;
  border-radius: 12px;
  border: 2px solid ${({ theme }) => theme.primaryLight};
  box-shadow: 0 2px 8px rgba(60,72,88,0.07);
  width: 100%;
  max-width: 480px;
  transition: border 0.3s, box-shadow 0.3s;

  &:hover, &:focus-within {
    border: 2px solid ${({ theme }) => theme.primary};
    box-shadow: 0 4px 16px rgba(124, 58, 237, 0.08);
  }

  @media (max-width: 768px) {
    padding: 0.75rem 0.75rem;
    margin-bottom: 0.75rem;
    max-width: 100%;
  }

  @media (max-width: 480px) {
    padding: 0.5rem 0.5rem;
    margin-bottom: 0.5rem;
    max-width: 100%;
  }
`;

export const Input = styled.input`
  background: none;
  border: none;
  padding: 10px;
  border-radius: 8px;
  color: ${({ theme }) => theme.text};
  width: 100%;
  outline: none;
  line-height: 19px;
  font-size: 1rem;
  min-width: 0;

  &::placeholder {
    color: ${({ theme }) => theme.textSecondary || "#8d8d99"};
    opacity: 0.7;
  }

  @media (max-width: 768px) {
    padding: 8px;
    font-size: 0.95rem;
    line-height: 18px;
  }

  @media (max-width: 480px) {
    padding: 6px;
    font-size: 0.9rem;
    line-height: 17px;
  }

  @media (max-width: 320px) {
    padding: 4px;
    font-size: 0.85rem;
    line-height: 16px;
  }
`;
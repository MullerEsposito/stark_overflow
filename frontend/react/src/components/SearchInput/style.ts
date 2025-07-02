import styled from "styled-components";

export const SearchInputContainer = styled.div`
  display: flex;
  align-items: center;
  background-color: ${({ theme }) => theme.forum.topicCard.background};
  margin-bottom: 1rem;
  padding: 0.5rem;
  border-radius: 8px;
  border: 2px solid transparent;
  transition: border 0.3s;
  width: 100%;

  &:hover {
    border: 2px solid #7c3aed;
  }

  &:focus-within {
    border: 2px solid #7c3aed;
    box-shadow: 0 0 0 2px rgba(124, 58, 237, 0.2);
  }

  @media (max-width: 768px) {
    padding: 0.75rem;
    margin-bottom: 0.75rem;
  }

  @media (max-width: 480px) {
    padding: 0.5rem;
    margin-bottom: 0.5rem;
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
import styled from "styled-components";

export const SocialLinksContainer = styled.div`
  display: flex;
  gap: 0.75rem;
  justify-content: center;
  flex-wrap: wrap;
  
  @media (min-width: 480px) {
    gap: 1rem;
  }
`;

export const SocialLink = styled.a`
  color: ${({ theme }) => theme.textSecondary};
  font-size: 1.1rem;
  transition: color 0.2s ease-in-out;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  
  @media (min-width: 480px) {
    font-size: 1.25rem;
    width: 36px;
    height: 36px;
  }

  &:hover {
    color: #40c057;
    background-color: rgba(64, 192, 87, 0.1);
  }
`;
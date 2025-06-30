import styled from "styled-components";

export const SocialLinksContainer = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
`;

export const SocialLink = styled.a`
  color: ${({ theme }) => theme.textSecondary};
  font-size: 1.25rem;
  transition: color 0.2s ease-in-out;

  &:hover {
    color: #40c057;
  }
`;
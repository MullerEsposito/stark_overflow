import styled from 'styled-components';

export const MemberCardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: ${({ theme }) => theme.background};
  padding: 2rem;
  border-radius: 0.5rem;
  text-align: center;
`;

export const MemberImage = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 1rem;
`;

export const MemberName = styled.h3`
  color: ${({ theme }) => theme.text};
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
`;

export const MemberRole = styled.p`
  color: #40c057;
  font-size: 1rem;
  margin-bottom: 1rem;
`;

export const MemberDescription = styled.p`
  color: ${({ theme }) => theme.textSecondary};
  font-size: 0.9rem;
  line-height: 1.5;
  margin-bottom: 1.5rem;
`;


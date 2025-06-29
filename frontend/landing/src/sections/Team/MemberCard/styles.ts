import styled from 'styled-components';

export const MemberCardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: ${({ theme }) => theme.card};
  padding: 1.5rem;
  border-radius: 0.5rem;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
  }
  
  @media (min-width: 480px) {
    padding: 2rem;
  }
`;

export const MemberImage = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 1rem;
  
  @media (min-width: 480px) {
    width: 100px;
    height: 100px;
    margin-bottom: 1.25rem;
  }
  
  @media (min-width: 768px) {
    width: 120px;
    height: 120px;
    margin-bottom: 1rem;
  }
`;

export const MemberName = styled.h3`
  color: ${({ theme }) => theme.text};
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
  font-weight: 600;
  
  @media (min-width: 480px) {
    font-size: 1.5rem;
  }
`;

export const MemberRole = styled.p`
  color: #40c057;
  font-size: 0.9rem;
  margin-bottom: 1rem;
  font-weight: 500;
  
  @media (min-width: 480px) {
    font-size: 1rem;
    margin-bottom: 1.25rem;
  }
`;

export const MemberDescription = styled.p`
  color: ${({ theme }) => theme.textSecondary};
  font-size: 0.85rem;
  line-height: 1.5;
  margin-bottom: 1.5rem;
  
  @media (min-width: 480px) {
    font-size: 0.9rem;
  }
`;



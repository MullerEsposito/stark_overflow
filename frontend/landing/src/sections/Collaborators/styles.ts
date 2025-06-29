import styled from "styled-components"

export const CollaboratorsContainer = styled.div`
  margin-top: 60px;
  margin-bottom: 40px;
  text-align: center;
  padding: 0 16px;
  
  @media (min-width: 480px) {
    margin-top: 80px;
    margin-bottom: 60px;
    padding: 0 20px;
  }
  
  @media (min-width: 768px) {
    padding: 0 24px;
  }

  h2 {
    color: ${({ theme }) => theme.primary};
    margin-bottom: 30px;
    font-size: 1.5rem;
    
    @media (min-width: 480px) {
      font-size: 1.75rem;
      margin-bottom: 40px;
    }
    
    @media (min-width: 768px) {
      font-size: 2rem;
    }
  }
`

export const CollaboratorsItens = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  justify-content: center;
  max-width: 800px;
  margin: 0 auto;
  
  @media (min-width: 480px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }
  
  @media (min-width: 640px) {
    grid-template-columns: repeat(4, 1fr);
    gap: 24px;
  }
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(5, 1fr);
  }
  
  @media (min-width: 1024px) {
    grid-template-columns: repeat(6, 1fr);
  }
`

export const CollaboratorItem = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  transition: transform 0.3s;
  padding: 12px;

  &:hover {
    transform: scale(1.1);

    & > div {
      bottom: -30px;
      opacity: 1;
    }
  }
  
  span {
    font-size: 12px;
    color: ${({ theme }) => theme.textSecondary};
    text-align: center;
    line-height: 1.3;
    
    @media (min-width: 480px) {
      font-size: 14px;
    }
  }

  & > div {
    position: absolute;
    opacity: 0;
    bottom: 50%;
    z-index: 0;
    transition: all 0.3s;
  }
`

export const CollaboratorImage = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  z-index: 10;
  
  @media (min-width: 480px) {
    width: 56px;
    height: 56px;
  }
  
  @media (min-width: 640px) {
    width: 64px;
    height: 64px;
  }
`


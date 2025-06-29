import styled from "styled-components"

export const HeroContainer = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
  text-align: center;
  position: relative;
  z-index: 0;
  
  @media (min-width: 768px) {
    padding: 80px 0;
  }
`

export const HeroContent = styled.div`
  max-width: 800px;
  width: 100%;
`

export const Title = styled.h1`
  font-size: 32px;
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 20px;
  
  @media (min-width: 480px) {
    font-size: 40px;
  }
  
  @media (min-width: 768px) {
    font-size: 48px;
    margin-bottom: 24px;
  }
  
  @media (min-width: 1024px) {
    font-size: 64px;
  }
  
  span {
    background: linear-gradient(to right, #ff66c4, #cb6ce6);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  
  .highlight {
    background: linear-gradient(to right, #3b82f6, #2dd4bf);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`

export const Subtitle = styled.p`
  font-size: 16px;
  color: ${({ theme }) => theme.textSecondary};
  margin-bottom: 24px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
  
  @media (min-width: 480px) {
    font-size: 18px;
    margin-bottom: 28px;
  }
  
  @media (min-width: 768px) {
    font-size: 20px;
    margin-bottom: 32px;
  }
`

export const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  
  @media (min-width: 480px) {
    gap: 16px;
  }
  
  @media (min-width: 640px) {
    flex-direction: row;
    justify-content: center;
  }
`

export const PrimaryButton = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 20px;
  background-color: ${({ theme }) => theme.buttonBackground};
  color: ${({ theme }) => theme.buttonText};
  border-radius: 6px;
  font-weight: 500;
  transition: background-color 0.2s;
  width: 100%;
  max-width: 280px;
  
  &:hover {
    background-color: ${({ theme }) => theme.buttonHover};
  }
  
  @media (min-width: 640px) {
    width: auto;
    max-width: none;
  }
`

export const SecondaryButton = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 20px;
  background-color: ${({ theme }) => theme.secondary};
  color: ${({ theme }) => theme.text};
  border-radius: 6px;
  font-weight: 500;
  transition: background-color 0.2s;
  width: 100%;
  max-width: 280px;
  
  &:hover {
    background-color: ${({ theme }) => theme.border};
  }
  
  @media (min-width: 640px) {
    width: auto;
    max-width: none;
  }
`

export const CardsContainer = styled.section`
  display: flex;
  justify-content: space-between;
  background-color: ${({ theme }) => theme.background};
  padding: 60px 0;
  gap: 20px;
  width: 100%;

  @media (max-width: 900px) {
    flex-direction: column;
    gap: 24px;
    padding: 40px 0;
  }
  
  @media (min-width: 901px) {
    padding: 80px 0;
    gap: 10px;
  }
`

export const Card = styled.div`
  background-color: ${({ theme }) => theme.card};
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-top: 24px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  width: 100%;

  @media (min-width: 480px) {
    padding: 24px;
    margin-top: 28px;
  }
  
  @media (min-width: 768px) {
    margin-top: 32px;
  }

  &:hover {
    transform: translateY(-4px);
    transition: transform 0.3s;
    background-color: ${({ theme }) => theme.secondary};
  }
  
  h3 {
    font-size: 18px;
    margin-bottom: 12px;
    
    @media (min-width: 480px) {
      font-size: 20px;
      margin-bottom: 16px;
    }
  }
  
  p {
    font-size: 14px;
    line-height: 1.5;
    
    @media (min-width: 480px) {
      font-size: 16px;
    }
  }
`
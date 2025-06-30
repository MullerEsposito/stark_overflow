import styled from "styled-components"

export const HeroContainer = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 0;
  text-align: center;
  position: relative;
  z-index: 0;
`

export const HeroContent = styled.div`
  max-width: 800px;
`

export const Title = styled.h1`
  font-size: 48px;
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 24px;
  
  @media (min-width: 768px) {
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
  font-size: 18px;
  color: ${({ theme }) => theme.textSecondary};
  margin-bottom: 32px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  
  @media (min-width: 768px) {
    font-size: 20px;
  }
`

export const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  
  @media (min-width: 480px) {
    flex-direction: row;
    justify-content: center;
  }
`

export const PrimaryButton = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 24px;
  background-color: ${({ theme }) => theme.buttonBackground};
  color: ${({ theme }) => theme.buttonText};
  border-radius: 6px;
  font-weight: 500;
  transition: background-color 0.2s;
  width: 100%;
  
  &:hover {
    background-color: ${({ theme }) => theme.buttonHover};
  }
  
  @media (min-width: 480px) {
    width: auto;
  }
`

export const SecondaryButton = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 24px;
  background-color: ${({ theme }) => theme.secondary};
  color: ${({ theme }) => theme.text};
  border-radius: 6px;
  font-weight: 500;
  transition: background-color 0.2s;
  width: 100%;
  
  &:hover {
    background-color: ${({ theme }) => theme.border};
  }
  
  @media (min-width: 480px) {
    width: auto;
  }
`

export const CardsContainer = styled.section`
  display: flex;
  justify-content: space-between;
  background-color: ${({ theme }) => theme.background};
  padding: 80px 0;
  gap: 10px;

  // Mobile Menu
  @media (max-width: 900px) {
    flex-direction: column;
    gap: 32px;
  }
`

export const Card = styled.div`
  background-color: ${({ theme }) => theme.card};
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 24px;
  margin-top: 32px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  width: 100%;

  &:hover {
    transform: translateY(-4px);
    transition: transform 0.3s;
    background-color: ${({ theme }) => theme.secondary};
  }
`
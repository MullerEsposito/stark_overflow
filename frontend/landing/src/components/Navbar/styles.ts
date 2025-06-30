import styled, { css } from "styled-components"

export const NavbarContainer = styled.header<{$isScrolled: boolean}>`
  height: ${({ $isScrolled }) => $isScrolled ? '64px' : '200px'};
  min-height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  background-color: ${({ theme }) => theme.navBackground};
  backdrop-filter: blur(10px);
  border-bottom: 1px solid ${({ theme }) => theme.border};
  position: sticky;
  top: 0;
  z-index: 100;
  transition: all 0.3s ease-in-out;

  & > a { 
    img {
      ${({ $isScrolled }) => !$isScrolled && css`
        animation: spin 4s linear infinite;
        animation-delay: 0.5s;`}

      &:hover {
        animation-play-state: paused;
      }
    }

    span {
      position: absolute;
      left: 80px;
      z-index: 0;
      transition: all 1s;
      white-space: nowrap;
      ${({ $isScrolled }) => !$isScrolled && css`
        left: 100;
        font-size: 0;
      `}
    }
  }

  & > nav > a {
    transition: font-size 0.3s ease-in-out;
    ${({ $isScrolled }) => $isScrolled && css`font-size: 1rem`};
  }

  @keyframes spin {
    0% {
        transform: rotateY(0deg);
    }
    80% {
        transform: rotateY(360deg);
    }
    100% {
        transform: rotateY(360deg);
    }
  }
`

export const Logo = styled.a`
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  font-size: 16px;
  height: 100%;

  img {
    z-index: 1;        
  }
`

export const NavLinks = styled.nav<{$isOpen: boolean}>`
  display: flex;
  align-items: center;
  gap: 24px;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1;
  
  @media (min-width: 768px) {
    display: flex;
  }
  // Mobile Menu
  @media (max-width: 768px) {
    flex-direction: column;
    position: fixed;
    right: 0;
    top: 0;
    width: 100%;
    height: ${({ $isOpen }) => $isOpen ? '100vh' : '0'};
    padding-top: ${({ $isOpen }) => $isOpen ? '80px' : '0'};
    background-color: ${({ theme }) => theme.navBackground};
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    gap: 16px;
    transition: all 0.3s ease-in-out;
    overflow: hidden;

    ${({ $isOpen }) => $isOpen ? css`
      opacity: 1;
      visibility: visible;
    ` : css`
      opacity: 0;
      visibility: hidden;
    `};

    & > a {
      display: ${({ $isOpen }) => $isOpen ? 'block' : 'none'};
      font-size: 24px;
      margin: 10px 0;
      text-align: center;
    }
  }
`

export const NavLink = styled.a`
  font-size: 1.5rem;
  font-weight: 500;
  transition: opacity 0.2s;
  
  &:hover {
    opacity: 0.8;
  }
`

export const MobileMenuButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  
  position: fixed;
  top: 16px;
  right: 24px;
  width: 40px;
  height: 40px;
  z-index: 10;
  
  border: none;
  border-radius: 50%;
  cursor: pointer;
  
  color: white;
  background: black;

  &:hover {
    background-color: ${({ theme }) => theme.secondary};
  }
  
  @media (min-width: 768px) {
    display: none;
  }
`

export const ButtonsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`

export const ThemeToggle = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: transparent;
  color: ${({ theme }) => theme.text};
  transition: background-color 0.2s;
  
  &:hover {
    background-color: ${({ theme }) => theme.secondary};
  }
`

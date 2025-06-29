import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
   * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    scroll-behavior: smooth;
    overflow-x: hidden;
  }

  body {
    font-family: 'Inter', sans-serif;
    background-color: ${({ theme }) => theme.background};
    color: ${({ theme }) => theme.text};
    transition: all 0.2s ease-in-out;
    overflow-x: hidden;
    min-width: 320px;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: 'Petrona', serif;
    font-weight: 700;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  button {
    cursor: pointer;
    border: none;
    outline: none;
  }

  img {
    max-width: 100%;
    height: auto;
  }

  .cards-container {
    display: grid;
    grid-template-columns: 1fr;
    gap: 24px;
    margin-top: 60px;
    
    @media (min-width: 1024px) {
      grid-template-columns: 1fr 320px;
    }
  }

  .testimonials-features {
    display: grid;
    gap: 24px;
  }

  /* Responsive breakpoints */
  @media (max-width: 480px) {
    html {
      font-size: 14px;
    }
  }

  @media (min-width: 481px) and (max-width: 768px) {
    html {
      font-size: 15px;
    }
  }

  @media (min-width: 769px) {
    html {
      font-size: 16px;
    }
  }
`

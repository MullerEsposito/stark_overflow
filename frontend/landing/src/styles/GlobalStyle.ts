import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
   * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    font-family: 'Inter', sans-serif;
    background-color: ${({ theme }) => theme.background};
    color: ${({ theme }) => theme.text};
    transition: all 0.2s ease-in-out;
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
`

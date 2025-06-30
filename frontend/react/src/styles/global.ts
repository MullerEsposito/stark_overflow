import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    transition: all 0.3s ease-in-out;
  }

  html {
    font-size: 16px;
    -webkit-text-size-adjust: 100%;
    -ms-text-size-adjust: 100%;
  }

  body {
    background-color: ${(props) => props.theme.background};
    color: ${(props) => props.theme.text};
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
    margin: 0;
    padding: 0;
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow-x: hidden;
    min-width: 320px;
  }

  button {
    border: none;
    cursor: pointer;
    font-family: inherit;
  }

  a {
    all: unset;
    text-decoration: none;
    color: inherit;
    cursor: pointer;
  }

  input, textarea, select {
    font-family: inherit;
    font-size: inherit;
  }

  img {
    max-width: 100%;
    height: auto;
  }

  /* Responsive breakpoints */
  @media (max-width: 480px) {
    html {
      font-size: 14px;
    }
  }

  @media (min-width: 1200px) {
    html {
      font-size: 18px;
    }
  }

  /* Prevent horizontal scroll on mobile */
  @media (max-width: 768px) {
    body {
      overflow-x: hidden;
      width: 100%;
    }
  }
`;
import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    transition: background-color, color, transform 0.3s ease-in-out;
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

  :focus {
    outline: 0;
  }

  body, input, textarea, button {
    font-family: 'Inter', sans-serif;
    font-weight: 400;
    font-size: 1rem;
  }

  h1, h2, h3, h4, h5, h6, strong {
    font-weight: 600;
  }

  [disabled] {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .react-switch-checkbox {
    height: 0;
    width: 0;
    visibility: hidden;
  }

  .react-switch-label {
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    width: 100px;
    height: 50px;
    background: grey;
    border-radius: 100px;
    position: relative;
    transition: background-color .2s;
  }

  .react-switch-label .react-switch-button {
    content: '';
    position: absolute;
    top: 2px;
    left: 2px;
    width: 45px;
    height: 45px;
    border-radius: 45px;
    transition: 0.2s;
    background: #fff;
    box-shadow: 0 0 2px 0 rgba(10, 10, 10, 0.29);
  }

  .react-switch-checkbox:checked + .react-switch-label .react-switch-button {
    left: calc(100% - 2px);
    transform: translateX(-100%);
  }

  .react-switch-label:active .react-switch-button {
    width: 60px;
  }

  /* Loading spinner animation */
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
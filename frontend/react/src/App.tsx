import { ThemeProvider } from "styled-components"
import { GlobalStyle } from "./styles/global"
import { BrowserRouter } from "react-router-dom"
import { Router } from "./router"
import { Header } from "./components/Header"
import { darkTheme, lightTheme } from "./styles/themes"
import { WalletDetector } from "./components/wallet-detector"
import { useState, useEffect } from "react"
import { StatusMessageProvider } from "@hooks/useStatusMessage/statusMessage.provider"
import { WalletProvider } from "@hooks/useWallet/wallet.provider"

function App() {
  const [theme, setTheme] = useState(darkTheme);  
  
  // Try to load preferred theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light") {
      setTheme(lightTheme);
    } else {
      setTheme(darkTheme);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === lightTheme ? darkTheme : lightTheme;
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme === lightTheme ? "light" : "dark");
  }

  return (
    <ThemeProvider theme={theme}>
    <StatusMessageProvider>
      <WalletProvider>
        <BrowserRouter>
          <Header toggleTheme={toggleTheme}/>
          <Router />
          <WalletDetector />
        </BrowserRouter>
        <GlobalStyle />
      </WalletProvider>
    </StatusMessageProvider>
  </ThemeProvider>
  )
}

export default App
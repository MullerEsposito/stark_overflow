import { List, Moon, Sun } from "@phosphor-icons/react"
import { NavbarContainer, Logo, NavLinks, NavLink, ButtonsContainer, ThemeToggle, MobileMenuButton } from "./styles"

import logoStarkOverflow from "@assets/starkoverflow.svg"
import { useEffect, useState } from "react"

const debounce = (func: () => void, wait: number) => {
  let timeout: ReturnType<typeof setTimeout>;
  return () => {
    clearTimeout(timeout);
    timeout = setTimeout(func, wait);
  };
};

interface NavbarProps {
  toggleTheme: () => void
}

export function Navbar({ toggleTheme }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDark, setIsDark] = useState(true)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleToggleTheme = () => {
    setIsDark(!isDark)
    toggleTheme()
  }

  const handleToggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  useEffect(() => {
    const handleScroll = debounce(() => {

      const scrollPosition = window.scrollY;
      if (scrollPosition > 100 && !isScrolled) {        
        setIsScrolled(true);
      } else if (scrollPosition < 40 && isScrolled) {        
        setIsScrolled(false);
      }
    },50);

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, [isScrolled]);

  return (
    <NavbarContainer $isScrolled={isScrolled}>
      <Logo href="#hero">
        <img src={logoStarkOverflow} style={{ height: "100%"}} />
        <span>Stark Overflow</span>
      </Logo>

      <MobileMenuButton onClick={handleToggleMenu}>
        <List size={20} />
      </MobileMenuButton>
      <NavLinks $isOpen={isMenuOpen}>
        <NavLink href="#how-it-works">How it Works</NavLink>
        <NavLink href="#team">Our Team</NavLink>
        <NavLink href="#collaborators">Collaborators</NavLink>
      </NavLinks>

      <ButtonsContainer>
        <ThemeToggle onClick={handleToggleTheme}>
          {isDark ? <Sun size={20} weight="fill" /> : <Moon size={20} weight="fill" />}
        </ThemeToggle>
      </ButtonsContainer>
    </NavbarContainer>
  )
}


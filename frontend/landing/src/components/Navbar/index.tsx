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

  const handleNavLinkClick = () => {
    setIsMenuOpen(false)
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

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 767) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <NavbarContainer $isScrolled={isScrolled}>
      <Logo href="#hero">
        <img src={logoStarkOverflow} style={{ height: "100%"}} alt="Stark Overflow Logo" />
        <span>Stark Overflow</span>
      </Logo>

      <MobileMenuButton onClick={handleToggleMenu} aria-label="Toggle mobile menu">
        <List size={20} />
      </MobileMenuButton>
      <NavLinks $isOpen={isMenuOpen}>
        <NavLink href="#how-it-works" onClick={handleNavLinkClick}>How it Works</NavLink>
        <NavLink href="#team" onClick={handleNavLinkClick}>Our Team</NavLink>
        <NavLink href="#collaborators" onClick={handleNavLinkClick}>Collaborators</NavLink>
      </NavLinks>

      <ButtonsContainer>
        <ThemeToggle onClick={handleToggleTheme} aria-label="Toggle theme">
          {isDark ? <Sun size={20} weight="fill" /> : <Moon size={20} weight="fill" />}
        </ThemeToggle>
      </ButtonsContainer>
    </NavbarContainer>
  )
}


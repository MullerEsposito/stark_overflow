import { Moon, Sun } from "phosphor-react";
import { HeaderContainer, Logo, ToggleThemeButton, HeaderActionsContainer, LogoContainer, LanguageSwitcher, GlobeIcon } from "./style";
import { lightTheme } from "../../styles/themes/light";
import { useTheme } from "styled-components";
import starkoverflowLogo from "../../assets/logos/starkoverflow.svg";
import { NavLink } from "react-router-dom";
import { ConnectButton } from "./custom-button";
import { useTranslation } from "react-i18next";
import { useState } from "react";

interface HeaderProps {
  toggleTheme: () => void;
}

export function Header({ toggleTheme }: HeaderProps) {
  const theme = useTheme();
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setCurrentLanguage(lng);
  };

  return (
    <HeaderContainer>
      <LogoContainer>
        <NavLink to={"/"}>
          <Logo src={starkoverflowLogo} alt="Stark Overflow logo" />
        </NavLink>
      </LogoContainer>

      <HeaderActionsContainer>
        <LanguageSwitcher>
          <select
            value={currentLanguage}
            onChange={(e) => changeLanguage(e.target.value)}
          >
            <option value="en">English</option>
            <option value="pt">Português</option>
            <option value="es">Español</option>
          </select>
          <GlobeIcon size={16} />
        </LanguageSwitcher>
        <ToggleThemeButton onClick={toggleTheme}>
          {theme === lightTheme ? <Moon size={24} /> : <Sun size={24} />}
        </ToggleThemeButton>
        <ConnectButton />
      </HeaderActionsContainer>
    </HeaderContainer>
  );
}
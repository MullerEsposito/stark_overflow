import { Moon, Sun } from "phosphor-react";
import { HeaderActionsContainer, HeaderContainer, LogoContainer, Logo, ToggleThemeButton } from "./style";
import { useTheme } from "styled-components";
import starkoverflowLogo from "../../assets/logos/starkoverflow.svg";
import { NavLink } from "react-router-dom";
import { ConnectButton } from "./custom-button"; // Import the enhanced component

interface HeaderProps {
  toggleTheme: () => void;
}

export function Header({ toggleTheme }: HeaderProps) {
  const theme = useTheme();
  const isLight = theme.name === "light";

  return (
    <HeaderContainer>
      <LogoContainer>
        <NavLink to={"/"}>
          <Logo src={starkoverflowLogo} alt="Stark Overflow logo" />
        </NavLink>
      </LogoContainer>

      <HeaderActionsContainer>
        <ToggleThemeButton onClick={toggleTheme}>
          {isLight ? <Moon size={24} /> : <Sun size={24} />}
        </ToggleThemeButton>
        <ConnectButton />
      </HeaderActionsContainer>
    </HeaderContainer>
  );
}
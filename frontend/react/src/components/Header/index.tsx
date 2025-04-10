import { Moon, Sun } from "phosphor-react";
import { HeaderContainer, Logo, ToggleThemeButton } from "./style";
import { lightTheme } from "../../styles/themes/light";
import { useTheme } from "styled-components";
import styled from "styled-components";
import starkoverflowLogo from "../../assets/logos/starkoverflow.svg";
import { NavLink } from "react-router-dom";
import { ConnectButton } from "./custom-button"; // Import the enhanced component

const HeaderActionsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

interface HeaderProps {
  toggleTheme: () => void;
}

export function Header({ toggleTheme }: HeaderProps) {
  const theme = useTheme();
  
  return (
    <HeaderContainer>
      <NavLink to={"/"}>
        <Logo src={starkoverflowLogo} alt="Stark Overflow logo" />
      </NavLink>
      
      <HeaderActionsContainer>
        <ToggleThemeButton onClick={toggleTheme}>
          {theme === lightTheme ? <Moon size={24} /> : <Sun size={24} />}
        </ToggleThemeButton>
        <ConnectButton />
      </HeaderActionsContainer>
    </HeaderContainer>
  );
}
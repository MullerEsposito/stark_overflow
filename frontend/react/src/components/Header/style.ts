import styled from "styled-components";

export const HeaderContainer = styled.header`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  width: 100%;
  padding: 0 20px;
  border-bottom: 1px solid ${(props) => props.theme.borderColor};
  min-height: 60px;

  a {
    grid-column: 2;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  @media (max-width: 768px) {
    grid-template-columns: 2fr 1fr;
    padding: 0 16px;
    min-height: 56px;
    
    a {
      grid-column: 1;
      justify-content: start;
    }
  }

  @media (max-width: 480px) {
    padding: 0 12px;
    min-height: 52px;
  }
`;

export const HeaderActionsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
`;

export const LogoContainer = styled.div`
  grid-column: 2;

  @media (max-width: 768px) {
    display: flex;
    grid-column: 1;
    
  }
`;

export const Logo = styled.img`
  width: 10rem;
  height: auto;
  max-width: 100%;

  @media (max-width: 768px) {
    width: 8rem;
  }

  @media (max-width: 480px) {
    width: 6rem;
  }

  @media (max-width: 320px) {
    width: 5rem;
  }
`;

export const ToggleThemeButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${(props) => props.theme.text};
  padding: 8px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${(props) => props.theme.secondary || "rgba(0, 0, 0, 0.05)"};
  }

  @media (max-width: 480px) {
    padding: 6px;
    
    svg {
      width: 20px;
      height: 20px;
    }
  }
`;

export const ConnectButtonContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const StyledButton = styled.button`
  background: ${(props) => props.theme.connectBg};
  color: ${(props) => props.theme.connectText};
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
  
  &:hover {
    opacity: 0.9;
  }
`;

export const AddressButton = styled(StyledButton)`
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const Dropdown = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  background: ${(props) => props.theme.connectText};
  border: 1px solid ${(props) => props.theme.borderColor};
  border-radius: 4px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 10;
  min-width: 180px;
  opacity: ${(props) => (props.$isOpen ? 1 : 0)};
  visibility: ${(props) => (props.$isOpen ? "visible" : "hidden")};
  transform: ${(props) => (props.$isOpen ? "translateY(0)" : "translateY(-10px)")};
  transition: all 0.2s ease-in-out;
`;

export const DropdownItem = styled.button`
  width: 100%;
  text-align: left;
  padding: 10px 16px;
  background: none;
  border: none;
  cursor: pointer;
  color: ${(props) => props.theme.text};
  font-size: 14px;
  
  &:hover {
    background: ${(props) => props.theme.hover || "rgba(0, 0, 0, 0.05)"};
  }
  
  &:not(:last-child) {
    border-bottom: 1px solid ${(props) => props.theme.borderColor};
  }
`;

export const ChevronIcon = styled.span<{ $isOpen: boolean }>`
  border: solid ${(props) => props.theme.connectText};
  border-width: 0 2px 2px 0;
  display: inline-block;
  padding: 3px;
  transform: ${(props) => (props.$isOpen ? "rotate(-135deg)" : "rotate(45deg)")};
  margin-bottom: ${(props) => (props.$isOpen ? "3px" : "0")};
  transition: transform 0.2s;
`;

export const ModalOverlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: ${(props) => (props.$isOpen ? "flex" : "none")};
  justify-content: center;
  align-items: center;
  z-index: 100;
`;

export const ModalContent = styled.div`
  background: ${(props) => props.theme.connectText};
  border-radius: 8px;
  padding: 24px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

export const ModalTitle = styled.h3`
  margin: 0;
  font-size: 18px;
  color: ${(props) => props.theme.text};
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: ${(props) => props.theme.text};
  opacity: 0.7;
  
  &:hover {
    opacity: 1;
  }
`;

export const WalletList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const WalletInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

export const WalletName = styled.span`
  font-weight: 600;
  color: ${(props) => props.theme.text};
`;

export const WalletStatus = styled.span`
  font-size: 12px;
  color: ${(props) => props.theme.textSecondary || props.theme.text};
  opacity: 0.7;
`;

export const NoWalletsMessage = styled.div`
  padding: 16px;
  text-align: center;
  color: ${(props) => props.theme.text};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const InstallButton = styled.button`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 12px 16px;
  background: ${(props) => props.theme.cardBackground || props.theme.connectText};
  border: 1px solid ${(props) => props.theme.borderColor};
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  color: ${(props) => props.theme.text} !important;

  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

export const InstallRedirect = styled.a`
    margin: 0 !important;
    width: 100%;
    height: fit-content;
    margin-left: -1rem !important;

`

export const InstallButtonsContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 16px;
`;

export const WalletLogo = styled.img`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  flex-shrink: 0;
`;

export const WalletIcon = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
`;

export const WalletButton = styled.button`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 12px 16px;
  background: ${(props) => props.theme.cardBackground || props.theme.connectText};
  border: 1px solid ${(props) => props.theme.borderColor};
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;
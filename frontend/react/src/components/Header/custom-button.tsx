import { useRef, useEffect, useState } from "react";
import { useAccount, useConnect, useDisconnect, Connector } from "@starknet-react/core";
import { WALLET_LOGOS } from "./constant";
import { AddressButton, ChevronIcon, CloseButton, ConnectButtonContainer, Dropdown, DropdownItem, InstallButton, InstallButtonsContainer, InstallRedirect, ModalContent, ModalHeader, ModalOverlay, ModalTitle, NoWalletsMessage, StyledButton, WalletButton, WalletIcon, WalletInfo, WalletList, WalletLogo, WalletName, WalletStatus } from "./style";
import { useWallet } from "@hooks/useWallet";

// Function to truncate address for display
const truncateAddress = (address: string) => {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

// Wallet installation links
const WALLET_INSTALL_LINKS = {
  argentX: "https://www.argent.xyz/argent-x/",
  braavos: "https://braavos.app/"
};

export function ConnectButton() {
    const { connect, connectors } = useConnect();
    const { isConnected, address } = useAccount();
    const { disconnect } = useDisconnect();
    const { isModalOpen, openConnectModal, closeConnectModal, isWalletDetected } = useWallet();
    
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    
    // Close dropdown when clicking outside
    useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          setIsDropdownOpen(false);
        }
      }
      
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);
    
    // Handle wallet connection
    const handleConnect = (connector: Connector) => {
      connect({ connector });
      closeConnectModal();
    };
    
    // Handle wallet disconnection
    const handleDisconnect = () => {
      disconnect();
      setIsDropdownOpen(false);
    };
    
    return (
      <>
        <ConnectButtonContainer ref={dropdownRef}>
          {isConnected && address ? (
            <>
              <AddressButton onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                {truncateAddress(address)}
                <ChevronIcon $isOpen={isDropdownOpen} />
              </AddressButton>
              
              <Dropdown $isOpen={isDropdownOpen}>
                <DropdownItem onClick={handleDisconnect}>
                  Disconnect Wallet
                </DropdownItem>
              </Dropdown>
            </>
          ) : (
            <StyledButton onClick={openConnectModal}>
              Connect Wallet
            </StyledButton>
          )}
        </ConnectButtonContainer>
        
        {/* Connect Wallet Modal */}
        <ModalOverlay $isOpen={isModalOpen} onClick={(e) => {
          if (e.target === e.currentTarget) closeConnectModal();
        }}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>Connect Wallet</ModalTitle>
              <CloseButton onClick={closeConnectModal}>×</CloseButton>
            </ModalHeader>
            
            {isWalletDetected ? (
              <WalletList>
                {connectors.map((connector) => {
                  const isAvailable = connector.available();
                  return (
                    <WalletButton
                      key={connector.id}
                      onClick={() => handleConnect(connector)}
                      disabled={!isAvailable}
                    >
                      <WalletIcon src={typeof connector.icon === 'string' ? connector.icon : ""} alt={connector.name} />
                      <WalletInfo>
                        <WalletName>{connector.name}</WalletName>
                        <WalletStatus>
                          {isAvailable ? "Available" : "Not installed"}
                        </WalletStatus>
                      </WalletInfo>
                    </WalletButton>
                  );
                })}
              </WalletList>
            ) : (
              <NoWalletsMessage>
                <p>No StarkNet wallets detected in your browser.</p>
                <p>Please install one of the following wallets to continue:</p>
                
                <InstallButtonsContainer>
                  <InstallRedirect href={WALLET_INSTALL_LINKS.argentX} target="_blank" rel="noopener noreferrer">
                    <InstallButton>
                      <WalletLogo src={WALLET_LOGOS.argentX} alt="ArgentX Logo" />
                      Install ArgentX
                    </InstallButton>
                  </InstallRedirect>
                  
                  <InstallRedirect href={WALLET_INSTALL_LINKS.braavos} target="_blank" rel="noopener noreferrer">
                    <InstallButton>
                      <WalletLogo src={WALLET_LOGOS.braavos} alt="Braavos Logo" />
                      Install Braavos
                    </InstallButton>
                  </InstallRedirect>
                </InstallButtonsContainer>
              </NoWalletsMessage>
            )}
          </ModalContent>
        </ModalOverlay>
      </>
    );
  }
import { useWallet } from "@hooks/useWallet";
import React from "react"
import styled from "styled-components"
import { useTranslation } from "react-i18next";

const WalletDetectorContainer = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: ${props => props.theme.warning || "#f39c12"};
  color: white;
  padding: 16px;
  border-radius: 8px;
  max-width: 320px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  display: ${props => props.hidden ? "none" : "block"};
`;

const WalletTitle = styled.h3`
  margin-top: 0;
  margin-bottom: 8px;
  font-size: 16px;
`;

const WalletText = styled.p`
  margin-bottom: 12px;
  font-size: 14px;
`;

const WalletLink = styled.a`
  display: inline-block;
  background: white;
  color: ${props => props.theme.warning || "#f39c12"};
  text-decoration: none;
  padding: 6px 12px;
  border-radius: 4px;
  font-weight: 600;
  margin-right: 8px;
  
  &:hover {
    opacity: 0.9;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 16px;
`;

export function WalletDetector() {
  const { isWalletDetected, isConnected } = useWallet();
  const [dismissed, setDismissed] = React.useState(false);
  const { t } = useTranslation('common');
  
  if (isWalletDetected || isConnected || dismissed) {
    return null;
  }
  
  return (
    <WalletDetectorContainer>
      <CloseButton onClick={() => setDismissed(true)}>×</CloseButton>
      <WalletTitle>{t('walletRequired')}</WalletTitle>
      <WalletText>
        {t('walletNeeded')}
      </WalletText>
      <WalletLink href="https://www.argent.xyz/argent-x/" target="_blank" rel="noopener noreferrer">
        ArgentX
      </WalletLink>
      <WalletLink href="https://braavos.app/" target="_blank" rel="noopener noreferrer">
        Braavos
      </WalletLink>
    </WalletDetectorContainer>
  );
}
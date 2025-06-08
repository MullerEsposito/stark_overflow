"use client";
import React from "react";
import { mainnet, sepolia, } from "@starknet-react/chains";
import {
  StarknetConfig,
  argent,
  braavos,
  useInjectedConnectors,
  starkscan,
  cartridgeProvider,
} from "@starknet-react/core";


export function StarknetProvider({ children }: { children: React.ReactNode }) {
  const { connectors } = useInjectedConnectors({
    recommended: [argent(), braavos()],
    includeRecommended: "onlyIfNoConnectors",
    order: "alphabetical",
  });
  const provider = cartridgeProvider();

  return (
    <StarknetConfig
      chains={[mainnet, sepolia]}
      provider={provider}
      connectors={connectors}
      explorer={starkscan}
      autoConnect={true} // Enable auto-connect
    >
      {children}
    </StarknetConfig>
  );
}

export default StarknetProvider;
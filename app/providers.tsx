"use client";

import { WagmiProvider } from "wagmi";
import {
  darkTheme,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { wagmiConfig } from "@/lib/web3/wagmi";
import "@rainbow-me/rainbowkit/styles.css";

const queryClient = new QueryClient();

const terminalTheme = {
  ...darkTheme({
    accentColor: "#4ade80",
    accentColorForeground: "#000000",
    borderRadius: "none",
    overlayBlur: "none",
  }),
  colors: {
    ...darkTheme().colors,
    accentColor: "#00cc52",
    accentColorForeground: "#000000",
    modalBackground: "#000000",
    modalBorder: "#14532d",
    modalText: "#00cc52",
    modalTextDim: "#0f961f",
    modalTextSecondary: "#16a34a",
    menuItemBackground: "#0a0a0a",
    profileForeground: "#0a0a0a",
    profileAction: "#0a0a0a",
    profileActionHover: "#0d1f0d",
    closeButton: "#00cc52",
    closeButtonBackground: "#0a0a0a",
    actionButtonBorder: "#14532d",
    actionButtonBorderMobile: "#14532d",
    actionButtonSecondaryBackground: "#0a0a0a",
    generalBorder: "#14532d",
    generalBorderDim: "#0d2010",
    selectedOptionBorder: "#00cc52",
    connectionIndicator: "#00cc52",
    downloadBottomCardBackground: "#0a0a0a",
    downloadTopCardBackground: "#0d1f0d",
    error: "#ef4444",
    standby: "#00cc52",
  },
  fonts: {
    body: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
  },
  radii: {
    actionButton: "0px",
    connectButton: "0px",
    menuButton: "0px",
    modal: "0px",
    modalMobile: "0px",
  },
  shadows: {
    connectButton: "0 0 0 1px #14532d",
    dialog: "0 0 0 1px #14532d, 0 0 40px #4ade8022",
    profileDetailsAction: "0 0 0 1px #14532d",
    selectedOption: "0 0 0 1px #4ade80",
    selectedWallet: "0 0 0 2px #4ade8066",
    walletLogo: "0 0 0 1px #14532d",
  },
};

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider coolMode theme={terminalTheme}>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

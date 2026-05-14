import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { env } from "@/lib/config";
import {
  mainnet,
  sepolia,
  supportedChains,
} from "@/lib/web3/chains";

export const wagmiConfig = getDefaultConfig({
  appName: "Militia",
  projectId: env.walletConnectProjectId,
  chains: supportedChains,
  ssr: true,
});

export { mainnet, sepolia };

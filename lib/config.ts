function requireEnv(name: string, value: string | undefined): string {
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
}

export const env = {
  alchemySepolia: requireEnv("NEXT_PUBLIC_ALCHEMY_SEPOLIA", process.env.NEXT_PUBLIC_ALCHEMY_SEPOLIA),
  alchemyMainnet: requireEnv("NEXT_PUBLIC_ALCHEMY_MAINNET", process.env.NEXT_PUBLIC_ALCHEMY_MAINNET),
  walletConnectProjectId: requireEnv("NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID", process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID),
  soldiersCid: requireEnv("NEXT_PUBLIC_PINATA_SOLDIERS", process.env.NEXT_PUBLIC_PINATA_SOLDIERS),
} as const;

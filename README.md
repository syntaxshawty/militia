# Mi’LITIA Mint Site

Frontend minting site for the Mi’LITIA NFT collection.

Built with Next.js, React, TypeScript, Tailwind CSS, wagmi, viem, and RainbowKit.

## Features

- Wallet connection via RainbowKit
- Sepolia and mainnet-ready contract config
- NFT minting flow
- Dynamic mint price quoting via `quoteMintPrice`
- Milady holder benefit support
  - Early whitelist free mint
  - Half-off holder benefit
- Tiered mint pricing
- Mock quote mode for frontend testing
- Post-mint quote refresh to prevent stale free-mint state
- Responsive mint UI

## Tech Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- wagmi
- viem
- RainbowKit
- Vercel

## Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourContractAddress
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_ALCHEMY_SEPOLIA=https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
NEXT_PUBLIC_MOCK_MINT_QUOTES=false
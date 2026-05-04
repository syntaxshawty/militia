import { type Address } from "viem";
import { sepolia } from "@/lib/web3/chains";
import { MILITIA_ABI } from "@/lib/web3/abis/militia";

export const CONTRACT_ADDRESSES: Partial<Record<number, Address>> = {
  [sepolia.id]: "0x18DaF7F733763E99111e6Dbe8955d052015691c3",
};

export function getContractAddress(chainId: number): Address | undefined {
  return CONTRACT_ADDRESSES[chainId];
}

export { MILITIA_ABI };

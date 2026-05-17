import { type Address } from "viem";
import { sepolia } from "@/lib/web3/chains";
import { MILITIA_ABI } from "@/lib/web3/abis/militia";

export const CONTRACT_ADDRESSES: Partial<
  Record<number, Address>
> = {
  [sepolia.id]:
    "0x689A4Bd9968c99F66535A001336E96831f33d6d3",
};

export function getContractAddress(
  chainId: number
): Address | undefined {
  return CONTRACT_ADDRESSES[chainId];
}

export { MILITIA_ABI };

import {
  useWriteContract,
  useWaitForTransactionReceipt,
  useChainId,
} from "wagmi";
import { type Address } from "viem";
import { MILITIA_ABI } from "@/lib/web3/abis/militia";
import { getContractAddress } from "@/lib/web3/contract";

/**
 * Hook for minting Militia NFTs.
 *
 * @example
 * const { mint, isPending, isConfirming, isConfirmed, error } = useMint();
 * mint({ to: address, quantity: 2n, mintPrice: parseEther("0.01") });
 */
export function useMint() {
  const chainId = useChainId();
  const address = getContractAddress(chainId);
  if (!address)
    throw new Error(
      `No contract deployed on chain ${chainId}`
    );

  const {
    writeContract,
    reset,
    data: txHash,
    isPending,
    error: writeError,
  } = useWriteContract();

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    data: receipt,
    error: receiptError,
  } = useWaitForTransactionReceipt({ hash: txHash });

  function mint({
    to,
    quantity,
    value,
  }: {
    to: Address;
    quantity: bigint;
    value: bigint;
  }) {
    writeContract({
      address: address!,
      abi: MILITIA_ABI,
      functionName: "mintMilitia",
      args: [to, quantity],
      value,
    });
  }

  return {
    mint,
    reset,
    txHash,
    receipt,
    isPending, // wallet is awaiting user signature
    isConfirming, // tx submitted, waiting for block confirmation
    isConfirmed, // tx confirmed on-chain
    error: writeError ?? receiptError,
  };
}

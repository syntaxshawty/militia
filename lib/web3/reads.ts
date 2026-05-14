import {
  useReadContracts,
  useReadContract,
  useChainId,
} from "wagmi";
import { type Address } from "viem";
import { MILITIA_ABI } from "@/lib/web3/abis/militia";
import { getContractAddress } from "@/lib/web3/contract";
import {
  getMockQuotePrice,
  getMockEligibility,
} from "@/lib/web3/mockMintState";

const MOCK_MODE =
  process.env.NEXT_PUBLIC_MOCK_MINT_QUOTES === "true";

function useContractBase() {
  const chainId = useChainId();
  const address = getContractAddress(chainId);
  return {
    address,
    abi: MILITIA_ABI,
    enabled: !!address,
  } as const;
}

/**
 * Fetches core mint stats: current supply, max supply, mint price, and max per wallet.
 */
export function useMintStats() {
  const contract = useContractBase();

  const { data, ...rest } = useReadContracts({
    contracts: [
      { ...contract, functionName: "totalSupply" },
      { ...contract, functionName: "DEPLOYMENT_CAP" },
      {
        ...contract,
        functionName: "DEFAULT_MILITIA_PRICE",
      },
      { ...contract, functionName: "INFANTRY_STRENGTH" },
    ],
    query: { enabled: contract.enabled },
  });

  return {
    totalSupply: data?.[0].result,
    deploymentCap: data?.[1].result,
    mintPrice: data?.[2].result,
    infantryStrength: data?.[3].result,
    ...rest,
  };
}

/**
 * Fetches current mint phase: whether minting has started, is paused,
 * or is in milady-whitelist-only mode.
 */
export function useMintPhase() {
  const contract = useContractBase();

  const { data, ...rest } = useReadContracts({
    contracts: [
      { ...contract, functionName: "paused" },
      {
        ...contract,
        functionName: "miladyWhitelistActive",
      },
    ],
    query: { enabled: contract.enabled },
  });

  return {
    paused: data?.[0].result,
    miladyWhitelistActive: data?.[1].result,
    ...rest,
  };
}

/**
 * Fetches milady-holder eligibility for a given address.
 * Pass the connected wallet address; skip if undefined (wallet not connected).
 */
export function useMiladyEligibility(
  address: Address | undefined
) {
  const contract = useContractBase();

  const {
    data,
    refetch: refetchEligibility,
    ...rest
  } = useReadContracts({
    contracts: [
      {
        ...contract,
        functionName: "canMintWithMilady",
        args: address ? [address] : undefined,
      },
      {
        ...contract,
        functionName: "miladyBenefitClaimed",
        args: address ? [address] : undefined,
      },
      {
        ...contract,
        functionName: "miladyTierSlotsRemaining",
      },
      {
        ...contract,
        functionName: "miladyWhitelistActive",
      },
    ],
    query: {
      enabled: !MOCK_MODE && !!address && contract.enabled,
    },
  });

  if (MOCK_MODE) {
    return {
      ...getMockEligibility(),
      refetchEligibility: async () => {},
      ...rest,
    };
  }

  const canMintWithMilady = data?.[0].result;
  const miladyBenefitClaimed = data?.[1].result;
  const tierSlots = data?.[2].result;
  const miladyWhitelistActive = data?.[3].result;
  const slotsAvailable = tierSlots
    ? tierSlots[0] > BigInt(0) || tierSlots[1] > BigInt(0)
    : false;
  const hasActiveBenefit =
    !!miladyWhitelistActive &&
    !miladyBenefitClaimed &&
    !!canMintWithMilady &&
    slotsAvailable;

  const miladyTier: "free" | "halfOff" | null =
    hasActiveBenefit
      ? tierSlots && tierSlots[0] > BigInt(0)
        ? "free"
        : tierSlots && tierSlots[1] > BigInt(0)
          ? "halfOff"
          : null
      : null;

  return {
    canMintWithMilady,
    miladyBenefitClaimed,
    hasActiveBenefit,
    miladyTier,
    refetchEligibility,
    ...rest,
  };
}

/**
 * Fetches tokenURI for each token ID in the provided array.
 */
export function useTokenURIs(tokenIds: bigint[]) {
  const contract = useContractBase();

  const { data } = useReadContracts({
    contracts: tokenIds.map((id) => ({
      ...contract,
      functionName: "tokenURI" as const,
      args: [id] as const,
    })),
    query: {
      enabled: tokenIds.length > 0 && contract.enabled,
    },
  });

  return (
    data?.map((d) => d.result as string | undefined) ?? []
  );
}

/**
 * Quotes the total mint price for a given quantity, using the contract's
 * tier logic. Re-runs whenever quantity changes.
 */
export function useQuoteMintPrice(
  quantity: number,
  account?: Address
) {
  const contract = useContractBase();

  const {
    data,
    isLoading,
    isError,
    error,
    refetch: refetchPrice,
  } = useReadContract({
    ...contract,
    account,
    functionName: "quoteMintPrice",
    args: [BigInt(quantity), account as Address],
    query: {
      enabled:
        !MOCK_MODE &&
        contract.enabled &&
        quantity > 0 &&
        !!account,
      retry: 2,
    },
  });

  console.log("[useQuoteMintPrice]", {
    quantity,
    account,
    data,
    isLoading,
    isError,
    error: error?.message,
  });

  if (MOCK_MODE) {
    const { price, error: mockError } =
      getMockQuotePrice(quantity);
    return {
      quotedPrice: price,
      priceLoading: false,
      priceError: mockError,
      isFreeMint: false,
      hasDiscount: false,
      refetchPrice: async () => {},
    };
  }

  return {
    quotedPrice: data?.totalPrice,
    priceLoading: isLoading,
    priceError: isError
      ? (error?.message ?? "Price unavailable")
      : null,
    isFreeMint: data?.isFreeMint ?? false,
    hasDiscount: data?.hasDiscount ?? false,
    refetchPrice,
  };
}

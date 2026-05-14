// ─── Mock Mint State ────────────────────────────────────────────────────────
// Enable mock mode by setting NEXT_PUBLIC_MOCK_MINT_QUOTES=true in .env.local
// Then change ACTIVE_MOCK_STATE below to switch between scenarios.

export type MockMintState =
  | "normal" // Regular user — no whitelist benefit, full price
  | "free" // Milady holder — free mint available
  | "halfOff" // Milady holder — 50% discount available
  | "claimed" // Milady holder — benefit already used (grey star)
  | "priceFailure"; // quoteMintPrice reverts — tests the fallback price path

// ← change this line to switch scenarios
export const ACTIVE_MOCK_STATE: MockMintState = "normal";

// Simulated base price (0.033 ETH) used for non-free states
const MOCK_BASE_PRICE = BigInt("33000000000000000");

export function getMockQuotePrice(quantity: number): {
  price: bigint | undefined;
  error: string | null;
} {
  switch (ACTIVE_MOCK_STATE) {
    case "free":
      return { price: BigInt(0), error: null };
    case "halfOff":
      return {
        price:
          (MOCK_BASE_PRICE * BigInt(quantity)) / BigInt(2),
        error: null,
      };
    case "priceFailure":
      return {
        price: undefined,
        error:
          "Simulated contract revert: quoteMintPrice failed",
      };
    case "normal":
    case "claimed":
    default:
      return {
        price: MOCK_BASE_PRICE * BigInt(quantity),
        error: null,
      };
  }
}

export function getMockEligibility(): {
  canMintWithMilady: boolean;
  miladyBenefitClaimed: boolean;
  hasActiveBenefit: boolean;
  miladyTier: "free" | "halfOff" | null;
} {
  switch (ACTIVE_MOCK_STATE) {
    case "free":
      return {
        canMintWithMilady: true,
        miladyBenefitClaimed: false,
        hasActiveBenefit: true,
        miladyTier: "free",
      };
    case "halfOff":
      return {
        canMintWithMilady: true,
        miladyBenefitClaimed: false,
        hasActiveBenefit: true,
        miladyTier: "halfOff",
      };
    case "claimed":
      return {
        canMintWithMilady: true,
        miladyBenefitClaimed: true,
        hasActiveBenefit: false,
        miladyTier: null,
      };
    case "normal":
    case "priceFailure":
    default:
      return {
        canMintWithMilady: false,
        miladyBenefitClaimed: false,
        hasActiveBenefit: false,
        miladyTier: null,
      };
  }
}

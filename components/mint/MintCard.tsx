"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { useMintStats, useMintPhase, useQuoteMintPrice, useTokenURIs } from "@/lib/web3/reads";
import { useMint } from "@/lib/web3/writes";
import { parseMintedTokenIds } from "@/lib/web3/parseLogs";
import { formatMintPrice, formatSupply, formatTokenId } from "@/lib/format";
import { type Rank, RANK_MESSAGES, fetchTokenRank, highestRank } from "@/lib/rankMessages";

const DEV_MOCK_CONFIRMING = false;

type PricingState = "loading" | "free" | "discounted" | "normal" | "fallback" | "unavailable";

export default function MintCard({ onMinted, onReset }: { onMinted?: (ids: bigint[]) => void; onReset?: () => void }) {
  const [quantity, setQuantity] = useState(1);

  const { address, isConnected } = useAccount();

  const { totalSupply, deploymentCap, infantryStrength, mintPrice } = useMintStats();
  const { paused } = useMintPhase();
  const { quotedPrice, priceLoading, priceError, refetchPrice } = useQuoteMintPrice(quantity, address);
  const { mint, reset, receipt, isPending, isConfirming: realConfirming, isConfirmed, error } = useMint();
  const isConfirming = DEV_MOCK_CONFIRMING || realConfirming;

  const [mintRank, setMintRank] = useState<Rank | null>(null);
  const [benefitConsumed, setBenefitConsumed] = useState(false);

  const basePrice = mintPrice !== undefined ? mintPrice * BigInt(quantity) : undefined;
  const rawEffectivePrice = quotedPrice ?? basePrice;
  const effectivePrice = benefitConsumed && quotedPrice === BigInt(0) ? basePrice : rawEffectivePrice;

  const pricingState: PricingState = priceLoading
    ? "loading"
    : effectivePrice === undefined
    ? "unavailable"
    : !benefitConsumed && quotedPrice === BigInt(0)
    ? "free"
    : !benefitConsumed && quotedPrice !== undefined && basePrice !== undefined && quotedPrice < basePrice
    ? "discounted"
    : priceError !== null && quotedPrice === undefined
    ? "fallback"
    : "normal";

  // DEPLOYMENT_CAP = max per mint, INFANTRY_STRENGTH = total collection (2222)
  const maxQty = deploymentCap ? Number(deploymentCap) : 1;

  const bulkDiscount = quantity >= 5 ? "33% OFF" : quantity >= 3 ? "22% OFF" : null;
  const mintedIds = receipt ? parseMintedTokenIds(receipt.logs) : [];
  const tokenURIs = useTokenURIs(mintedIds);

  useEffect(() => {
    if (!isConfirmed || mintedIds.length === 0) return;
    if (tokenURIs.length !== mintedIds.length || tokenURIs.some((u) => !u)) return;
    if (fetchTokenRank) {
      Promise.all(tokenURIs.map((u) => fetchTokenRank(u!))).then((ranks) => {
        setMintRank(highestRank(ranks));
      });
    }
  }, [isConfirmed, tokenURIs.join(",")]);

  useEffect(() => {
    if (isConfirmed && mintedIds.length > 0) {
      onMinted?.(mintedIds);
      setBenefitConsumed(true);
      refetchPrice();
    }
  }, [isConfirmed]);
  const phaseOpen = !paused;

  function handleMint() {
    if (!address || effectivePrice === undefined) return;
    mint({
      to: address,
      quantity: BigInt(quantity),
      value: effectivePrice,
    });
  }

  function getMintLabel(): string {
    if (isPending) return "CONFIRM IN WALLET...";
    if (isConfirming) return "MINTING...";
    if (isConfirmed) return "MINTED!";
    if (paused) return "PAUSED";
    if (priceLoading) return "LOADING...";
    return `MINT ${quantity}`;
  }

  const mintDisabled = !isConnected || !phaseOpen || isPending || isConfirming || isConfirmed || effectivePrice === undefined || priceLoading;

  return (
    <div className="font-mono text-green-500 text-sm space-y-4 w-full">

      {/* Stats */}
      <div className="space-y-1">
        {totalSupply !== undefined && infantryStrength !== undefined && (
          <div className="flex justify-between">
            <span>STRENGTH</span>
            <span>{formatSupply(totalSupply, infantryStrength)}</span>
          </div>
        )}
        <div className="flex justify-between items-center">
          <span className="flex items-center gap-2">
            PRICE
            {bulkDiscount && (
              <span className="text-xs px-1 border border-yellow-500 text-yellow-500">{bulkDiscount}</span>
            )}
          </span>
          <span className="flex items-center gap-2">
            {pricingState === "loading" && "..."}
            {pricingState === "unavailable" && "—"}
            {pricingState === "free" && <span className="text-green-400">FREE</span>}
            {(pricingState === "normal" || pricingState === "discounted" || pricingState === "fallback") &&
              effectivePrice !== undefined && formatMintPrice(effectivePrice)}
            {pricingState === "discounted" && basePrice !== undefined && (
              <span className="text-xs text-green-800 line-through">{formatMintPrice(basePrice)}</span>
            )}
            {pricingState === "fallback" && (
              <span className="text-xs text-yellow-600" title={priceError ?? undefined}>~</span>
            )}
          </span>
        </div>
      </div>

      <div className="border-t border-green-900" />

      {/* Phase / pricing status */}
      <div className="text-xs space-y-1">
        {paused && <p className="text-green-700">MINTING PAUSED</p>}
        {pricingState === "free" && <p className="text-green-400">FREE MINT AVAILABLE</p>}
        {pricingState === "discounted" && <p className="text-green-600">DISCOUNT APPLIED</p>}
        {pricingState === "fallback" && <p className="text-yellow-600">ESTIMATED PRICE — LIVE QUOTE UNAVAILABLE</p>}
      </div>

      {/* Qty picker */}
      {isConnected && (
        <div className="flex items-center gap-4">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={quantity <= 1 || isPending || isConfirming}
            className="px-3 py-1 border border-green-800 hover:bg-green-900 disabled:opacity-30"
          >
            −
          </button>
          <span className="w-6 text-center">{quantity}</span>
          <button
            onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))}
            disabled={quantity >= maxQty || isPending || isConfirming}
            className="px-3 py-1 border border-green-800 hover:bg-green-900 disabled:opacity-30"
          >
            +
          </button>
          <span className="text-xs text-green-800">MAX {maxQty}</span>
        </div>
      )}

      {/* Mint button */}
      {isConnected ? (
        <div className="flex gap-2">
          <button
            onClick={handleMint}
            disabled={mintDisabled}
            className={`relative overflow-hidden flex-1 py-2 border border-green-500 hover:bg-green-900 disabled:opacity-40 disabled:cursor-not-allowed tracking-widest ${isConfirming ? "neon-border-glow" : ""}`}
          >
            {getMintLabel()}
            {isConfirming && <span className="neon-sweep" aria-hidden />}
          </button>
          {isConfirmed && (
            <button
              onClick={() => { reset(); setQuantity(1); setMintRank(null); setBenefitConsumed(false); onReset?.(); }}
              className="px-3 py-2 border border-green-700 hover:bg-green-900 text-green-700 hover:text-green-500"
              title="Mint again"
            >
              ↺
            </button>
          )}
        </div>
      ) : (
        <p className="text-xs text-green-700">CONNECT YOUR WALLET TO MINT</p>
      )}

      {/* Minted token IDs */}
      {isConfirmed && mintedIds.length > 0 && (
        <div className="text-xs text-green-700 space-y-1">
          <p>MINTED:</p>
          <div className="flex flex-wrap gap-2">
            {mintedIds.map((id) => (
              <span key={id.toString()}>{formatTokenId(id)}</span>
            ))}
          </div>
        </div>
      )}

      {/* Rank message */}
      {mintRank && (
        <div className="border border-green-900 p-3 space-y-1">
          <p className="text-xs text-green-400 tracking-widest">{mintRank.toUpperCase()}</p>
          <p className="text-xs text-green-700 leading-relaxed">{RANK_MESSAGES[mintRank]}</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <p className="text-xs text-red-500 break-words">{error.message}</p>
      )}
    </div>
  );
}

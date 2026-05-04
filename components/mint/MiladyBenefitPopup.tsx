"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { useMiladyEligibility, useQuoteMintPrice } from "@/lib/web3/reads";
import { useMint } from "@/lib/web3/writes";
import { parseMintedTokenIds } from "@/lib/web3/parseLogs";
import { formatMintPrice } from "@/lib/format";
import { type Rank, RANK_MESSAGES, fetchTokenRank, highestRank } from "@/lib/rankMessages";
import { useTokenURIs } from "@/lib/web3/reads";

// DEV ONLY — set to 'free' or 'halfOff' to test popup without a Milady in wallet. Set to null for production.
const DEV_MOCK_MILADY: 'free' | 'halfOff' | null = null;
// DEV ONLY — set to true to preview the minting shimmer. Set to false for production.
const DEV_MOCK_CONFIRMING = false;

const titleBarStyle: React.CSSProperties = {
  background: "linear-gradient(to right, #000080, #1084d0)",
  padding: "3px 4px 3px 6px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  userSelect: "none",
};

const winBtnStyle: React.CSSProperties = {
  width: 16,
  height: 14,
  fontSize: 9,
  fontFamily: "Arial, sans-serif",
  fontWeight: "bold",
  background: "#d4d0c8",
  border: "1.5px solid",
  borderColor: "#ffffff #808080 #808080 #ffffff",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
};

const winActionBtnStyle: React.CSSProperties = {
  fontFamily: "'MS Sans Serif', Arial, sans-serif",
  fontSize: 11,
  background: "#d4d0c8",
  border: "2px solid",
  borderColor: "#ffffff #808080 #808080 #ffffff",
  padding: "4px 24px",
  cursor: "pointer",
  minWidth: 80,
};

const winActionBtnDisabledStyle: React.CSSProperties = {
  ...winActionBtnStyle,
  opacity: 0.5,
  cursor: "default",
};

interface Props {
  onMinted?: (ids: bigint[]) => void;
  minimized: boolean;
  hasBeenMinimized: boolean;
  onMinimize: (wasClaim?: boolean) => void;
}

export default function MiladyBenefitPopup({ onMinted, minimized, onMinimize }: Props) {
  const [isMinimizing, setIsMinimizing] = useState(false);
  const [mintRank, setMintRank] = useState<Rank | null>(null);

  const [claimedOptimistic, setClaimedOptimistic] = useState(false);

  const { address, isConnected } = useAccount();
  const real = useMiladyEligibility(address);
  const { hasActiveBenefit, miladyBenefitClaimed, miladyTier, refetchEligibility } = DEV_MOCK_MILADY
    ? { hasActiveBenefit: true, miladyBenefitClaimed: false, miladyTier: DEV_MOCK_MILADY, refetchEligibility: async () => {} }
    : real;
  const { quotedPrice, refetchPrice } = useQuoteMintPrice(1, address);
  const { mint, receipt, isPending, isConfirming: realConfirming, isConfirmed, error } = useMint();
  const isConfirming = DEV_MOCK_CONFIRMING || realConfirming;

  const mintedIds = receipt ? parseMintedTokenIds(receipt.logs) : [];
  const tokenURIs = useTokenURIs(mintedIds);

  useEffect(() => {
    if (isConfirmed && mintedIds.length > 0) {
      onMinted?.(mintedIds);
      setClaimedOptimistic(true);
      refetchEligibility();
      refetchPrice();
    }
  }, [isConfirmed]);

  useEffect(() => {
    if (!isConfirmed || mintedIds.length === 0) return;
    if (tokenURIs.length !== mintedIds.length || tokenURIs.some((u) => !u)) return;
    Promise.all(tokenURIs.map((u) => fetchTokenRank(u!))).then((ranks) => {
      setMintRank(highestRank(ranks));
    });
  }, [isConfirmed, tokenURIs.join(",")]);

  useEffect(() => {
    if (isConfirmed) triggerMinimize();
  }, [isConfirmed]);

  function triggerMinimize() {
    setIsMinimizing(true);
  }

  function onAnimationEnd() {
    if (isMinimizing) {
      setIsMinimizing(false);
      onMinimize(claimedOptimistic);
    }
  }

  const isClaimed = !!miladyBenefitClaimed || claimedOptimistic;
  const isVisible = (isConnected || !!DEV_MOCK_MILADY) && (hasActiveBenefit || isClaimed);

  if (!isVisible || minimized || (isClaimed && !isMinimizing)) return null;

  const benefitLabel =
    miladyTier === "free" ? "You have a FREE mint available!" :
    miladyTier === "halfOff" ? "You have a 50% discount available!" :
    "You have a Milady benefit!";

  function handleMint() {
    if (!address || quotedPrice === undefined) return;
    mint({ to: address, quantity: BigInt(1), value: quotedPrice });
  }

  // Full overlay
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div
        className={isMinimizing ? "animate-minimize" : "animate-popup"}
        onAnimationEnd={onAnimationEnd}
        style={{
          fontFamily: "'MS Sans Serif', Arial, sans-serif",
          background: "#d4d0c8",
          border: "2px solid",
          borderColor: "#ffffff #808080 #808080 #ffffff",
          boxShadow: "2px 2px 0 #000000",
          width: "100%",
          maxWidth: 320,
          margin: "0 16px",
        }}
      >
        {/* Title bar */}
        <div style={titleBarStyle}>
          <span style={{ color: "white", fontSize: 11, fontWeight: "bold" }}>
            🎁 Milady Holder Benefit
          </span>
          <div style={{ display: "flex", gap: 2 }}>
            <button style={winBtnStyle} onClick={triggerMinimize} title="Minimize">_</button>
            <button style={winBtnStyle} onClick={triggerMinimize} title="Close">✕</button>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: "20px 16px 16px", textAlign: "center" }}>

          <div style={{ fontSize: 52, marginBottom: 12 }} className="animate-bounce select-none">🎁</div>

          <p style={{ fontSize: 13, fontWeight: "bold", marginBottom: 4, color: "#000" }}>
            Milady Holder Detected
          </p>
          <p style={{ fontSize: 11, color: "#000080", marginBottom: 16 }}>
            {benefitLabel}
          </p>

          {/* Divider */}
          <div style={{ borderTop: "1px solid #808080", borderBottom: "1px solid #ffffff", marginBottom: 16 }} />

          {/* Price */}
          {!isConfirmed && (
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 16, color: "#000" }}>
              <span>Price:</span>
              <span style={{ fontWeight: "bold" }}>
                {quotedPrice === undefined
                  ? "..."
                  : quotedPrice === BigInt(0)
                  ? "FREE"
                  : formatMintPrice(quotedPrice)}
              </span>
            </div>
          )}

          {isConfirmed ? (
            <div>
              <p style={{ fontSize: 12, color: "#008000", fontWeight: "bold", margin: "8px 0" }}>
                ✓ Benefit claimed!
              </p>
              {mintRank && (
                <div style={{ marginTop: 10, textAlign: "left", borderTop: "1px solid #808080", paddingTop: 10 }}>
                  <p style={{ fontSize: 10, fontWeight: "bold", color: "#000080", marginBottom: 4 }}>
                    {mintRank.toUpperCase()}
                  </p>
                  <p style={{ fontSize: 10, color: "#333", lineHeight: 1.5 }}>
                    {RANK_MESSAGES[mintRank]}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: "flex", justifyContent: "center", gap: 8 }}>
              <button
                style={isPending || isConfirming || quotedPrice === undefined ? winActionBtnDisabledStyle : winActionBtnStyle}
                disabled={isPending || isConfirming || quotedPrice === undefined}
                onClick={handleMint}
              >
                {isPending ? "Signing..." : isConfirming ? "Minting..." : "Mint"}
              </button>
              <button style={winActionBtnStyle} onClick={triggerMinimize}>
                Cancel
              </button>
            </div>
          )}

          {error && (
            <p style={{ fontSize: 10, color: "#cc0000", marginTop: 8, wordBreak: "break-word" }}>
              {error.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

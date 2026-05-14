"use client";

import Image from "next/image";
import ConnectWallet from "./ConnectWallet";
import { useAccount } from "wagmi";
import { useMiladyEligibility } from "@/lib/web3/reads";

interface HeaderProps {
  miladyMinimized: boolean;
  miladyHasBeenMinimized: boolean;
  miladyJustClaimed: boolean;
  onMiladyReopen: () => void;
  onStarBlinkDone: () => void;
}

export default function Header({
  miladyMinimized,
  miladyHasBeenMinimized,
  miladyJustClaimed,
  onMiladyReopen,
  onStarBlinkDone,
}: HeaderProps) {
  const { address } = useAccount();
  const { miladyBenefitClaimed } =
    useMiladyEligibility(address);
  const isClaimed = !!miladyBenefitClaimed;

  const showStar =
    miladyMinimized || isClaimed || miladyJustClaimed;

  const starAnimClass = miladyJustClaimed
    ? "animate-star-claim"
    : !isClaimed && miladyHasBeenMinimized
      ? "animate-sparkle"
      : "";

  return (
    <header className="sticky top-0 z-50 bg-black border-b border-green-900 flex items-center justify-between px-6 py-3">
      <Image
        src="/Militia_banner.png"
        alt="Militia"
        width={300}
        height={100}
        className="w-40"
      />
      <div className="flex items-center gap-3">
        {showStar && (
          <button
            onClick={() => {
              if (!isClaimed) onMiladyReopen();
            }}
            className={`leading-none ${starAnimClass}`}
            style={{
              fontSize: 28,
              lineHeight: 1,
              color: miladyJustClaimed
                ? undefined
                : isClaimed
                  ? "#a4a4a4"
                  : "#f5c000",
              cursor: isClaimed ? "default" : "pointer",
              filter: miladyJustClaimed
                ? undefined
                : isClaimed
                  ? "grayscale(1) brightness(0.7)"
                  : undefined,
            }}
            onAnimationEnd={() => {
              if (miladyJustClaimed) onStarBlinkDone();
            }}
            title={
              isClaimed
                ? "BENEFIT HAS BEEN CLAIMED"
                : "Milady benefit — click to open"
            }
          >
            ★
          </button>
        )}
        <ConnectWallet />
      </div>
    </header>
  );
}

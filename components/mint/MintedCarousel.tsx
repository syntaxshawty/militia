"use client";

import { useState } from "react";
import Image from "next/image";
import { formatTokenId } from "@/lib/format";

import { env } from "@/lib/config";

const GATEWAY = "https://militiabunker.mypinata.cloud";

function tokenImage(tokenId: bigint): string {
  return `${GATEWAY}/ipfs/${env.soldiersCid}/${tokenId.toString()}.png`;
}

interface MintedCarouselProps {
  tokenIds: bigint[];
  onIndexChange?: (index: number) => void;
}

export default function MintedCarousel({ tokenIds, onIndexChange }: MintedCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [slideClass, setSlideClass] = useState("");

  const tokenId = tokenIds[current];
  const total = tokenIds.length;

  function goNext() {
    const next = Math.min(total - 1, current + 1);
    setSlideClass("slide-from-right");
    setCurrent(next);
    onIndexChange?.(next);
  }

  function goPrev() {
    const next = Math.max(0, current - 1);
    setSlideClass("slide-from-left");
    setCurrent(next);
    onIndexChange?.(next);
  }

  if (!tokenId) return null;

  return (
    <div className="w-full">
      <div className="relative aspect-[409/512] overflow-hidden border border-green-900">
        <div
          key={current}
          className={`absolute inset-0 ${slideClass}`}
          onAnimationEnd={() => setSlideClass("")}
        >
          <Image
            src={tokenImage(tokenId)}
            alt={formatTokenId(tokenId)}
            fill
            className="object-cover"
          />
        </div>
      </div>

      {total > 1 ? (
        <div className="flex items-center justify-between mt-2 font-mono text-xs text-green-700">
          <button
            onClick={goPrev}
            disabled={current === 0}
            className="hover:text-green-500 disabled:opacity-30"
          >
            ← PREV
          </button>
          <span>{formatTokenId(tokenId)} ({current + 1}/{total})</span>
          <button
            onClick={goNext}
            disabled={current === total - 1}
            className="hover:text-green-500 disabled:opacity-30"
          >
            NEXT →
          </button>
        </div>
      ) : (
        <p className="mt-2 font-mono text-xs text-green-700 text-center">
          {formatTokenId(tokenId)}
        </p>
      )}
    </div>
  );
}

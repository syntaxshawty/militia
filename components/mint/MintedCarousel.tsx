"use client";

import { useState } from "react";
import Image from "next/image";
import { formatTokenId } from "@/lib/format";

import { env } from "@/lib/config";

const GATEWAY = "https://militiabunker.mypinata.cloud";

function tokenImage(tokenId: bigint): string {
  return `${GATEWAY}/ipfs/${env.soldiersCid}/${tokenId.toString()}.png`;
}

export default function MintedCarousel({ tokenIds }: { tokenIds: bigint[] }) {
  const [current, setCurrent] = useState(0);
  const [slideClass, setSlideClass] = useState("");

  const tokenId = tokenIds[current];
  const total = tokenIds.length;

  function goNext() {
    setSlideClass("slide-from-right");
    setCurrent((c) => Math.min(total - 1, c + 1));
  }

  function goPrev() {
    setSlideClass("slide-from-left");
    setCurrent((c) => Math.max(0, c - 1));
  }

  if (!tokenId) return null;

  return (
    <div className="w-full">
      <div className="overflow-hidden border border-green-900">
        <div
          key={current}
          className={slideClass}
          onAnimationEnd={() => setSlideClass("")}
        >
          <Image
            src={tokenImage(tokenId)}
            alt={formatTokenId(tokenId)}
            width={500}
            height={500}
            className="w-full h-auto"
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

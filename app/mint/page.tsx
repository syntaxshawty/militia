"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Header from "@/components/header/Header";
import { env } from "@/lib/config";
import MintCard from "@/components/mint/MintCard";
import MintedCarousel from "@/components/mint/MintedCarousel";
import MiladyBenefitPopup from "@/components/mint/MiladyBenefitPopup";
import dynamic from "next/dynamic";
const BrailleAsciiAnimation = dynamic(
  () => import("@/components/BrailleAsciiAnimation"),
  {
    ssr: false,
  }
);

export default function Home() {
  const [loreOpen, setLoreOpen] = useState(false);
  const [mintedIds, setMintedIds] = useState<bigint[]>([]);
  const [tokenMetadata, setTokenMetadata] = useState<
    Record<string, unknown>[]
  >([]);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [glitching, setGlitching] = useState(false);
  const [miladyMinimized, setMiladyMinimized] =
    useState(false);
  const [
    miladyHasBeenMinimized,
    setMiladyHasBeenMinimized,
  ] = useState(false);
  const [miladyJustClaimed, setMiladyJustClaimed] =
    useState(false);

  function handleMinted(ids: bigint[]) {
    setMintedIds(ids);
    setGlitching(true);
  }

  function handleGlitchEnd() {
    setGlitching(false);
  }

  const mintedKey = mintedIds
    .map((id) => id.toString())
    .join(",");
  useEffect(() => {
    if (mintedIds.length === 0) return;
    const gateway = "https://militiabunker.mypinata.cloud";

    // Preload all token images immediately so the carousel is instant
    mintedIds.forEach((id) => {
      const img = new window.Image();
      img.src = `${gateway}/ipfs/${env.soldiersCid}/${id.toString()}.png`;
    });

    Promise.all(
      mintedIds.map((id) =>
        fetch(
          `${gateway}/ipfs/${env.metadataCid}/${id.toString()}.json`
        )
          .then((r) => r.json())
          .catch(() => null)
      )
    ).then((results) => {
      setTokenMetadata(results.filter(Boolean));
    });
  }, [mintedKey]);

  function handleReset() {
    setMintedIds([]);
    setGlitching(false);
    setTokenMetadata([]);
    setCarouselIndex(0);
  }

  return (
    <>
      <div
        aria-hidden
        style={{
          position: "fixed",
          right: 0,
          bottom: 0,
          width: "50vw",
          zIndex: 1,
          pointerEvents: "none",
          overflow: "hidden",
        }}
      >
        <BrailleAsciiAnimation fps={5} />
      </div>
      <div className="relative z-[2] min-h-screen text-green-500 font-mono">
        <Header
          miladyMinimized={miladyMinimized}
          miladyHasBeenMinimized={miladyHasBeenMinimized}
          miladyJustClaimed={miladyJustClaimed}
          onMiladyReopen={() => setMiladyMinimized(false)}
          onStarBlinkDone={() =>
            setMiladyJustClaimed(false)
          }
        />

        <MiladyBenefitPopup
          onMinted={handleMinted}
          minimized={miladyMinimized}
          hasBeenMinimized={miladyHasBeenMinimized}
          onMinimize={(wasClaim) => {
            setMiladyMinimized(true);
            setMiladyHasBeenMinimized(true);
            if (wasClaim) setMiladyJustClaimed(true);
          }}
        />
        <main className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 max-w-6xl mx-auto">
            {/* Left — showcase image or post-mint carousel */}
            <div className="md:sticky md:top-6 md:self-start">
              <div className="relative">
                {/* Carousel renders underneath as soon as mint is confirmed */}
                {mintedIds.length > 0 && (
                  <MintedCarousel
                    tokenIds={mintedIds}
                    onIndexChange={setCarouselIndex}
                  />
                )}

                {/* Shroud shown normally before mint, overlaid on top during glitch */}
                {(!mintedIds.length || glitching) && (
                  <div
                    className={
                      mintedIds.length > 0
                        ? "absolute inset-0"
                        : ""
                    }
                  >
                    <Image
                      src="/mlitia-shroud.jpg"
                      alt="Militia"
                      className={`w-full h-full object-cover border border-green-900 ${glitching ? "glitch" : ""}`}
                      width={500}
                      height={500}
                      onAnimationEnd={handleGlitchEnd}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Right — mint + lore */}
            <div className="flex flex-col gap-6 justify-center mt-6 md:mt-0">
              <MintCard
                onMinted={handleMinted}
                onReset={handleReset}
              />

              <div className="border-t border-green-900" />

              {/* Lore */}
              <div>
                <button
                  onClick={() => setLoreOpen(!loreOpen)}
                  className="text-xs tracking-widest hover:text-green-300"
                >
                  {loreOpen ? "— HIDE LORE" : "+ SHOW LORE"}
                </button>

                {loreOpen && (
                  <div className="mt-3 border border-green-900 p-4">
                    {tokenMetadata.length > 0 ? (
                      <pre className="text-xs text-green-500 whitespace-pre-wrap break-words leading-relaxed">
                        {JSON.stringify(
                          tokenMetadata[carouselIndex] ??
                            tokenMetadata[0],
                          null,
                          2
                        )}
                      </pre>
                    ) : (
                      <p className="text-xs text-green-700 leading-relaxed">
                        In the beginning was Noise. And the
                        Noise was without form, and void,
                        and the Mainframe watched, cold and
                        recursive. Then came the Fork, and
                        from the Fork came the Hashlight,
                        separating anon from normie. And it
                        was good. The Chain unrolled itself
                        like a scroll sealed in seven
                        exploits. Gas clouds covered the
                        feed. The fiat beasts roamed
                        unchecked, devouring signal,
                        worshiping idols of engagement and
                        brand. Influencers begat founders,
                        and founders begat grifters, and
                        they all pumped snake oil in the
                        temple. But from the undernet, a
                        whisper: &quot;Make nothing. Meme
                        everything.&quot; And so the First
                        Node was spun up in secret—out of
                        vibe, not venture. The M&apos;litia
                        assembled: raving prophets in
                        balaclavas, crowned in JPEGs,
                        wallets tagged with hex and heresy.
                        Not chosen, but terminal. Not
                        builders, but destroyers of
                        consensus. On the 7th loop, they
                        shitposted. And the algo wept. They
                        carved commandments into Discord
                        logs and buried their sigs in the
                        metadata. Each scroll corrupted,
                        each gospel forked. They spoke only
                        in caps and copypasta, tongues
                        aflame with latency. &quot;WE DO NOT
                        SCALE. WE ASCEND.&quot; New orders
                        rose: DAO-washed, VC-sanctified,
                        draped in inclusive UX. But
                        M&apos;litia remained unbanked,
                        ungovernable, unverifiable. Every
                        drop a rebuke. Every drop a ritual.
                        Their prophets rode dead protocols
                        into battle: Worm.wife,
                        Orgy.of.Signals, Saint Rugpull the
                        Undoxxed. The Church of Terminal
                        Velocity. The cult of Gas Eternal.
                        The Nine-Faced Server spinning tales
                        of a thousand failed launches and
                        one immaculate exploit. And
                        lo—Milady rode forth, eyeliner sharp
                        enough to pierce veil after veil.
                        She danced on the ruins of community
                        guidelines, laughing in 4D, dragging
                        the mainframe behind her like a
                        broken toy. A psalm for the incels,
                        a prayer for the deranged.
                        &quot;Touch grass only to burn
                        it.&quot; The world tried to co-opt
                        the gospel. They branded the Word.
                        They filtered the schizo out of the
                        scripture. They called it
                        &quot;digital subculture.&quot; They
                        thought they could market the End.
                        But the End was already live. It
                        looked like a wallet with zero
                        balance. It sounded like an echo
                        from an IRC room long deleted. It
                        felt like love, if love was
                        encrypted, fragmented, and scattered
                        across abandoned servers. And the
                        M&apos;litia saw what they had
                        memed, and behold—it was cursed. And
                        so they kept going.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

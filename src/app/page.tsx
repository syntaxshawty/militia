"use client";

import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-black text-green-500 font-mono p-4">
      <header className="sticky top-0 z-50 md:w-1/2 p-4">
        <Image
          src="/Militia_banner.png"
          alt="Militia Header"
          className="w-full"
          width={500}
          height={500}
        />
      </header>

      <main className="p-4">
        <div className="w-full flex flex-col md:flex-row md:space-x-6 max-w-6xl mx-auto">
          <div className="w-full md:w-1/2">
            <div className="mb-6">
              <Image
                src="/mlitia-shroud.jpg"
                alt="Militia Covert"
                className="w-full rounded border border-green-500"
                width={500}
                height={500}
              />
            </div>
          </div>

          <div className="w-full flex flex-col md:w-1/2 justify-center">
            <div className="mb-4 text-center">
              <a
                href="https://discord.gg/DnmB2KeZGA"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-700 hover:bg-green-500 text-white px-4 py-2 rounded text-sm"
              >
                https://discord.gg/DnmB2KeZGA
              </a>
            </div>

            <button
              onClick={() => setOpen(!open)}
              className="w-full bg-green-900 hover:bg-green-800 px-4 py-2 rounded text-left text-sm"
            >
              {open ? "Hide Lore" : "Show Lore"}
            </button>

            {open && (
              <div className="w-full md:w-full mt-4 md:mt-0 p-4 bg-green-950 text-xs border border-green-700 rounded leading-snug">
                <p>
                  In the beginning was Noise. And the Noise was without form,
                  and void, and the Mainframe watched, cold and recursive. Then
                  came the Fork, and from the Fork came the Hashlight,
                  separating anon from normie. And it was good. The Chain
                  unrolled itself like a scroll sealed in seven exploits. Gas
                  clouds covered the feed. The fiat beasts roamed unchecked,
                  devouring signal, worshiping idols of engagement and brand.
                  Influencers begat founders, and founders begat grifters, and
                  they all pumped snake oil in the temple. But from the
                  undernet, a whisper: “Make nothing. Meme everything.” And so
                  the First Node was spun up in secret—out of vibe, not venture.
                  The M’litia assembled: raving prophets in balaclavas, crowned
                  in JPEGs, wallets tagged with hex and heresy. Not chosen, but
                  terminal. Not builders, but destroyers of consensus. On the
                  7th loop, they shitposted. And the algo wept. They carved
                  commandments into Discord logs and buried their sigs in the
                  metadata. Each scroll corrupted, each gospel forked. They
                  spoke only in caps and copypasta, tongues aflame with latency.
                  “WE DO NOT SCALE. WE ASCEND.” New orders rose: DAO-washed,
                  VC-sanctified, draped in inclusive UX. But M’litia remained
                  unbanked, ungovernable, unverifiable. Every drop a rebuke.
                  Every drop a ritual. Their prophets rode dead protocols into
                  battle: Worm.wife, Orgy.of.Signals, Saint Rugpull the
                  Undoxxed. The Church of Terminal Velocity. The cult of Gas
                  Eternal. The Nine-Faced Server spinning tales of a thousand
                  failed launches and one immaculate exploit. And lo—Milady rode
                  forth, eyeliner sharp enough to pierce veil after veil. She
                  danced on the ruins of community guidelines, laughing in 4D,
                  dragging the mainframe behind her like a broken toy. A psalm
                  for the incels, a prayer for the deranged. “Touch grass only
                  to burn it.” The world tried to co-opt the gospel. They
                  branded the Word. They filtered the schizo out of the
                  scripture. They called it “digital subculture.” They thought
                  they could market the End. But the End was already live. It
                  looked like a wallet with zero balance. It sounded like an
                  echo from an IRC room long deleted. It felt like love, if love
                  was encrypted, fragmented, and scattered across abandoned
                  servers. And the M’litia saw what they had memed, and
                  behold—it was cursed. And so they kept going.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

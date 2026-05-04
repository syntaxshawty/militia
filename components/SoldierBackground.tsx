"use client";

import { useEffect, useRef, useState } from "react";
import { leanFrames, walkFrames } from "@/lib/soldierFrames";

const FRAME_MS = 200;

export default function SoldierBackground() {
  const [frameIndex, setFrameIndex] = useState(0);
  const [phase, setPhase] = useState<"lean" | "walk">("lean");
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const frames = phase === "lean" ? leanFrames : walkFrames;

    timerRef.current = setInterval(() => {
      setFrameIndex((i) => {
        const next = i + 1;
        if (next >= frames.length) {
          setPhase((p) => (p === "lean" ? "walk" : "lean"));
          return 0;
        }
        return next;
      });
    }, FRAME_MS);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase]);

  const frames = phase === "lean" ? leanFrames : walkFrames;

  return (
    <pre
      aria-hidden
      style={{
        position: "fixed",
        bottom: 0,
        right: 0,
        zIndex: 1,
        pointerEvents: "none",
        overflow: "hidden",
        margin: 0,
        padding: 0,
        fontFamily: "monospace",
        fontSize: "clamp(5.5px, 0.6vw, 9px)",
        lineHeight: 1.15,
        color: "#888888",
        whiteSpace: "pre",
        userSelect: "none",
      }}
    >
      {frames[frameIndex]}
    </pre>
  );
}

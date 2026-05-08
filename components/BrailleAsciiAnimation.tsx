"use client";

import { useEffect, useMemo, useRef } from "react";
import { frames, brailleFrameMeta } from "@/lib/brailleFrames";

const CHAR_WIDTH_RATIO = 0.55; // monospace char width ≈ 0.55× font-size

export default function BrailleAsciiAnimation({ fps = brailleFrameMeta.defaultFps }: { fps?: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const preRef = useRef<HTMLPreElement>(null);

  const renderedFrames = useMemo(() => {
    const { width, height } = brailleFrameMeta;

    // Build one blank-grid template as a flat char array once.
    // rowStride = width chars + 1 newline. No trailing newline on the last row.
    const rowStride = width + 1;
    const totalChars = height * rowStride - 1;
    const base = new Array<string>(totalChars).fill(" ");
    for (let r = 0; r < height - 1; r++) base[(r + 1) * rowStride - 1] = "\n";

    return (frames as [number, number, string][][]).map((frame) => {
      // Slice is faster than re-running Array.from×height for every frame.
      const chars = base.slice();
      for (const [x, y, char] of frame) {
        if (y >= 0 && y < height && x >= 0 && x < width) {
          chars[y * rowStride + x] = char;
        }
      }
      return chars.join("");
    });
  }, []);

  // Responsive font size — ResizeObserver, no per-tick work
  useEffect(() => {
    const container = containerRef.current;
    const pre = preRef.current;
    if (!container || !pre) return;
    const ro = new ResizeObserver(([entry]) => {
      pre.style.fontSize = `${entry.contentRect.width / (brailleFrameMeta.width * CHAR_WIDTH_RATIO)}px`;
    });
    ro.observe(container);
    return () => ro.disconnect();
  }, []);

  // Animation loop: direct textContent mutation, tab-pause, reduced-motion gate
  useEffect(() => {
    const pre = preRef.current;
    if (!pre) return;

    pre.textContent = renderedFrames[0];

    // Honour prefers-reduced-motion — show static first frame only
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let index = 0;
    let timerId: ReturnType<typeof setInterval> | null = null;

    function start() {
      if (timerId !== null) return;
      timerId = setInterval(() => {
        index = (index + 1) % renderedFrames.length;
        pre!.textContent = renderedFrames[index];
      }, 1000 / fps);
    }

    function stop() {
      if (timerId === null) return;
      clearInterval(timerId);
      timerId = null;
    }

    function handleVisibility() {
      document.hidden ? stop() : start();
    }

    start();
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      stop();
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [fps, renderedFrames]);

  return (
    <div ref={containerRef} style={{ width: "100%", overflow: "hidden" }}>
      <pre
        ref={preRef}
        aria-hidden
        style={{
          margin: 0,
          padding: 0,
          background: "transparent",
          color: "white",
          fontFamily:
            'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
          fontSize: "8px",
          lineHeight: "1",
          whiteSpace: "pre",
          overflow: "hidden",
          userSelect: "none",
          textShadow: "0 0 4px white, 0 0 12px rgba(255,255,255,0.6)",
        }}
      />
    </div>
  );
}

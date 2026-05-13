"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const FONT = '"MS Sans Serif", "Microsoft Sans Serif", Tahoma, sans-serif';

const raised = {
  boxShadow:
    "inset -1px -1px #000000, inset 1px 1px #ffffff, inset -2px -2px #808080, inset 2px 2px #dfdfdf",
} as const;

const sunken = {
  boxShadow:
    "inset 1px 1px #000000, inset -1px -1px #ffffff, inset 2px 2px #808080, inset -2px -2px #dfdfdf",
} as const;

export default function LandingPage() {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | false>(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) {
      setError("You cannot be fearless.");
      return;
    }

    setSubmitting(true);
    setError(false);

    try {
      const res = await fetch("/api/fears", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fear: trimmed }),
      });

      if (!res.ok) throw new Error();
      router.push("/mint");
    } catch {
      setError("Idk my bad lol.");
      setSubmitting(false);
    }
  }

  return (
    <div
      style={{
        height: "100vh",
        backgroundImage: "url('/win95-screenshot.png')",
        backgroundSize: "100% 100%",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: FONT,
        cursor: "default",
      }}
    >
      {/* Dialog window */}
      <div
        style={{
          ...raised,
          background: "#c0c0c0",
          padding: "2px",
          width: "50vw",
          height: "80vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Title bar */}
        <div
          style={{
            background: "linear-gradient(to right, #000080, #1084d0)",
            color: "#ffffff",
            padding: "2px 4px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            userSelect: "none",
            marginBottom: 2,
          }}
        >
          <span style={{ fontSize: 11, fontWeight: "bold", letterSpacing: 0 }}>
            MILITIA.EXE
          </span>
          <div style={{ display: "flex", gap: 2 }}>
            {["—", "□", "✕"].map((label) => (
              <span
                key={label}
                style={{
                  ...raised,
                  background: "#c0c0c0",
                  color: "#000000",
                  width: 16,
                  height: 14,
                  fontSize: 9,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "default",
                }}
              >
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* Body */}
        <div
          style={{
            padding: "20px 16px 12px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            flex: 1,
          }}
        >
          <Image
            src="/militia-flicker.gif"
            loading="eager"
            alt=""
            width={300}
            height={300}
            unoptimized
            style={{ imageRendering: "pixelated" }}
          />

          <p
            style={{
              fontSize: 11,
              maxWidth: '50%',
              color: "#000000",
              margin: 0,
              textAlign: "center",
            }}
          >
            Wanderer... whether or not you are lost, lay your fears to rest here. Leave your fears, here, at the gate, to claim your place among the Militia. 
          </p>

          <form
            onSubmit={handleSubmit}
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
            }}
          >
            <input
              type="text"
              value={value}
              autoComplete="off"
              spellCheck={false}
              onChange={(e) => {
                setValue(e.target.value);
                setError(false);
              }}
              style={{
                ...sunken,
                width: "78%",
                background: "#ffffff",
                border: "none",
                padding: "3px 4px",
                fontSize: 11,
                fontFamily: FONT,
                outline: "none",
                color: "#000000",
              }}
            />

            {error && (
              <p style={{ fontSize: 11, color: "#000000", margin: 0 }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              style={{
                ...raised,
                background: "#c0c0c0",
                border: "none",
                padding: "3px 24px",
                fontSize: 11,
                fontFamily: FONT,
                cursor: "default",
                color: submitting ? "#808080" : "#000000",
                minWidth: 75,
                marginTop: 4,
              }}
            >
              {submitting ? "Please wait..." : "OK"}
            </button>
          </form>
        </div>

        {/* Status bar */}
        <div
          style={{
            ...sunken,
            margin: "0 2px 2px",
            padding: "1px 4px",
            fontSize: 10,
            color: "#000000",
          }}
        >
          Ready
        </div>
      </div>
    </div>
  );
}

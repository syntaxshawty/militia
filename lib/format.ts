import { formatEther } from "viem";

/**
 * Formats a wei value as a human-readable ETH string.
 * e.g. 10000000000000000n → "0.01 ETH"
 */
export function formatMintPrice(wei: bigint): string {
  return `${formatEther(wei)} ETH`;
}

/**
 * Formats minted/max supply as a progress string.
 * e.g. formatSupply(123n, 5000n) → "123 / 5000"
 */
export function formatSupply(
  total: bigint,
  cap: bigint
): string {
  return `${total.toString()} / ${cap.toString()}`;
}

/**
 * Returns mint progress as a percentage (0–100), clamped.
 * e.g. formatMintProgress(250n, 5000n) → 5
 */
export function mintProgressPercent(
  total: bigint,
  cap: bigint
): number {
  if (cap === BigInt(0)) return 0;
  return Math.min(100, Number((total * BigInt(100)) / cap));
}

/**
 * Truncates an address for display.
 * e.g. "0x1234567890abcdef..." → "0x1234...cdef"
 */
export function formatAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

/**
 * Formats a token ID for display.
 * e.g. 42n → "#42"
 */
export function formatTokenId(tokenId: bigint): string {
  return `#${tokenId.toString()}`;
}

/**
 * Returns a human-readable countdown string from a unix timestamp (in seconds).
 * Returns null if the timestamp is in the past.
 * e.g. "2d 4h 30m"
 */
export function formatCountdown(
  startTimeSeconds: bigint
): string | null {
  const diffMs =
    Number(startTimeSeconds) * 1000 - Date.now();
  if (diffMs <= 0) return null;

  const totalSeconds = Math.floor(diffMs / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  const parts: string[] = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0 || parts.length === 0)
    parts.push(`${minutes}m`);

  return parts.join(" ");
}

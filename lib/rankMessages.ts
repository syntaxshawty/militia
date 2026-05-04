export const RANKS = ["Mythical", "Martyr", "Marked", "Misfit", "MIA"] as const;
export type Rank = typeof RANKS[number];

// Edit these messages — shown after mint based on the highest rank pulled.
export const RANK_MESSAGES: Record<Rank, string> = {
  Mythical: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Mythical forces converge upon the chosen.",
  Martyr:   "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam. The martyr rises from the ashes of consensus.",
  Marked:   "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quis nostrud exercitation ullamco. The mark is upon you — there is no going back.",
  Misfit:   "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis aute irure dolor in reprehenderit. You never belonged here. That's why you fit.",
  MIA:      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Excepteur sint occaecat cupidatat. Signal lost. Assumed operational.",
};

export function highestRank(ranks: (Rank | null | undefined)[]): Rank | null {
  for (const rank of RANKS) {
    if (ranks.some((r) => r === rank)) return rank;
  }
  return null;
}

function ipfsToHttp(uri: string): string {
  return uri.startsWith("ipfs://")
    ? uri.replace("ipfs://", "https://ipfs.io/ipfs/")
    : uri;
}

export async function fetchTokenRank(tokenUri: string): Promise<Rank | null> {
  try {
    const res = await fetch(ipfsToHttp(tokenUri));
    const json = await res.json();
    const attr = json.attributes?.find(
      (a: { trait_type: string; value: string }) =>
        a.trait_type?.toLowerCase() === "rank"
    );
    if (attr && (RANKS as readonly string[]).includes(attr.value)) {
      return attr.value as Rank;
    }
    return null;
  } catch {
    return null;
  }
}

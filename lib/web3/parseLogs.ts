import { parseEventLogs, zeroAddress, type Log } from "viem";
import { MILITIA_ABI } from "@/lib/web3/abis/militia";

/**
 * Parses transaction receipt logs and returns all token IDs minted in that tx.
 * Handles both individual ERC721 Transfer events and ERC2309 ConsecutiveTransfer
 * batch events, which ERC721A may emit depending on mint quantity.
 */
export function parseMintedTokenIds(logs: Log[]): bigint[] {
  const transferLogs = parseEventLogs({
    abi: MILITIA_ABI,
    eventName: "Transfer",
    logs,
  });

  const singleIds = transferLogs
    .filter((log) => log.args.from === zeroAddress)
    .map((log) => log.args.tokenId);

  const consecutiveLogs = parseEventLogs({
    abi: MILITIA_ABI,
    eventName: "ConsecutiveTransfer",
    logs,
  });

  const consecutiveIds = consecutiveLogs
    .filter((log) => log.args.from === zeroAddress)
    .flatMap((log) => {
      const ids: bigint[] = [];
      for (let id = log.args.fromTokenId; id <= log.args.toTokenId; id++) {
        ids.push(id);
      }
      return ids;
    });

  return [...singleIds, ...consecutiveIds];
}

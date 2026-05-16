"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";

const baseBtn =
  "flex items-center justify-center w-full md:w-auto font-mono text-xs tracking-widest px-4 py-2 transition-colors duration-150";

export default function ConnectWallet() {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        mounted,
      }) => {
        const ready = mounted;
        const connected = ready && account && chain;

        return (
          <div
            className="w-full md:w-auto"
            {...(!ready && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <button
                    onClick={openConnectModal}
                    className={`group relative overflow-hidden border border-green-500 bg-black text-green-400 hover:text-black hover:bg-green-500 ${baseBtn}`}
                  >
                    <span className="relative z-10">
                      &gt; CONNECT_WALLET
                    </span>
                    <span className="relative z-10 inline-block w-[6px] h-[11px] bg-green-400 group-hover:bg-black ml-1 animate-[blink_1s_step-end_infinite]" />
                  </button>
                );
              }

              if (chain.unsupported) {
                return (
                  <button
                    onClick={openChainModal}
                    className={`border border-red-500 bg-black text-red-400 hover:bg-red-500 hover:text-black ${baseBtn}`}
                  >
                    ! WRONG_NETWORK
                  </button>
                );
              }

              return (
                <button
                  onClick={openAccountModal}
                  className={`border border-green-500 bg-black text-green-400 hover:text-black hover:bg-green-500 ${baseBtn}`}
                >
                  [{account.address.slice(0, 25)}...{account.address.slice(-4)}]
                </button>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}

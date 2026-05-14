"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";

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
                    className="group relative font-mono text-xs tracking-widest border border-green-500 bg-black text-green-400 px-4 py-2 overflow-hidden hover:text-black hover:bg-green-500 transition-colors duration-150"
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
                    className="font-mono text-xs tracking-widest border border-red-500 bg-black text-red-400 px-4 py-2 hover:bg-red-500 hover:text-black transition-colors duration-150"
                  >
                    ! WRONG_NETWORK
                  </button>
                );
              }

              return (
                <button
                  onClick={openAccountModal}
                  className="font-mono text-xs tracking-widest border border-green-500 bg-black text-green-400 px-4 py-2 hover:text-black hover:bg-green-500 transition-colors duration-150"
                >
                  [{account.displayName}]
                </button>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}

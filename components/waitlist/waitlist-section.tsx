"use client";

import { Rocket, DiscIcon as Discord, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  useLoginWithOAuth,
  usePrivy,
  useSolanaWallets,
} from "@privy-io/react-auth";
import Image from "next/image";

export default function WaitlistSection() {
  const { wallets, createWallet, ready: walletReady } = useSolanaWallets();
  const { initOAuth } = useLoginWithOAuth({
    onComplete: ({ user }) => {
      console.log("User logged in successfully", user);
      createWallet();
    },
    onError: (error) => {
      console.error("Login failed", error);
    },
  });
  const { authenticated } = usePrivy();
  const desiredWallet = wallets[0]?.address;
  return (
    <section id="waitlist" className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 to-blue-900/30 backdrop-blur-sm"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-purple-900/20 blur-[150px] animate-pulse-slow"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-block px-4 py-2 rounded-full bg-zinc-800/50 backdrop-blur-sm border border-zinc-700 mb-4">
            <span className="text-sm font-medium text-zinc-300 flex items-center gap-2">
              <Rocket className="w-4 h-4 text-purple-400" /> Early Access
            </span>
          </div>

          <h2 className="text-3xl md:text-5xl font-bold mb-6 gradient-text glow-text">
            Join Our Growing Community
          </h2>

          <p className="text-zinc-300 text-lg mb-8">
            Be among the first to experience the future of algorithmic trading
            in DeFi. Join our Discord server to get early access, exclusive
            benefits, and connect with like-minded traders.
          </p>

          <div className="flex justify-center">
            <Button
              variant="outline"
              className="border-zinc-700 text-zinc-300 hover:bg-zinc-800/50 h-12 px-8 text-lg flex items-center gap-2"
              onClick={() =>
                window.open("https://discord.gg/u93QSsPNd6", "_blank")
              }
            >
              <Discord className="w-5 h-5" />
              Join Our Discord
            </Button>
          </div>

          <div className="mt-8 p-5 rounded-xl bg-zinc-800/40 backdrop-blur-sm border border-purple-500/30">
            <h3 className="text-xl font-semibold text-white mb-2">
              Early Adopter Benefits
            </h3>
            {authenticated ? (
              <>
                <div className="mx-auto max-w-md mb-5 mt-3 p-3 bg-gradient-to-r from-purple-600/40 to-blue-600/40 rounded-lg border border-purple-400/50">
                  <h4 className="text-xl font-bold text-white">
                    🎉 Registration Completed!
                  </h4>
                </div>
                <p className="text-zinc-300 mb-4">
                  Stay tuned for updates and exclusive offers. We'll notify you as soon as our platform is ready for early adopters.
                </p>
                {walletReady && desiredWallet ? (
                  <div className="text-zinc-300 px-3 py-2 bg-zinc-800/50 rounded-md flex flex-wrap items-center justify-center max-w-xl mx-auto overflow-hidden">
                    <Image
                      src="/solana.webp"
                      alt="Solana"
                      width={20}
                      height={20}
                      className="mr-2 flex-shrink-0"
                    />
                    <span className="break-all">{desiredWallet}</span>
                  </div>
                ) : (
                  <div className="text-zinc-300 px-3 py-2 bg-zinc-800/50 rounded-md flex items-center justify-center max-w-xs mx-auto">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                  </div>
                )}
              </>
            ) : (
              <>
                <p className="text-zinc-300 mb-4">
                  Join our waitlist to get exclusive access to limited edition
                  NFTs that may unlock special features and benefits in our
                  ecosystem.
                </p>
                <Button
                  className="gradient-button text-white border-0 px-8 py-2 text-lg"
                  onClick={() => initOAuth({ provider: "google" })}
                >
                  Join Waitlist
                </Button>
              </>
            )}
          </div>

          <div className="mt-8 p-4 rounded-lg bg-zinc-800/30 backdrop-blur-sm inline-block">
            <p className="text-zinc-400 text-sm">
              Community-driven • Real-time updates • Priority access for early
              members
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

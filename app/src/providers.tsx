import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { config } from "./wagmi.config";
import { ChainmailProvider } from "./lib/context/ChainmailContext";

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  console.log("config", config);
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <ChainmailProvider>{children}</ChainmailProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

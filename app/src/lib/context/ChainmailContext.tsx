import { createContext, useContext, ReactNode } from "react";
import { abi } from "@/lib/abi/abiChainmail";
import { useAccount, useReadContracts, useWatchContractEvent } from "wagmi";

interface ChainmailContextType {
  activeListings: readonly ListingData[] | undefined;
  ownersListings: readonly ListingData[] | undefined;
  listingsLoading: boolean;
  stakeOfAuthenticity: bigint | undefined;
}

export const ChainmailContext = createContext<ChainmailContextType | null>(
  null
);

export const useChainmail = () => {
  return useContext(ChainmailContext);
};

type ChainmailProviderProps = {
  children: ReactNode;
};

export const ChainmailProvider = ({ children }: ChainmailProviderProps) => {
  const mailMarketPlaceContractConfig = {
    address: import.meta.env.VITE_CHAINMAIL_CONTRACT_ADDRESS as `0x${string}`,
    abi: abi,
  };

  const account = useAccount();
  const address = account?.address;

  const {
    data: listingsResponse,
    isLoading: listingsLoading,
    refetch: refetchListings,
    error: listingsError,
  } = useReadContracts({
    contracts: [
      {
        ...mailMarketPlaceContractConfig,
        functionName: "getActiveListings",
      },
      {
        ...mailMarketPlaceContractConfig,
        functionName: "getOwnersListings",
        args: [address as `0x${string}`],
      },
      {
        ...mailMarketPlaceContractConfig,
        functionName: "getStakeOfAuthenticity",
      },
    ],
  });

  useWatchContractEvent({
    ...mailMarketPlaceContractConfig,
    eventName: "ListingStatusChanged",
    onLogs(logs) {
      refetchListings();
    },
    onError(error) {
      console.error("Listing Status Changed Error:", error);
    },
  });

  const activeListings = listingsResponse?.[0]?.result;
  const ownersListings = listingsResponse?.[1]?.result;
  const stakeOfAuthenticity = listingsResponse?.[2]?.result;

  console.log("activeListings", activeListings);

  return (
    <ChainmailContext.Provider
      value={{
        activeListings,
        ownersListings,
        listingsLoading,
        stakeOfAuthenticity,
      }}
    >
      {children}
    </ChainmailContext.Provider>
  );
};

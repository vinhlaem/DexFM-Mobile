import { LIST_LINK } from "@/constants/ListNetwork";
import {
  ApiResponseTokenSecurity,
  TokenDetail,
  TokenInfo,
} from "@/types/tokenType";
import axios from "axios";

const BASE_URL = "https://dexfmbe.azurewebsites.net/v1";

const NEXT_PUBLIC_DEXSCREENER_API = "https://api.dexscreener.com";

export const getTrandingTokens = async (
  payload: string
): Promise<NonNullable<TokenInfo[]>> => {
  try {
    const response = await axios.get(
      `${BASE_URL}/tokens-trending?network=${payload}`
    );
    return response.data;
  } catch (error) {
    console.log("error getTrandingTokens: ", { error });
    return [];
  }
};

export const getTokenDetail = async (
  payload: any
): Promise<NonNullable<TokenDetail>> => {
  const { token_address, chainId } = payload;

  const response = await axios.get(
    `${NEXT_PUBLIC_DEXSCREENER_API}/tokens/v1/${chainId}/${token_address}`
  );

  return response.data[0];
};

export const getTokenDetailFromCoinGecko = async (
  payload: any
): Promise<NonNullable<TokenDetail>> => {
  const { token_address, chainId } = payload;

  const network = LIST_LINK.find((item) => item.slug === chainId);

  const response_token = await axios.get(
    `https://api.geckoterminal.com/api/v2/networks/${network?.id}/tokens/${token_address}`
  );

  const {
    address,
    name,
    symbol,
    decimals,
    image_url,
    coingecko_coin_id,
    total_supply,
    price_usd,
    fdv_usd,
    total_reserve_in_usd,
    volume_usd,
    market_cap_usd,
  } = response_token.data.data.attributes;

  const { top_pools } = response_token.data.data.relationships;

  const quoteToken = response_token.data.data.id.split("_");
  const pairAddress = top_pools.data[0]?.id.split("_")[1] ?? "";

  console.log(symbol.length, "leght");

  const pairNew: TokenDetail = {
    chainId: network?.slug || "ethereum",
    dexId: "",
    url: "",
    pairAddress: pairAddress,
    baseToken: {
      address: address,
      name: name,
      symbol: symbol,
    },
    quoteToken: {
      address: "",
      name: quoteToken,
      symbol: "",
    },
    priceNative: "",
    priceUsd: price_usd ?? "0",
    txns: {
      m5: {
        buys: 0,
        sells: 0,
      },
      h1: {
        buys: 0,
        sells: 0,
      },
      h6: {
        buys: 0,
        sells: 0,
      },
      h24: {
        buys: 0,
        sells: 0,
      },
    },
    volume: {
      h24: volume_usd.h24,
      h6: 0,
      h1: 0,
      m5: 0,
    },
    priceChange: {
      m5: 0,
      h1: 0,
      h6: 0,
      h24: 0,
    },
    liquidity: {
      usd: 0,
      base: 0,
      quote: 0,
    },
    fdv: fdv_usd,
    pairCreatedAt: 0,
    info: {
      imageUrl: "https://assets.geckoterminal.com/h40rcp5snylcn0nhv3oo0qs2g6nc",
      websites: [
        {
          label: "Website",
          url: "",
        },
        {
          label: "Docs",
          url: "",
        },
      ],
      socials: [
        {
          type: "twitter",
          url: "",
        },
        {
          type: "telegram",
          url: "",
        },
      ],
    },
    marketCap: market_cap_usd,
  };

  return pairNew;
};

export const getTokenSecurity = async (
  address: string,
  chainId: string
): Promise<ApiResponseTokenSecurity> => {
  const res = await axios.get(
    `https://api.gopluslabs.io/api/v1/token_security/${chainId}?contract_addresses=${address}`
  );

  return res?.data;
};

export const getTopTokens = async (): Promise<TokenDetail[]> => {
  try {
    const profilesResponse = await axios.get(
      `${NEXT_PUBLIC_DEXSCREENER_API}/token-profiles/latest/v1`
    );
    const profiles = profilesResponse.data;

    if (!Array.isArray(profiles)) {
      throw new Error("Expected an array from token-profiles API");
    }

    const tokenPromises = profiles.slice(0, 10).map(async (profile: any) => {
      const { chainId, tokenAddress } = profile;

      if (!chainId || !tokenAddress) {
        console.warn(`Missing chainId or tokenAddress in profile:`, profile);
        return [];
      }

      try {
        const tokenResponse = await axios.get(
          `${NEXT_PUBLIC_DEXSCREENER_API}/tokens/v1/${chainId}/${tokenAddress}`
        );
        return Array.isArray(tokenResponse.data)
          ? tokenResponse.data
          : [tokenResponse.data];
      } catch (error) {
        console.error(
          `Error fetching token ${chainId}/${tokenAddress}:`,
          error
        );
        return [];
      }
    });

    const tokenResults = await Promise.all(tokenPromises);

    const validResults = tokenResults
      .flat()
      .filter(
        (result): result is NonNullable<typeof result> => result !== null
      );

    return validResults;
  } catch (error) {
    console.error("Error in getTopTokens:", error);
    return [];
  }
};

export const getSearchTokens = async (
  search: string
): Promise<TokenDetail[]> => {
  const res = await axios.get(
    `${NEXT_PUBLIC_DEXSCREENER_API}/latest/dex/search?q=${search}`
  );
  return res.data.pairs;
};

export interface TokenInfo {
  contract: string; // Contract address
  pair_address: string; // Pair address
  name: string; // Name of the token
  symbolTaget: string; // Target symbol (e.g., SOL)
  symbol: string; // Token symbol
  price: string; // Token price
  dextScore: number; // Dextools score
  intinal_liquidity: number; // Initial liquidity
  liquidity: number; // Current liquidity
  dex: string; // DEX icon URL
  launch_methold: string; // Launch method
  send_telegram: boolean; // Telegram send status
  fdv: number; // Fully Diluted Valuation
  volume: number; // Trading volume
  h1: number; // Price change in the last 1 hour
  h6: number; // Price change in the last 6 hours
  h24: number; // Price change in the last 24 hours
  m5: number; // Price change in the last 5 minutes
  txns: number; // Transaction count
  created_at: string; // Creation date in ISO format
  honeypot: string; // Honeypot status
  chain: string; // Blockchain chain name
  color: string; // Primary color
  color2: string; // Secondary color
  image: string; // Token image URL
  priceChange: {
    h1: number; // Price change in the last 1 hour
    h6: number; // Price change in the last 6 hours
    m5: number; // Price change in the last 5 minutes
    h24: number; // Price change in the last 24 hours
  };
}

// token detail
// Token Information
interface Token {
  address: string;
  name: string;
  symbol: string;
}

// Transaction Details
interface Txns {
  m5: {
    buys: number;
    sells: number;
  };
  h1: {
    buys: number;
    sells: number;
  };
  h6: {
    buys: number;
    sells: number;
  };
  h24: {
    buys: number;
    sells: number;
  };
}

// Volume Details
interface Volume {
  h24: number;
  h6: number;
  h1: number;
  m5: number;
}

// Price Change Details
interface PriceChange {
  m5: number;
  h1: number;
  h6: number;
  h24: number;
}

// Liquidity Details
interface Liquidity {
  usd: number;
  base: number;
  quote: number;
}

// Pair Info
interface PairInfo {
  imageUrl: string;
  header?: string;
  openGraph?: string;
  websites?: {
    label: string;
    url: string;
  }[];
  socials: {
    type: string;
    url: string;
  }[];
}

// Pair Details
export interface TokenDetail {
  chainId: string;
  dexId: string;
  url: string;
  pairAddress: string;
  baseToken: {
    address: string;
    name: string;
    symbol: string;
  };
  quoteToken: {
    address: string;
    name: string;
    symbol: string;
  };
  priceNative: string;
  priceUsd: string;
  txns: {
    m5: {
      buys: number;
      sells: number;
    };
    h1: {
      buys: number;
      sells: number;
    };
    h6: {
      buys: number;
      sells: number;
    };
    h24: {
      buys: number;
      sells: number;
    };
  };
  volume: {
    h24: number;
    h6: number;
    h1: number;
    m5: number;
  };
  priceChange: {
    h24: number;
    h6: number;
    h1: number;
    m5: number;
  };
  liquidity: {
    usd: number;
    base: number;
    quote: number;
  };
  fdv: number;
  marketCap: number;
  pairCreatedAt: number;
  info: {
    imageUrl: string;
    
    websites: websites[];
    socials: socials[];
  };
}

export type websites = {
    label: string;
        url: string;
}
export type socials = {
    type: string;
        url: string;
}

// token sercurity
export type ApiResponseTokenSecurity = {
  message: string;
  result: {
    [key: string]: Resultchildren;
  };
};

export type Resultchildren = {
  anti_whale_modifiable: string;
  buy_tax: string;
  cannot_buy: string;
  cannot_sell_all: string;
  creator_address: string;
  creator_balance: string;
  creator_percent: string;
  dex: DexChildren[];
  external_call: string;
  hidden_owner: string;
  holder_count: string;
  holders: HolderChildren[];
  honeypot_with_same_creator: string;
  is_anti_whale: string;
  is_blacklisted: string;
  is_honeypot: string;
  is_in_dex: string;
  is_mintable: string;
  is_open_source: string;
  is_proxy: string;
  is_whitelisted: string;
  lp_holder_count: string;
  lp_holders: LPHolderChildren[];
  lp_total_supply: string;
  owner_address: string;
  owner_balance: string;
  owner_change_balance: string;
  owner_percent: string;
  personal_slippage_modifiable: string;
  sell_tax: string;
  slippage_modifiable: string;
  token_name: string;
  token_symbol: string;
  total_supply: string;
  trading_cooldown: string;
  transfer_pausable: string;
  can_take_back_ownership: string;
  selfdestruct: string;
  gas_abuse: string;
};

export type DexChildren = {
  name: string;
  liquidity: string;
  pair: string;
};

export type HolderChildren = {
  address: string;
  tag: string;
  is_contract: number;
  balance: string;
  percent: string;
  is_locked: number;
};
export type LPHolderChildren = {
  address: string;
  tag: string;
  is_contract: number;
  balance: string;
  percent: string;
  is_locked: number;
  locked_detail: [
    {
      amount: string;
      end_time: string;
      opt_time: string;
    }
  ];
};

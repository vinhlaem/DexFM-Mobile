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
    header: string;
    openGraph: string;
    websites: {
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
    baseToken: Token;
    quoteToken: Token;
    priceNative: string;
    priceUsd: string;
    txns: Txns;
    volume: Volume;
    priceChange: PriceChange;
    liquidity: Liquidity;
    fdv: number;
    marketCap: number;
    pairCreatedAt: number;
    info: PairInfo;
}

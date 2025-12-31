export const tokenDetails= [
    {
      chainId: "1", 
      dexId: "uniswap_v2",
      url: "https://dexscreener.com/ethereum/0x1234567890abcdef",
      pairAddress: "0x1234567890abcdef1234567890abcdef12345678",
      baseToken: {
        address: "0xabcdef1234567890abcdef1234567890abcdef12",
        name: "Sample Token",
        symbol: "SAMP",
      },
      quoteToken: {
        address: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
        name: "Wrapped Ether",
        symbol: "WETH",
      },
      priceNative: "0.0015",
      priceUsd: "4.50",
      txns: {
        m5: {
          buys: 10,
          sells: 5,
        },
        h1: {
          buys: 50,
          sells: 30,
        },
        h6: {
          buys: 200,
          sells: 150,
        },
        h24: {
          buys: 800,
          sells: 600,
        },
      },
      volume: {
        m5: 5000,
        h1: 25000,
        h6: 100000,
        h24: 500000,
      },
      priceChange: {
        m5: 0.5,
        h1: 2.3,
        h6: -1.2,
        h24: 10.5,
      },
      liquidity: {
        usd: 1000000,
        base: 200000,
        quote: 300,
      },
      fdv: 45000000,
      marketCap: 40000000,
      pairCreatedAt: 1697059200000, 
      info: {
        imageUrl: "https://sampletoken.com/logo.png",
        websites: [
          { label: "Official Website", url: "https://sampletoken.com" },
          { label: "Docs", url: "https://docs.sampletoken.com" },
        ],
        socials: [
          { type: "Twitter", url: "https://twitter.com/sampletoken" },
          { type: "Telegram", url: "https://t.me/sampletoken" },
        ],
      },
    },
    {
      chainId: "56", // Binance Smart Chain
      dexId: "pancakeswap_v2",
      url: "https://dexscreener.com/bsc/0xabcdef1234567890",
      pairAddress: "0xabcdef1234567890abcdef1234567890abcdef12",
      baseToken: {
        address: "0x9876543210fedcba9876543210fedcba98765432",
        name: "Another Token",
        symbol: "ANOT",
      },
      quoteToken: {
        address: "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c",
        name: "Wrapped BNB",
        symbol: "WBNB",
      },
      priceNative: "0.002",
      priceUsd: "0.75",
      txns: {
        m5: {
          buys: 8,
          sells: 3,
        },
        h1: {
          buys: 40,
          sells: 20,
        },
        h6: {
          buys: 150,
          sells: 100,
        },
        h24: {
          buys: 600,
          sells: 450,
        },
      },
      volume: {
        m5: 3000,
        h1: 15000,
        h6: 60000,
        h24: 300000,
      },
      priceChange: {
        m5: -0.2,
        h1: 1.5,
        h6: 3.0,
        h24: -5.0,
      },
      liquidity: {
        usd: 500000,
        base: 500000,
        quote: 1000,
      },
      fdv: 7500000,
      marketCap: 7000000,
      pairCreatedAt: 1706745600000, // February 1, 2024
      info: {
        imageUrl: "https://anothertoken.com/logo.png",
        websites: [
          { label: "Official Website", url: "https://anothertoken.com" },
        ],
        socials: [
          { type: "Twitter", url: "https://twitter.com/anothertoken" },
          { type: "Discord", url: "https://discord.gg/anothertoken" },
        ],
      },
    },
  ];

  //f0196a79-a55f-43a6-978d-adef841e7ab3
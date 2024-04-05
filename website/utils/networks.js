export const networks = {
  zama: {
    chainId: "0x1f49",
    chainName: "Zama Network",
    nativeCurrency: {
      name: "ZAMA",
      symbol: "ZAMA",
      decimals: 18,
    },
    rpcUrls: ["https://devnet.zama.ai"],
    blockExplorerUrls: ["https://main.explorer.zama.ai"],
  },
  mumbai: {
    chainId: "0x13881",
    chainName: "Mumbai",
    nativeCurrency: {
      name: "MATIC",
      symbol: "MATIC",
      decimals: 18,
    },
    rpcUrls: ["https://rpc.ankr.com/polygon_mumbai"],
    blockExplorerUrls: ["https://mumbai.polygonscan.com"],
  },
};

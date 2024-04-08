import { ConnectWalletClient, ConnectPublicClient } from "./client";
import abi from "./abi";
import {
  createWalletClient,
  custom,
  formatEther,
  getContract,
  parseAbi,
} from "viem";
import { polygonMumbai } from "viem/chains";
// import { parseAbiItem } from "viem";
import { isAddressEqual } from "viem";

export const getWriteFunction = async (functionName, args, account) => {
  return ConnectWalletClient().writeContract({
    abi,
    account,
    functionName,
    address: process.env.CONTRACT,
    args,
  });
};

export const getReadFunction = async (functionName, args) => {
  return ConnectPublicClient().readContract({
    address: process.env.CONTRACT,
    abi,
    functionName,
    args,
  });
};

export const getContractInfo = () => {
  return getContract({
    address: process.env.CONTRACT,
    abi,
    publicClient: ConnectPublicClient(),
    walletClient: ConnectWalletClient(),
  });
};

export const createWallet = () => {
  return createWalletClient({
    chain: polygonMumbai,
    transport: custom(window.ethereum),
  });
};

export const getBalanceUser = (address) => {
  return ConnectPublicClient().getBalance({ address });
};

export const waitingTransaction = (hash) => {
  return ConnectPublicClient().waitForTransactionReceipt({
    hash,
  });
};

export const sendTransaction = (value, to, account) => {
  return ConnectWalletClient().sendTransaction({
    to,
    account,
    value,
  });
};

export const parseNumberToEth = (number) => {
  return Number(formatEther(number.toString())).toFixed(2);
};

export const getActualBlock = () => {
  return ConnectPublicClient().getBlockNumber();
};

export const isAddressEq = (addressOne, addressTwo) => {
  return isAddressEqual(addressOne, addressTwo);
};

export const getLogsUser = async (userAddress, contractAddress) => {
  try {
    const blockNumber = BigInt(await getActualBlock());
    const batchSize = BigInt(3000);

    let logs = [];

    const numRequests = Math.ceil(Number(blockNumber) / Number(batchSize));
    console.log("Number request to expect :", numRequests);

    for (let i = 0; i < numRequests; i++) {
      let fromBlock = blockNumber - batchSize * BigInt(i + 1);
      let toBlock = blockNumber - batchSize * BigInt(i);

      if (fromBlock < BigInt(0)) {
        fromBlock = BigInt(0);
      }

      const batchLogs = await ConnectPublicClient().getLogs({
        address: "0x15A40d37e6f8A478DdE2cB18c83280D472B2fC35",
        events: parseAbi([
          "event Approval(address indexed owner, address indexed sender, uint256 value)",
          "event Transfer(address indexed from, address indexed to, uint256 value)",
          "event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)",
        ]),
        fromBlock: fromBlock,
        toBlock: toBlock,
      });

      logs = logs.concat(batchLogs);

      console.log(`Logs saved for request ${i + 1}:`, logs.length);
      if (logs.length >= 10) return logs;
      if (i < numRequests - 1) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    }

    console.log("all logs are saved :", logs);
  } catch (error) {
    console.log(error);
  }
};

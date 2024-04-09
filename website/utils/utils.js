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
/*
const rep = {
  transfer: [{ number: { from: "eeeeee", to: "rrrrrr" } }],
  approval: [{}],
  allowance: [{ sender: number }],
};*/
export const getLogsUser = async (logSave = [], i = 0, blockNumber) => {
  try {
    const batchSize = BigInt(3000);

    const saveLength = logSave.length;

    while (logSave.length < 7) {
      let fromBlock = blockNumber - batchSize * BigInt(i + 1);
      let toBlock = blockNumber - batchSize * BigInt(i);

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

      logSave = logSave.concat(batchLogs);

      console.log(`Logs saved for request ${i + 1}:`, logSave.length);
      i++;

      if (i > 100) {
        console.log("Exceeded maximum iterations.");
        break;
      }

      if (i > 0) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }

      if (logSave.length > saveLength) return { logSave, i, blockNumber };
    }

    console.log("all logs are saved :", logSave);
    return null;
  } catch (error) {
    console.log(error);
  }
};
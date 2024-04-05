import { ConnectWalletClient, ConnectPublicClient } from "./client";
import abi from "./abi";
import { createWalletClient, custom, getContract } from "viem";
import { polygonMumbai } from "viem/chains";

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

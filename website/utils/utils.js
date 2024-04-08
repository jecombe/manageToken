import { ConnectWalletClient, ConnectPublicClient } from "./client";
import abi from "./abi";
import { createWalletClient, custom, decodeEventLog, formatEther, getContract } from "viem";
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

export const parseNumberToEth = (number) => {
  return Number(formatEther(number.toString())).toFixed(2);
};

export const getActualBlock = () => {
  return ConnectPublicClient().getBlockNumber();

}


export const getLogsUser = async (userAddress, contractAddress) => {
 // try {
    /*const blockNumber = await getActualBlock();
    const rep = await ConnectPublicClient().getLogs({
      fromBlock: blockNumber - 20n,
      toBlock: blockNumber
    });

    console.log(rep);

    const topic = decodeEventLog({
      abi,
      data: rep[96].data,
      topics: rep[96].topics
    })
    console.log("sssssssssssssssssssssssssssssssssssssssssssssss", topic);*/

   /* const filter = await ConnectPublicClient().createEventFilter()
    console.log(filter);
const logs = await ConnectPublicClient().getFilterChanges({
  filter, 
})

console.log(logs);
*/


   /*ConnectPublicClient().watchEvent({
      event,
      onLogs: (logs) => {
        console.log("-------------------------> ", logs);
        el.innerHTML = `Logs for NameRegistered at block ${
          logs[0].blockNumber
        }: <pre><code>${stringify(logs, null, 2)}</code></pre>`
      },
    })*/
    
  /*} catch (error) {
    console.log(error);
    
  }*/

}

export const readableLogs = () => {
  client.watchEvent({
    event,
    onLogs: (logs) => {
      /*el.innerHTML = `Logs for NameRegistered at block ${
        logs[0].blockNumber
      }: <pre><code>${stringify(logs, null, 2)}</code></pre>`*/
      console.log(logs);
    },
  })
  

}
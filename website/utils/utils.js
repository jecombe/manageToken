import { ConnectWalletClient, ConnectPublicClient } from "./client";
import abi from "./abi";
import { createWalletClient, custom, decodeEventLog, formatEther, getContract } from "viem";
import { polygonMumbai } from "viem/chains";
import { parseAbiItem } from 'viem'

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
 /* const batchSize = 1000n; // Taille du lot pour la pagination
  const waitTime = 2000; // Temps d'attente entre les requêtes en millisecondes (correspondant à environ 30 requêtes par minute)
  
  let logs = [];
  
  try {
    const fromBlock = BigInt(await getActualBlock()); // Dernier bloc
    const toBlock = 22069112n; // Numéro de bloc de création du contrat
  
    let currentBlock = fromBlock;
  
    while (currentBlock >= toBlock) { // Inverse l'ordre des blocs, partant du dernier bloc vers le bloc de création du contrat
      const fromBlockBatch = currentBlock - batchSize + 1n; // Calcule le premier bloc du lot actuel
  
      const batchLogs = await ConnectPublicClient().getLogs({
        address: "0x15A40d37e6f8A478DdE2cB18c83280D472B2fC35",
        event: parseAbiItem('event Transfer(address indexed, address indexed, uint256)'),
        fromBlock: fromBlockBatch >= toBlock ? fromBlockBatch : toBlock, // Assurez-vous que fromBlockBatch ne devienne pas inférieur à toBlock
        toBlock: currentBlock // Utilisez currentBlock comme toBlock
      });
  
      if (batchLogs.length === 0) {
        console.log("finis");
        break; // Si aucun log n'est retourné, cela signifie que nous avons atteint le bloc de création du contrat
      }
  
      logs = batchLogs.concat(logs); // Utilisez concat pour inverser l'ordre des logs
      console.log(logs);
  
      // Définir le prochain bloc de départ pour la prochaine itération
      currentBlock = fromBlockBatch - 1n;
  
      await new Promise(resolve => setTimeout(resolve, waitTime)); // Attendre avant la prochaine requête pour respecter les limites de taux
    }
  
    return logs;
  } catch (error) {
    console.error(error);
    throw error;
  }*/



  try {
    const info = getContractInfo();
    console.log(info);
  
    const blockNumber = BigInt(await getActualBlock());
    const batchSize = BigInt(3000);
  
    let logs = [];
  
    const numRequests = Math.ceil(Number(blockNumber) / Number(batchSize));
    console.log("Number request to expect :", numRequests);
  
    for (let i = 0; i < numRequests; i++) {
      let fromBlock = blockNumber - batchSize * BigInt(i + 1);
      let toBlock = blockNumber - batchSize * BigInt(i);
  
      // Assurez-vous que fromBlock ne devienne pas inférieur à zéro
      if (fromBlock < BigInt(0)) {
        fromBlock = BigInt(0);
      }
  
      const batchLogs = await ConnectPublicClient().getLogs({
        address: '0x15A40d37e6f8A478DdE2cB18c83280D472B2fC35',
        event: parseAbiItem('event Transfer(address indexed, address indexed, uint256)'),
        fromBlock: fromBlock,
        toBlock: toBlock
      });
  
      logs = logs.concat(batchLogs);
  
      console.log(`Logs saved for request ${i + 1}:`, logs.length);
  
      if (i < numRequests - 1) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
  
    console.log("all logs are saved :", logs);
  } catch (error) {
    console.log(error);
  }




  /*try {
    const blockNumber = await getActualBlock();

    const logs = await ConnectPublicClient().getLogs({  
      address: '0x15A40d37e6f8A478DdE2cB18c83280D472B2fC35',
      event
    : parseAbiItem('event Transfer(address indexed, address indexed, uint256)'),
      args: {
        from: '0xbbbfD02D03D280DCFC682efFbB62b35E95624825',
        to: "0x9B678D348821d48D77a586DAbd1B5C394B4cA5f8"
      },
      fromBlock: blockNumber - 3000n,
      toBlock: blockNumber
    })
    console.log(logs);
  } catch (error) {
    console.log(error);
  }*/
}
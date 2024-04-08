import abi from "./utils/abi.js";
import {
  createWalletClient,
  custom,
  decodeEventLog,
  formatEther,
  getContract,
} from "viem";
import { polygonMumbai } from "viem/chains";
import { parseAbiItem } from "viem";
import { ConnectPublicClient } from "./utils/client.js";

const getActualBlock = () => {
  return ConnectPublicClient().getBlockNumber();
};

const getLogsUser = async (userAddress, contractAddress) => {
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
    const blockNumber = await getActualBlock();

    const batchLogs = await ConnectPublicClient().getLogs({
      address: "0x15A40d37e6f8A478DdE2cB18c83280D472B2fC35",
      event: parseAbiItem(
        "event Transfer(address indexed, address indexed, uint256)"
      ),
      fromBlock: fromBlock - 10000,
      toBlock: fromBlock,
    });

    console.log("all logs are saved :", batchLogs);
  } catch (error) {
    console.log(error);
  }
};
getLogsUser();

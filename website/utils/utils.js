import abi from "./abi";
import { formatEther, isAddressEqual } from "viem";
import _ from "lodash";

const skipAddress = ["0x0000000000000000000000000000000000000000"];

const isAddressSkipped = (address) => {
  return skipAddress.includes(address.toLowerCase()); // Utilisez toLowerCase() pour assurer la comparaison insensible à la casse
};

export const filterAddresses = (addresses) => {
  return skipAddress.includes(addresses);
};

export const parseNumberToEth = (number) => {
  return Number(formatEther(number.toString())).toFixed(2);
};

export const isAddressEq = (addressOne, addressTwo) => {
  console.log(addressOne, addressTwo);
  const isOne = isAddressSkipped(addressOne);
  const isTwo = isAddressSkipped(addressTwo);

  if (!isOne && !isTwo) {
    return isAddressEqual(addressOne, addressTwo);
  }

  return false;
};

export const parseResult = (logs) => {
  return logs.reduce((accumulator, currentLog) => {
    const { args, eventName, blockNumber, transactionHash } = currentLog;

    let parsedLog = {};

    if (eventName === "Transfer") {
      parsedLog = {
        eventName: "transfer",
        from: args.from,
        to: args.to,
        blockNumber: blockNumber.toString(),
        value: parseNumberToEth(args.value),
        transactionHash,
      };
      accumulator.push(parsedLog);
    }

    if (eventName === "Approval") {
      parsedLog = {
        eventName: "approval",
        blockNumber: blockNumber.toString(),
        owner: args.owner,
        sender: args.sender,
        value: parseNumberToEth(args.value),
        transactionHash,
      };
      accumulator.push(parsedLog);
    }
    return accumulator;
  }, []);
};

export const event = [
  "event Approval(address indexed owner, address indexed sender, uint256 value)",
  "event Transfer(address indexed from, address indexed to, uint256 value)",
  "event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)",
];

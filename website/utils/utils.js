import abi from "./abi";
import { formatEther, isAddressEqual } from "viem";
import _ from "lodash";

const skipAddress = ["0x0000000000000000000000000000000000000000"];

export const filterAddresses = (addresses) => {
  return skipAddress.includes(addresses);
};

export const parseNumberToEth = (number) => {
  return Number(formatEther(number.toString())).toFixed(2);
};

export const isAddressEq = (addressOne, addressTwo) => {
  return isAddressEqual(addressOne, addressTwo);
};

export const parseResult = (logs) => {
  return logs.reduce((accumulator, currentLog) => {
    const { args, eventName, blockNumber } = currentLog;

    let parsedLog = {};

    if (eventName === "Transfer") {
      parsedLog = {
        eventName: "transfer",
        from: args.from,
        to: args.to,
        blockNumber: blockNumber.toString(),
        value: parseNumberToEth(args.value),
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

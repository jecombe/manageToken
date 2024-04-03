"use client";
import { useState } from "react";
import { ConnectWalletClient, ConnectPublicClient } from "./client";
import { formatEther, getContract } from "viem";
import abi from "./abi";

export default function WalletButton() {
  const [address, setAddress] = useState(null);
  const [balance, setBalance] = useState(null);
  const [isConnect, setIsConnect] = useState(false);
  const [contractBusd, setContractBusd] = useState(
    "0x15A40d37e6f8A478DdE2cB18c83280D472B2fC35"
  );
  const [totalSupply, setTotalSupply] = useState(null);
  const [contract, setContract] = useState(null);

  async function handleClick() {
    if (isConnect) {
      setIsConnect(false);
      setAddress(null);
      setBalance(null);
      setTotalSupply(null);
      setContract(null);
    } else {
      try {
        const [address] = await ConnectWalletClient().getAddresses();
        const balance = await ConnectPublicClient().getBalance({ address });

        setAddress(address);
        setBalance(balance);
        setIsConnect(true);

        const contract = getContract({
          address: contractBusd,
          abi,
          publicClient: ConnectPublicClient(),
          walletClient: ConnectWalletClient(),
        });

        ConnectPublicClient()
          .readContract({
            address: contractBusd,
            abi,
            functionName: "totalSupply",
          })
          .then((totalSupply) => {
            const totalSupplyInEther = formatEther(totalSupply);
            setTotalSupply(totalSupplyInEther);
          });

        setContract(contract);
      } catch (error) {
        setIsConnect(false);
        alert(`Transaction failed: ${error}`);
      }
    }
  }

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <button
        className="px-8 py-2 rounded-md bg-[#1e2124] flex flex-row items-center justify-center border border-[#1e2124] hover:border hover:border-indigo-600 shadow-md shadow-indigo-500/10"
        onClick={handleClick}
      >
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg"
          alt="MetaMask Fox"
          style={{ width: "25px", height: "25px" }}
        />
        <h1 className="mx-auto">
          {isConnect ? "Disconnect Wallet" : "Connect Wallet"}
        </h1>
      </button>
      {isConnect ? (
        <>
          <Status address={address} balance={balance} />
          <hr style={{ width: "100%", borderTop: "3px solid black" }} />
          <StatusContract contract={contract} totalSupply={totalSupply} />
        </>
      ) : (
        <h1> Need to connect to your metamask</h1>
      )}
    </div>
  );
}

function StatusContract({ contract, totalSupply }) {
  return (
    <div>
      <h1>Busd Informations</h1>
      <h2>Total Supply: {totalSupply} BUSD</h2>
    </div>
  );
}

function Status({ address, balance }) {
  if (address) {
    return (
      <div>
        <h1>Personal informations</h1>
        <h2>Your address {address}</h2>
        <h2>Balance {formatEther(balance.toString())}</h2>
      </div>
    );
  }
}

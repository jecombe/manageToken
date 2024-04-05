"use client";
import { useState, useEffect } from "react";
import { formatEther } from "viem";
import { CircleLoader, PropagateLoader } from "react-spinners";
import Matic from "../matic/matic";
import Usdc from "../usdc/usdc";
import Owner from "../owner/owner";
import { createWallet, getBalanceUser, getReadFunction } from "@/utils/utils";
import { networks } from "@/utils/networks";
import "./wallet.css"; // Importez le fichier CSS pour le style du bouton Metamask

export default function Wallet() {
  const [address, setAddress] = useState(null);

  const [balance, setBalance] = useState(null);
  const [balanceBusd, setBalanceBusd] = useState(null);

  const [isConnect, setIsConnect] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [totalSupply, setTotalSupply] = useState(null);
  const [owner, setOwner] = useState(null);
  const [currentNetwork, setCurrentNetwork] = useState(null);

  const getInfos = async (address) => {
    try {
      const balance = await getBalanceUser(address);

      setAddress(address);
      setBalance(balance);
      setIsConnect(true);

      const totalSupply = await getReadFunction("totalSupply");
      const ownerAddr = await getReadFunction("getOwner");
      const balanceOf = await getReadFunction("balanceOf", [address]);

      setTotalSupply(formatEther(totalSupply));
      setOwner(ownerAddr);
      setBalanceBusd(formatEther(balanceOf));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    checkNetwork();
  }, []);

  const updateBalance = async () => {
    try {
      if (isConnect) {
        console.log("UPDATE BALANCE");
        const balance = await getBalanceUser(address);
        const balanceOf = await getReadFunction("balanceOf", [address]);
        setBalance(balance);
        setBalanceBusd(formatEther(balanceOf));
      }
    } catch (error) {
      console.error("Error updating balances:", error);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(async () => {
      try {
        if (isConnect) {
          updateBalance();
        }
      } catch (error) {
        console.error("Error updating balances:", error);
      }
    }, 60000);

    return () => clearInterval(intervalId);
  }, [isConnect, address]);

  useEffect(() => {
    const handleAccountsChanged = async (accounts) => {
      if (accounts.length === 0) {
        setIsConnect(false);
        setAddress(null);
        setBalance(null);
        setTotalSupply(null);
      } else {
        try {
          setIsLoading(true);
          await getInfos(accounts[0]);
        } catch (error) {
          setIsConnect(false);
          console.error(error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    window.ethereum.on("accountsChanged", handleAccountsChanged);

    return () => {
      window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
    };
  }, []);

  useEffect(() => {
    // Check network when component mounts
    //  checkNetwork();

    // Listen for network changes
    window.ethereum.on("networkChanged", handleNetworkChanged);

    return () => {
      window.ethereum.removeListener("networkChanged", handleNetworkChanged);
    };
  }, []);

  const connectToMumbai = async () => {
    try {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [networks.mumbai],
      });

      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error("Error connecting to Mumbai testnet:", error);
      return error;
    }
  };

  const checkNetwork = async () => {
    if (window.ethereum) {
      try {
        const networkId = await window.ethereum.request({
          method: "eth_chainId",
        });

        if (networkId !== networks.mumbai.chainId) {
          const userResponse = window.confirm(
            "Please switch to Mumbai testnet network to use this application. Do you want to switch now?"
          );

          if (userResponse) {
            await connectToMumbai();
          }
        }
        setCurrentNetwork(networkId);
      } catch (error) {
        console.error("Error checking network:", error);
        return error;
      }
    }
  };

  const handleNetworkChanged = async (networkId) => {
    setCurrentNetwork(networkId);
    checkNetwork();
  };

  const addNetwork = async () => {
    try {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [networks.zama],
      });
    } catch (error) {
      console.error("Error adding network:", error);
    }
  };

  async function handleClick() {
    if (isConnect) {
      setIsConnect(false);
      setAddress(null);
      setBalance(null);
      setTotalSupply(null);
    } else {
      try {
        setIsLoading(true);
        const client = createWallet();
        const [address] = await client.requestAddresses();
        await getInfos(address);
      } catch (error) {
        setIsConnect(false);
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
  }

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <button className="metamask-button" onClick={handleClick}>
        {isLoading ? (
          <CircleLoader color={"#000000"} loading={isLoading} />
        ) : (
          <>
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg"
              alt="MetaMask Fox"
            />
            <span>{isConnect ? "Disconnect Wallet" : "Connect Wallet"}</span>
          </>
        )}
      </button>
      <h2>{address}</h2>
      {console.log(currentNetwork)}
      <button className="zama-devnet-button" onClick={addNetwork}>
        Zama devnet
      </button>

      {isConnect ? (
        <button
          className="refresh-balances-button"
          onClick={updateBalance}
          disabled={isLoading}
        >
          Refresh Balances
        </button>
      ) : (
        ""
      )}

      <hr style={{ width: "100%", borderTop: "3px solid black" }} />

      {isConnect && !isLoading ? (
        <>
          <Owner owner={owner} address={address} />
          <hr style={{ width: "100%", borderTop: "3px solid black" }} />

          <Matic address={address} balance={Math.round(Number(balance))} />
          <hr style={{ width: "100%", borderTop: "3px solid black" }} />
          <Usdc
            totalSupply={Math.round(totalSupply)}
            owner={owner}
            balanceBusd={balanceBusd}
            userAddr={address}
          />
        </>
      ) : (
        <h1> Need to connect to your metamask</h1>
      )}
    </div>
  );
}

"use client";
import { useState, useEffect } from "react";
import { ConnectWalletClient, ConnectPublicClient } from "./client";
import { createWalletClient, custom, formatEther, getContract, parseEther } from "viem";
import { PropagateLoader } from "react-spinners";

import abi from "./abi";
import Status from "./status";
import StatusContract from "./statusContract";
import { polygonMumbai } from "viem/chains";

export default function WalletButton() {
  const [address, setAddress] = useState(null);
  const [balance, setBalance] = useState(null);
  const [balanceBusd, setBalanceBusd] = useState(null);

  const [isConnect, setIsConnect] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [contractBusd, setContractBusd] = useState(
    "0x15A40d37e6f8A478DdE2cB18c83280D472B2fC35"
  );
  const [totalSupply, setTotalSupply] = useState(null);
  const [contract, setContract] = useState(null);
  const [owner, setOwner] = useState(null);
  const [currentNetwork, setCurrentNetwork] = useState(null);

  useEffect(() => {
    checkNetwork();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(async () => {
      try {
        if (isConnect) {
          const balance = await ConnectPublicClient().getBalance({ address });
          const balanceOf = await getCallFunction("balanceOf", [address]);
          setBalance(balance);
          setBalanceBusd(formatEther(balanceOf));
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
        setContract(null);
      } else {
        try {
          setIsLoading(true);
          const address = accounts[0];
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

          const totalSupply = await getCallFunction("totalSupply");
          const ownerAddr = await getCallFunction("getOwner");
          const balanceOf = await getCallFunction("balanceOf", [address]);

          setTotalSupply(formatEther(totalSupply));
          setOwner(ownerAddr);
          setContract(contract);
          setBalanceBusd(formatEther(balanceOf));

          // Check network when account changes
          ///await checkNetwork();
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
  }, [contractBusd]);

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
        params: [
          {
            chainId: "0x13881",
            chainName: "Mumbai",
            nativeCurrency: {
              name: "MATIC",
              symbol: "MATIC",
              decimals: 18,
            },
            rpcUrls: ["https://rpc.ankr.com/polygon_mumbai"],
            blockExplorerUrls: ["https://mumbai.polygonscan.com"],
          },
        ],
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

        if (networkId !== "0x13881") {
          const userResponse = window.confirm(
            "Please switch to Mumbai testnet network to use this application. Do you want to switch now?"
          );

          if (userResponse) {
            await connectToMumbai();
            
          }
        }
        setCurrentNetwork(networkId)

      } catch (error) {
        console.error("Error checking network:", error);
        return error;
      }
    }
  };

  const handleNetworkChanged = async (networkId) => {
    setCurrentNetwork(networkId);
  };

  const addNetwork = async () => {
    try {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: "0x89",
            chainName: "Your Network",
            rpcUrls: ["https://your-rpc-url.com"],
            nativeCurrency: {
              name: "Your Currency",
              symbol: "YOUR",
              decimals: 18,
            },
            blockExplorerUrls: ["https://your-block-explorer-url.com"],
          },
        ],
      });
    } catch (error) {
      console.error("Error adding network:", error);
    }
  };

  const getCallFunction = async (functionName, args) => {
    return ConnectPublicClient().readContract({
      address: contractBusd,
      abi,
      functionName,
      args,
    });
  };

  async function handleClick() {
    if (isConnect) {
      setIsConnect(false);
      setAddress(null);
      setBalance(null);
      setTotalSupply(null);
      setContract(null);
    } else {
      try {
        setIsLoading(true);
        const client = createWalletClient({
          chain: polygonMumbai,
          transport: custom(window.ethereum)
        })

        const [address] = await client.requestAddresses()
        
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

       const totalSupply = await getCallFunction("totalSupply");
        const ownerAddr = await getCallFunction("getOwner");
        const balanceOf = await getCallFunction("balanceOf", [address]);

        setTotalSupply(formatEther(totalSupply));
        setOwner(ownerAddr);
        setContract(contract);
        setBalanceBusd(formatEther(balanceOf));

        // Check network when connecting wallet
      //  await checkNetwork();
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
      <button
        className="px-8 py-2 rounded-md bg-[#1e2124] flex flex-row items-center justify-center border border-[#1e2124] hover:border hover:border-indigo-600 shadow-md shadow-indigo-500/10"
        onClick={handleClick}
      >
        {isLoading ? (
          <PropagateLoader color={"#ffffff"} loading={isLoading} />
        ) : (
          <>
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg"
              alt="MetaMask Fox"
              style={{ width: "25px", height: "25px" }}
            />
            <h1 className="mx-auto">
              {isConnect ? "Disconnect Wallet" : "Connect Wallet"}
            </h1>
          </>
        )}
      </button>
      <h2>{address}</h2>
          {console.log(currentNetwork)}
      {currentNetwork && currentNetwork !== "YOUR_NETWORK_ID" ? (
        <button onClick={addNetwork}>Add Network</button>
      ) : null}


      <hr style={{ width: "100%", borderTop: "3px solid black" }} />

      {isConnect ? (
        <>
          <Status address={address} balance={Math.round(Number(balance))} />
          <hr style={{ width: "100%", borderTop: "3px solid black" }} />

          <span style={{ color: owner === address ? "green" : "red" }}>
            {owner === address ? "you are the owner" : "you are not the owner"}
          </span>
          <StatusContract
            contract={contract}
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

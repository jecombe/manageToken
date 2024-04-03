"use client";
import { useState, useEffect } from "react";
import { ConnectWalletClient, ConnectPublicClient } from "./client";
import { formatEther, getContract } from "viem";
import abi from "./abi";

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

  useEffect(() => {
    const intervalId = setInterval(async () => {
      console.log("update balance");
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
    }, 10000);

    return () => clearInterval(intervalId);
  }, [isConnect, address]);

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
        setIsLoading(true); // Activer le chargement
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

        const totalSupply = await getCallFunction("totalSupply");
        const ownerAddr = await getCallFunction("getOwner");
        const balanceOf = await getCallFunction("balanceOf", [address]);

        setTotalSupply(formatEther(totalSupply));
        setOwner(ownerAddr);
        setContract(contract);
        setBalanceBusd(formatEther(balanceOf));
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
          <div className="loader"></div>
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

const getWriteFunction = async (functionName, args, addressFrom) => {
  return ConnectWalletClient().writeContract({
    abi,
    account: addressFrom,
    functionName,
    address: "0x15A40d37e6f8A478DdE2cB18c83280D472B2fC35",
    args,
  });
};

function StatusContract({
  contract,
  totalSupply,
  owner,
  balanceBusd,
  userAddr,
}) {
  const [mintAmount, setMintAmount] = useState(0);
  const [burnAmount, setBurnAmount] = useState(0);

  const handleMintChange = (event) => {
    setMintAmount(event.target.value);
  };

  const handleMintSubmit = async (event) => {
    event.preventDefault();
    console.log("Mint amount:", mintAmount);
    const ret = await getWriteFunction("mint", [mintAmount], userAddr);
    console.log(ret);
    setMintAmount(0);
  };

  const handleBurnChange = (event) => {
    setBurnAmount(event.target.value);
  };

  const handleBurnSubmit = (event) => {
    event.preventDefault();
    console.log("Burn amount:", mintAmount);
    setBurnAmount(0);
  };

  return (
    <div>
      <h1>Busd Informations</h1>
      <h2>Owner contract: {owner}</h2>
      <h2>Total Supply: {totalSupply} BUSD</h2>
      <h2>Your balance: {balanceBusd} BUSD</h2>

      <div>
        <h2>Transaction</h2>
      </div>

      <div>
        <h2>Mint</h2>
        <form onSubmit={handleMintSubmit}>
          <input type="number" value={mintAmount} onChange={handleMintChange} />
          <button type="submit">Mint</button>
        </form>
        <h2>Burn</h2>
        <form onSubmit={handleBurnSubmit}>
          <input type="number" value={burnAmount} onChange={handleBurnChange} />
          <button type="submit">Burn</button>
        </form>
      </div>
    </div>
  );
}

function Status({ address, balance }) {
  if (address) {
    return (
      <div>
        <h1>Personal informations</h1>
        <h2>Your address: {address}</h2>
        <h2>Balance: {formatEther(balance.toString())} MATIC</h2>
      </div>
    );
  }
}

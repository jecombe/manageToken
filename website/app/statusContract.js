"use client";
import { useState } from "react";
import { ConnectWalletClient, ConnectPublicClient } from "./client";
import { parseEther } from "viem";
import { CircleLoader } from "react-spinners";

const getWriteFunction = async (functionName, args, addressFrom) => {
  return ConnectWalletClient().writeContract({
    abi,
    account: addressFrom,
    functionName,
    address: "0x15A40d37e6f8A478DdE2cB18c83280D472B2fC35",
    args,
  });
};

export default function StatusContract({
  contract,
  totalSupply,
  owner,
  balanceBusd,
  userAddr,
}) {
  const [mintAmount, setMintAmount] = useState(0);
  const [burnAmount, setBurnAmount] = useState(0);
  const [sendAmount, setSendAmount] = useState(0);
  const [recipient, setRecipient] = useState("");
  const [mintLoading, setMintLoading] = useState(false);
  const [burnLoading, setBurnLoading] = useState(false);
  const [sendLoading, setSendLoading] = useState(false);

  const handleMintSubmit = async (event) => {
    event.preventDefault();
    setMintLoading(true);
    console.log("Mint amount:", mintAmount);
    const hash = await getWriteFunction(
      "mint",
      [parseEther(mintAmount)],
      userAddr
    );
    await ConnectPublicClient().waitForTransactionReceipt({
      hash,
    });

    console.log("finish");
    setMintAmount(0);
    setMintLoading(false);
  };

  const handleBurnSubmit = async (event) => {
    event.preventDefault();
    setBurnLoading(true);
    console.log("Burn amount:", burnAmount);
    const hash = await getWriteFunction(
      "burn",
      [parseEther(burnAmount)],
      userAddr
    );
    await ConnectPublicClient().waitForTransactionReceipt({
      hash,
    });

    console.log("finish");
    setBurnAmount(0);
    setBurnLoading(false);
  };

  const handleSendSubmit = async (event) => {
    event.preventDefault();
    setSendLoading(true);
    console.log("Send amount:", sendAmount, "Recipient:", recipient);
    const hash = await getWriteFunction(
      "transfer",
      [recipient, parseEther(sendAmount)],
      userAddr
    );
    await ConnectPublicClient().waitForTransactionReceipt({
      hash,
    });

    console.log("finish");
    setSendAmount(0);
    setRecipient("");
    setSendLoading(false);
  };

  return (
    <div>
      <h1>Busd Informations</h1>
      <h2>Owner contract: {owner}</h2>
      <h2>Total Supply: {totalSupply} BUSD</h2>
      <h2>Your balance: {balanceBusd} BUSD</h2>

      <div>
        <h2>Transactions</h2>
      </div>

      <div>
        <h2>Mint</h2>
        {mintLoading ? (
          <CircleLoader color={"#000000"} loading={mintLoading} />
        ) : (
          <form onSubmit={handleMintSubmit}>
            <input
              type="number"
              value={mintAmount}
              onChange={(event) => setMintAmount(event.target.value)}
            />
            <button type="submit">Mint</button>
          </form>
        )}
        <h2>Burn</h2>
        {burnLoading ? (
          <CircleLoader color={"#000000"} loading={burnLoading} />
        ) : (
          <form onSubmit={handleBurnSubmit}>
            <input
              type="number"
              value={burnAmount}
              onChange={(event) => setBurnAmount(event.target.value)}
            />
            <button type="submit">Burn</button>
          </form>
        )}
        <h2>Send BUSD</h2>
        {sendLoading ? (
          <CircleLoader color={"#000000"} loading={sendLoading} />
        ) : (
          <form onSubmit={handleSendSubmit}>
            <input
              type="text"
              placeholder="Recipient Address"
              value={recipient}
              onChange={(event) => setRecipient(event.target.value)}
            />
            <input
              type="number"
              placeholder="Amount"
              value={sendAmount}
              onChange={(event) => setSendAmount(event.target.value)}
            />
            <button type="submit">Send</button>
          </form>
        )}
      </div>
    </div>
  );
}

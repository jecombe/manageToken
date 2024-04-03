"use client";
import { useState, useEffect } from "react";
import { ConnectWalletClient, ConnectPublicClient } from "./client";
import { formatEther, getContract, parseEther } from "viem";
import { PropagateLoader, CircleLoader } from "react-spinners";
import abi from "./abi";

export default function Status({ address, balance }) {
  const [sendLoading, setSendLoading] = useState(false);

  const [sendAmount, setSendAmount] = useState(0);
  const [addr, setAddr] = useState(0);

  const [recipient, setRecipient] = useState("");

  const getWriteFunction = async (functionName, args, addressFrom) => {
    return ConnectWalletClient().writeContract({
      abi,
      account: addressFrom,
      functionName,
      address: "0x15A40d37e6f8A478DdE2cB18c83280D472B2fC35",
      args,
    });
  };

  const handleSendSubmit = async (event) => {
    event.preventDefault();
    setSendLoading(true);
    try {
      console.log("Send amount:", sendAmount, "Recipient:", recipient);
      const hash = await ConnectWalletClient().sendTransaction({
        to: recipient,
        account: address,
        value: parseEther(sendAmount),
      });
      await ConnectPublicClient().waitForTransactionReceipt({
        hash,
      });

      setSendAmount(0);
      setRecipient("");
      setSendLoading(false);
    } catch (error) {
      console.error(error);
      setSendAmount(0);
      setRecipient("");
      setSendLoading(false);
    }
  };

  if (address) {
    return (
      <div>
        <h1>MATIC</h1>
        <h2>Balance: {formatEther(balance.toString())} MATIC</h2>
        <h2>Send Matic</h2>
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
    );
  }
}

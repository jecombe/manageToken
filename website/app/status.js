import { useState, useEffect } from "react";
import { ConnectWalletClient, ConnectPublicClient } from "./client";
import { formatEther, getContract, parseEther } from "viem";
import { PropagateLoader, CircleLoader } from "react-spinners";

export default function Status({ address, balance }) {
  const [sendLoading, setSendLoading] = useState(false);

  const [sendAmount, setSendAmount] = useState(0);
  const [recipient, setRecipient] = useState("");
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

  if (address) {
    return (
      <div>
        <h1>Matic informations</h1>
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

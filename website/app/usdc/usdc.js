import React, { useState } from "react";
import { parseEther } from "viem";
import { CircleLoader } from "react-spinners";
import "./usdc.css";
import { getWriteFunction, waitingTransaction } from "@/utils/utils";

export default function Usdc({
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
  const [approveAmount, setApproveAmount] = useState(0);
  const [approveRecipient, setApproveRecipient] = useState("");
  const [transferFromAmount, setTransferFromAmount] = useState(0);
  const [transferFromRecipient, setTransferFromRecipient] = useState("");
  const [allowanceAmount, setAllowanceAmount] = useState(0);
  const [allowanceRecipient, setAllowanceRecipient] = useState("");
  const [mintLoading, setMintLoading] = useState(false);
  const [burnLoading, setBurnLoading] = useState(false);
  const [sendLoading, setSendLoading] = useState(false);
  const [approveLoading, setApproveLoading] = useState(false);
  const [transferFromLoading, setTransferFromLoading] = useState(false);
  const [allowanceLoading, setAllowanceLoading] = useState(false);

  const handleMintSubmit = async (event) => {
    event.preventDefault();
    setMintLoading(true);
    console.log("Mint amount:", mintAmount);
    try {
      const hash = await getWriteFunction(
        "mint",
        [parseEther(mintAmount)],
        userAddr
      );
      await waitingTransaction(hash);

      console.log("finish");
      setMintAmount(0);
      setMintLoading(false);
    } catch (error) {
      console.error(error);
      setMintAmount(0);
      setMintLoading(false);
    }
  };

  const handleBurnSubmit = async (event) => {
    event.preventDefault();
    setBurnLoading(true);
    console.log("Burn amount:", burnAmount);
    try {
      const hash = await getWriteFunction(
        "burn",
        [parseEther(burnAmount)],
        userAddr
      );
      await waitingTransaction(hash);

      console.log("finish");
      setBurnAmount(0);
      setBurnLoading(false);
    } catch (error) {
      console.error(error);
      setBurnLoading(false);
      setBurnAmount(0);
    }
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
    await waitingTransaction(hash);

    console.log("finish");
    setSendAmount(0);
    setRecipient("");
    setSendLoading(false);
  };

  const handleApproveSubmit = async (event) => {
    event.preventDefault();
    setApproveLoading(true);
    console.log(
      "Approve amount:",
      approveAmount,
      "Recipient:",
      approveRecipient
    );
    const hash = await getWriteFunction(
      "approve",
      [approveRecipient, parseEther(approveAmount)],
      userAddr
    );
    await waitingTransaction(hash);

    console.log("finish");
    setApproveAmount(0);
    setApproveRecipient("");
    setApproveLoading(false);
  };

  const handleTransferFromSubmit = async (event) => {
    event.preventDefault();
    setTransferFromLoading(true);
    console.log(
      "TransferFrom amount:",
      transferFromAmount,
      "Recipient:",
      transferFromRecipient
    );
    const hash = await getWriteFunction(
      "transferFrom",
      [userAddr, transferFromRecipient, parseEther(transferFromAmount)],
      userAddr
    );
    await waitingTransaction(hash);

    console.log("finish");
    setTransferFromAmount(0);
    setTransferFromRecipient("");
    setTransferFromLoading(false);
  };

  const handleAllowanceSubmit = async (event) => {
    event.preventDefault();
    setAllowanceLoading(true);
    console.log(
      "Allowance amount:",
      allowanceAmount,
      "Recipient:",
      allowanceRecipient
    );
    const hash = await getWriteFunction(
      "allowance",
      [userAddr, allowanceRecipient, parseEther(allowanceAmount)],
      userAddr
    );
    await waitingTransaction(hash);

    console.log("finish");
    setAllowanceAmount(0);
    setAllowanceRecipient("");
    setAllowanceLoading(false);
  };

  return (
    <>
      <div>
        <h1>BUSD</h1>
        <h2>Contract: {process.env.CONTRACT}</h2>
        <h2>Owner: {owner}</h2>
        <h2>Total Supply: {totalSupply} BUSD</h2>
        <h2>Balance: {balanceBusd} BUSD</h2>{" "}
      </div>
      <div className="usdc-container">
        <div className="transaction-section">
          <div className="mint-section">
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
          </div>

          <div className="burn-section">
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
          </div>

          <div className="send-section">
            <h2>Send</h2>
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

          <div className="approve-section">
            <h2>Approve</h2>
            {approveLoading ? (
              <CircleLoader color={"#000000"} loading={approveLoading} />
            ) : (
              <form onSubmit={handleApproveSubmit}>
                <input
                  type="number"
                  value={approveAmount}
                  onChange={(event) => setApproveAmount(event.target.value)}
                />
                <input
                  type="text"
                  placeholder="Recipient Address"
                  value={approveRecipient}
                  onChange={(event) => setApproveRecipient(event.target.value)}
                />
                <button type="submit">Approve</button>
              </form>
            )}
          </div>

          <div className="transfer-from-section">
            <h2>Transfer From</h2>
            {transferFromLoading ? (
              <CircleLoader color={"#000000"} loading={transferFromLoading} />
            ) : (
              <form onSubmit={handleTransferFromSubmit}>
                <input
                  type="number"
                  value={transferFromAmount}
                  onChange={(event) =>
                    setTransferFromAmount(event.target.value)
                  }
                />
                <input
                  type="text"
                  placeholder="Recipient Address"
                  value={transferFromRecipient}
                  onChange={(event) =>
                    setTransferFromRecipient(event.target.value)
                  }
                />
                <button type="submit">Transfer From</button>
              </form>
            )}
          </div>

          <div className="allowance-section">
            <h2>Allowance</h2>
            {allowanceLoading ? (
              <CircleLoader color={"#000000"} loading={allowanceLoading} />
            ) : (
              <form onSubmit={handleAllowanceSubmit}>
                <input
                  type="number"
                  value={allowanceAmount}
                  onChange={(event) => setAllowanceAmount(event.target.value)}
                />
                <input
                  type="text"
                  placeholder="Recipient Address"
                  value={allowanceRecipient}
                  onChange={(event) =>
                    setAllowanceRecipient(event.target.value)
                  }
                />
                <button type="submit">Allowance</button>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
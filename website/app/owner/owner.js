import React, { useState } from "react";
import "./owner.css";
import { getWriteFunction, waitingTransaction } from "@/utils/utils";

export default function Owner({ owner, address }) {
  const [newOwnerAddress, setNewOwnerAddress] = useState("");

  const renounceOwnership = async () => {
    try {
      const hash = await getWriteFunction("renounceOwnership", [], address);
      await waitingTransaction(hash);

      console.log("Ownership renounced successfully");
    } catch (error) {
      console.error("Error while renouncing ownership:", error);
    }
  };

  const transferOwnership = async () => {
    try {
      const hash = await getWriteFunction(
        "transferOwnership",
        [newOwnerAddress],
        address
      );
      await waitingTransaction(hash);

      console.log("Ownership transferred successfully");
    } catch (error) {
      console.error("Error while transferring ownership:", error);
    }
  };

  const handleNewOwnerAddressChange = (event) => {
    setNewOwnerAddress(event.target.value);
  };

  return (
    <>
      <span style={{ color: owner === address ? "green" : "red" }}>
        {owner === address ? (
          <div className="owner-container">
            {owner === address && (
              <div className="action-section">
                <input
                  type="text"
                  value={newOwnerAddress}
                  onChange={handleNewOwnerAddressChange}
                  placeholder="New Owner Address"
                />
                <button className="transfer-button" onClick={transferOwnership}>
                  Transfer Ownership
                </button>
                <button className="renounce-button" onClick={renounceOwnership}>
                  Renounce Ownership
                </button>
              </div>
            )}
          </div>
        ) : (
          "You are not the owner"
        )}
      </span>
    </>
  );
}

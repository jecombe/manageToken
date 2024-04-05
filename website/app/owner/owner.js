import React, { useState } from "react";
import { ConnectWalletClient, ConnectPublicClient } from "../../utils/client";
import abi from "../../utils/abi";
import "./owner.css"; // Import du fichier de style CSS

export default function Owner({ owner, address }) {
  const [newOwnerAddress, setNewOwnerAddress] = useState("");

  const getWriteFunction = async (functionName, args, addressFrom) => {
    return ConnectWalletClient().writeContract({
      abi,
      account: addressFrom,
      functionName,
      address: "0x15A40d37e6f8A478DdE2cB18c83280D472B2fC35",
      args,
    });
  };

  const renounceOwnership = async () => {
    try {
      const hash = await getWriteFunction("renounceOwnership", [], address);
      await ConnectPublicClient().waitForTransactionReceipt({
        hash,
      });

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
      await ConnectPublicClient().waitForTransactionReceipt({
        hash,
      });

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
        {owner === address ? "You are the owner" : "You are not the owner"}
      </span>
      <div className="owner-container">
        {owner !== address && (
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
    </>
  );
}

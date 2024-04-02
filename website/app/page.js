"use client";

import styles from "./page.module.css";
import { useState, useEffect, useRef, useCallback } from "react";

export default function Home() {
  const [accountBalance, setAccountBalance] = useState(0);
  const [accountToken, setAccountToken] = useState(0);

  const [account, setAccount] = useState("0x");

  const checkNetwork = async () => {
    if (window.ethereum) {
      try {
        const networkId = await window.ethereum.request({
          method: "eth_chainId",
        });
        if (networkId !== "0x13881") {
          const userResponse = window.confirm(
            "Please switch to Mumbai Testnet network to use this application. Do you want to switch now?"
          );

          if (userResponse) {
            //   await connectToZamaDevnet();
            // const { sign, contract } = await getSignerContract();
            // await initializeContract(sign, contract);
          }
        }
      } catch (error) {
        console.error("Error checking network:", error);
        return error;
      }
    } else {
      console.log("NOOOO");
    }
  };

  const handleAccountsChanged = async () => {
    checkNetwork();
    // setBalanceSPC(0);
    // setAccountAddress("0x");
    // await initialize();
    // await manageData();
  };

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        window.ethereum.on("accountsChanged", handleAccountsChanged);
      }
      await checkNetwork();
    };

    init();
    return () => {
      // Cleanup the subscription when the component unmounts
      if (window.ethereum) {
        window.ethereum.off("accountsChanged", handleAccountsChanged);
      }
    };
  }, []);

  return (
    <main className={styles.main}>
      <div className={styles.description}></div>
    </main>
  );
}

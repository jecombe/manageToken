import styles from "./page.module.css";
import WalletButton from "./walletButton";

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <h1>Connect wallet</h1>
        <WalletButton />
      </div>
    </main>
  );
}

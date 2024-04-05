import styles from "./page.module.css";
import Wallet from "./wallet/wallet";

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <h1>Manage Token BUSD</h1>
        <Wallet />
      </div>
    </main>
  );
}

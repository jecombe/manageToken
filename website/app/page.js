import Wallet from "./wallet/wallet";
import "./page.css"; // Importez le fichier CSS pour le style du bouton Metamask

export default function Home() {
  return (
    <main>
      <div className="description">
        <h1 className="title">Manage Tooken BUSD</h1>
        <Wallet />
      </div>
    </main>
  );
}

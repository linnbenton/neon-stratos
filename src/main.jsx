import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

import { Buffer } from "buffer";
window.Buffer = Buffer;

import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";

import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";

import "@solana/wallet-adapter-react-ui/styles.css";

const network = WalletAdapterNetwork.Mainnet;

const endpoint = "https://rpc.ankr.com/solana";

const wallets = [new PhantomWalletAdapter({ network })];

ReactDOM.createRoot(document.getElementById("root")).render(
  <ConnectionProvider endpoint={endpoint}>
    <WalletProvider wallets={wallets} autoConnect>
      <WalletModalProvider>
        <App />
      </WalletModalProvider>
    </WalletProvider>
  </ConnectionProvider>,
);

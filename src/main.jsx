import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

import { AppProvider } from "./state/appStore.jsx";
import { MarketProvider } from "./state/marketStore.jsx";

import { Buffer } from "buffer";
window.Buffer = Buffer;

import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";

import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";

import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";

import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";

import "@solana/wallet-adapter-react-ui/styles.css";

const network = WalletAdapterNetwork.Mainnet;

const endpoint = import.meta.env.VITE_RPC_URL;

const wallets = [new PhantomWalletAdapter()];

ReactDOM.createRoot(document.getElementById("root")).render(
  <ConnectionProvider endpoint={endpoint}>
    <WalletProvider wallets={wallets} autoConnect>
      <WalletModalProvider>
        <AppProvider>
          <MarketProvider>
            <App />
          </MarketProvider>
        </AppProvider>
      </WalletModalProvider>
    </WalletProvider>
  </ConnectionProvider>,
);

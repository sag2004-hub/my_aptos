import React, { useState } from "react";
import {
  AptosWalletAdapterProvider,
  useWallet,
} from "@aptos-labs/wallet-adapter-react";
import { PetraWallet } from "petra-plugin-wallet-adapter";
import { AptosClient } from "aptos";

const NODE_URL = "https://fullnode.devnet.aptoslabs.com/v1";
const client = new AptosClient(NODE_URL);
const MODULE_ADDRESS =
  "0x4a89f27821a779f01fc085e8264ae50437f76a53c671109351201b313c3db05b"; // Replace with your own address if needed

function WalletComponent() {
  const { account, connect, disconnect, signAndSubmitTransaction } = useWallet();
  const [recipient, setRecipient] = useState("");
  const [txHash, setTxHash] = useState("");
  const [error, setError] = useState("");

  const handleTransfer = async () => {
    setError("");
    if (!account || !recipient) {
      setError("Wallet not connected or recipient missing");
      return;
    }

    const payload = {
      type: "entry_function_payload",
      function: `${MODULE_ADDRESS}::my_token::transfer`,
      type_arguments: [],
      arguments: [recipient, "100000"], // Send 100000 MyToken units
    };

    try {
      const response = await signAndSubmitTransaction(payload);
      await client.waitForTransaction(response.hash);
      setTxHash(response.hash);
    } catch (err) {
      console.error("Transfer failed:", err);
      setError("Transfer failed: " + err.message);
    }
  };

  const displayAddress =
    typeof account?.address === "object"
      ? account.address.data
      : account?.address;

  return (
    <div style={{ padding: "30px", fontFamily: "Arial" }}>
      {!account ? (
        <button onClick={() => connect("Petra")}>Connect Petra Wallet</button>
      ) : (
        <>
          <p>
            Connected Address:{" "}
            <strong>{displayAddress}</strong>
          </p>
          <button onClick={disconnect}>Disconnect</button>

          <div style={{ marginTop: 20 }}>
            <input
              type="text"
              placeholder="Recipient address"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              style={{
                width: "400px",
                padding: "10px",
                fontSize: "16px",
              }}
            />
            <br /><br />
            <button onClick={handleTransfer}>Transfer MyToken</button>
          </div>

          {txHash && (
            <p style={{ marginTop: 20 }}>
              ✅ Tx Hash:{" "}
              <a
                href={`https://explorer.aptoslabs.com/txn/${txHash}?network=devnet`}
                target="_blank"
                rel="noreferrer"
              >
                {txHash}
              </a>
            </p>
          )}
          {error && <p style={{ color: "red", marginTop: 10 }}>{error}</p>}
        </>
      )}
    </div>
  );
}

function App() {
  return (
    <AptosWalletAdapterProvider plugins={[new PetraWallet()]} autoConnect={false}>
      <WalletComponent />
    </AptosWalletAdapterProvider>
  );
}

export default App;

import React, { Fragment, useEffect, useState } from "react";
import squirrelImg from "./assets/rinkeby_squirrels.gif";
import { ethers } from "ethers";
import "./App.css";
import contract from "./contracts/NFTCollectible.json";
import Footer from "./components/Footer";
import Header from "./components/Header";

const openseaLink =
  "https://testnets.opensea.io/collection/nft-collectible-565yxxugi0";
const contractAddress = "0x0F6C18eCFD6fF232F4e88831c9a2b7b3bf1ea986";
const abi = contract.abi;

function App() {
  const [currentAccount, setCurrentAccount] = useState<any>(null);
  const [metamaskError, setMetamaskError] = useState<boolean | null>(null);
  const [mineStatus, setMineStatus] = useState<string | null>(null);

  const checkWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have MetaMask installed!");
      return;
    } else {
      console.log("Wallet exists! We're ready to go!");
    }

    const accounts = await ethereum.request!({ method: "eth_accounts" });
    const network = await ethereum.request!({ method: "eth_chainId" });

    if (accounts.length !== 0 && network.toString() === "0x13881") {
      const account = accounts[0];
      console.log("Found an authorized account: ", account);
      setMetamaskError(false);
      setCurrentAccount(account);
    } else {
      setMetamaskError(true);
      console.error("No authorized account found");
    }
  };

  const connectWalletHandler = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      alert("Please install MetaMask!");
    }

    try {
      const network = await ethereum.request!({ method: "eth_chainId" });

      if (network.toString() === "0x13881") {
        const accounts = await ethereum.request!({
          method: "eth_requestAccounts",
        });
        console.log("Found an account! Address: ", accounts[0]);
        setMetamaskError(false);
        setCurrentAccount(accounts[0]);
        return;
      }

      setMetamaskError(true);
    } catch (err) {
      console.error(err);
    }
  };

  const mintNftHandler = async () => {
    try {
      setMineStatus("mining");

      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const nftContract = new ethers.Contract(contractAddress, abi, signer);

        console.log("Initialize payment");
        let nftTxn = await nftContract.mintNFTs(1, {
          value: ethers.utils.parseEther("0.01"),
        });

        console.log("Mining... please wait");
        await nftTxn.wait();

        console.log(`Mined, see transaction: ${nftTxn.hash}`);
        setMineStatus("Succeeded!!");
      } else {
        setMineStatus("error...");
        console.error("Ethereum object does not exist");
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    checkWalletIsConnected();

    if (window.ethereum) {
      window.ethereum.on("chainChanged", (_) => window.location.reload());
    }
  }, []);

  const renderNotConnectedContainer = () => (
    <button
      onClick={connectWalletHandler}
      className="cta-button connect-wallet-button"
    >
      Connect to Wallet
    </button>
  );

  const renderMintUI = () => {
    return (
      <button
        onClick={mintNftHandler}
        className="cta-button connect-wallet-button"
      >
        Mint a Polygon Squirrel NFT
      </button>
    );
  };

  return (
    <Fragment>
      {metamaskError && (
        <div className="metamask-error">
          Metamask から Polygon Testnet に接続してください!
        </div>
      )}
      <div className="App">
        <div className="container">
          <Header opensea={openseaLink} />
          <div className="header-container">
            <div className="flex justify-center items-center mb-12">
              <img
                src={squirrelImg}
                className="max-h-60"
                alt="Polygon Squirrels"
              />
            </div>
            {currentAccount && mineStatus !== "mining" && renderMintUI()}
            {!currentAccount && !mineStatus && renderNotConnectedContainer()}
            <div className="mine-submission">
              {mineStatus === "success" && (
                <div className={mineStatus}>
                  <p>NFT minting successful!</p>
                  <p className="success-link">
                    <a
                      href={`https://testnets.opensea.io/${currentAccount}/`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Click here
                    </a>
                    <span> to view your NFT on OpenSea.</span>
                  </p>
                </div>
              )}
              {mineStatus === "mining" && (
                <div className={mineStatus}>
                  <div className="loader" />
                  <span>Transaction is mining</span>
                </div>
              )}
              {mineStatus === "error" && (
                <div className={mineStatus}>
                  <p>
                    Transaction failed. Make sure you have at least 0.01 MATIC
                    in your Metamask wallet and try again.
                  </p>
                </div>
              )}
            </div>
          </div>
          {currentAccount && (
            <div className="show-user-address">
              <p>
                Your address being connected: &nbsp;
                <br />
                <span>
                  <a className="user-address" target="_blank" rel="noreferrer">
                    {currentAccount}
                  </a>
                </span>
              </p>
            </div>
          )}
          <Footer address={contractAddress} />
        </div>
      </div>
    </Fragment>
  );
}

export default App;

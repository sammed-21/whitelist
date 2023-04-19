import Head from "next/head";
import Image from "next/image";
import Web3Modal from "web3modal";
import { Contract, providers } from "ethers";
import { useState, useEffect, useRef } from "react";
import { Inter, Turret_Road } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { abi, WHITELIST_CONTRACT_ADDRESS } from "@/constants";
// import { walletconnect } from "web3modal/dist/providers/connectors";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [numberOfWhitelisted, setNumberOfWhitelisted] = useState(0);
  const [walletConnected, setWalletConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [joinedWhitelist, setJoinedWhitelist] = useState();
  const web3ModalRef = useRef();

  const getProviderOrSigner = async (needSinger = false) => {
    try {
      const provider = await web3ModalRef.current.connect();
      const web3Provider = new providers.Web3Provider(provider);
      const { chainId } = await web3Provider.getNetwork();
      if (chainId != 11155111) {
        window.alert("change the network to sepolia");
        throw new Error("change the netwok to sepolia");
      }
      if (needSinger) {
        const signer = web3Provider.getSigner();
        return signer;
      }
      return web3Provider;
    } catch (error) {
      console.error(error.message);
    }
  };
  const checkIfAddressIsWhitelisted = async () => {
    try {
      const signer = await getProviderOrSigner(true);
      const whitelistContract = new Contract(
        WHITELIST_CONTRACT_ADDRESS,
        abi,
        signer
      );
      // Get the address associated to the signer which is connected to  MetaMask
      const address = await signer.getAddress();
      // call the whitelistedAddresses from the contract
      const _joinedWhitelist = await whitelistContract.whitelistedAddresses(
        address
      );
      setJoinedWhitelist(_joinedWhitelist);
    } catch (error) {
      console.error(error.message);
    }
  };
  const getNumberOfWhitelisted = async () => {
    try {
      const provider = await getProviderOrSigner();

      const whitelistContract = new Contract(
        WHITELIST_CONTRACT_ADDRESS,
        abi,
        provider
      );
      // call the numAddressesWhitelisted from the contract
      const _numberOfWhitelisted =
        await whitelistContract.numAddressesWhitelisted();
      setNumberOfWhitelisted(_numberOfWhitelisted);
    } catch (error) {
      console.error(error.message);
    }
  };
  const addAddressToWhitelist = async () => {
    try {
      const signer = await getProviderOrSigner(true);
      // Create a new instance of the Contract with a Signer, which allows
      // update methods
      const whitelistContract = new Contract(
        WHITELIST_CONTRACT_ADDRESS,
        abi,
        signer
      );
      // call the addAddressToWhitelist from the contract
      const tx = await whitelistContract.addAddressToWhitelist();
      setLoading(true);
      // wait for the transaction to get mined
      await tx.wait();
      setLoading(false);
      // get the updated number of addresses in the whitelist
      await getNumberOfWhitelisted();
      setJoinedWhitelist(true);
    } catch (error) {
      console.error(error.message);
    }
  };
  const renderButton = () => {
    if (walletConnected) {
      if (joinedWhitelist) {
        return <div className={styles.description}>thank for joining</div>;
      } else if (loading) {
        <button className={styles.button}>loading ...</button>;
      } else {
        return (
          <button onClick={addAddressToWhitelist} className={styles.button}>
            join whitelist
          </button>
        );
      }
    } else {
      <button onClick={connectWallet} className={styles.button}>
        connect your wallet
      </button>;
    }
  };
  const connectWallet = async () => {
    try {
      await getProviderOrSigner();
      setWalletConnected(true);
      checkIfAddressIsWhitelisted();
      getNumberOfWhitelisted();
    } catch (error) {
      console.error(error.message);
    }
  };
  useEffect(() => {
    if (!walletConnected) {
      web3ModalRef.current = new Web3Modal({
        network: "sepolia",
        providerOptions: {},
        disabledInjectedProvider: false,
      });
      connectWallet();
    }
  }, [walletConnected]);
  return (
    <div>
      <Head>
        <title>whitelist dapp</title>
        <meta name="description" content="whitelist-dapp" />
      </Head>
      <div className={styles.main}>
        <div>
          <h1 className={styles.title}>Welcome to whitelist!</h1>

          <div className={styles.description}>
            Nft collection for developers
          </div>

          <div className={styles.description}>
            {numberOfWhitelisted} have already joined the whitelist
          </div>
          {renderButton()}
        </div>
        <div>
          <img className={styles.image} src="./crypto-devs.svg" />
        </div>
      </div>
      <footer className={styles.footer}></footer>
    </div>
  );
}

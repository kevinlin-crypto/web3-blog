import { useState } from 'react'
import '../styles/globals.css'

import Web3Modal from "web3modal";
import WalletConnectProvider from '@walletconnect/web3-provider';
import { ethers } from "ethers";
import { css } from "@emotion/css";
import Link from 'next/link';
import { ownerAddress } from '../config';
import { AccountContext } from '../context';

import "easymde/dist/easymde.min.css";

function MyApp({ Component, pageProps }) {

  /** Create local state to save account information after signin */
  const [account, setAccount] = useState(null);

  /** Web3Modal configuration for enabling wallet access */
  async function getWeb3Modal() {
    const web3Modal = new Web3Modal({
      network: "mainnet",
      cacheProvider: false,
      providerOptions: {
        walletconnect: {
          package: WalletConnectProvider,
          options: {
            infuraId: process.env.NEXT_PUBLIC_INFURA_ID
          }
        }
      }
    });

    return web3Modal;
  }

  /** Connect function uses web3 modal to conect to the user's wallet */
  async function connect() {
    try {
      const web3Modal = await getWeb3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const accounts = await provider.listAccounts();
      setAccount(accounts[0]);
    } catch (err) {
      console.log("error:", err);
    }
  }

  return (
    <div>
      <nav className={nav}>
        <div className={header}>
          <Link href="/">
            <a>
              <img
                src='/logo.svg'
                alt='React logo'
                style={{ width: '50px' }}
              />
            </a>
          </Link>
          <Link href='/'>
            <a>
              <div className={titleContainer}>
                <h2 className={title}>Full Stack</h2>
                <p className={description}>WEB3</p>
              </div>
            </a>
          </Link>
          {
            !account && (
              <div className={buttonContainer}>
                <button className={buttonStyle} onClick={connect}>Connect</button>
              </div>
            )
          }
          {
            account && <p className={accountInfo}>{account}</p>
          }
        </div>
        <div className={linkContainer}>
          <Link href='/'>
            <a className={link}>
              Home
            </a>
          </Link>
          {
            /** If the signed in user is the contract owner, we show the nav link to create a new post */
            (account === ownerAddress) && (
              <Link href="/create-post">
                <a className={link}>
                  Create Post
                </a>
              </Link>
            )
          }
        </div>
      </nav>
      <div className={container}>
          <AccountContext.Provider value={account}>
            <Component {...pageProps} connect={connect}/>
          </AccountContext.Provider>
      </div>
    </div>
  );
}

const nav = css`
  background-color: white;
`

const header = css`
  display: flex;
  border-bottom: 1px solid rgba(0, 0, 0, 0.75);
  padding: 20px 30px;
`

const titleContainer = css`
  display: flex;
  flex-direction: column;
  padding-left: 15px;
`

const title = css`
  margin-left: 30px;
  font-weight: 500;
  margin: 0;
`

const description = css`
  margin: 0;
  color: #999;
`

const buttonContainer = css`
  width: 100%;
  display: flex;
  flex: 1;
  justify-content: flex-end;
`

const buttonStyle = css`
  background-color: #fafafa;
  outline: none;
  border: none;
  font-size: 18px;
  padding: 16px 70px;
  border-radius: 15px;
  cursor: pointer;
  box-shadow: 7px 7px rgba(0, 0, 0, 0.1);
`

const accountInfo = css`
  width: 100%;
  display: flex;
  flex: 1;
  justify-content: flex-end;
  font-size: 12px;
`

const linkContainer = css`
  padding: 30px 60px;
  background-color: #fafafa;
`

const link = css`
  margin: 0 40px 0 0;
  font-size: 16px;
  font-weight: 400;
`

const container = css`
  padding: 40px;
`

export default MyApp
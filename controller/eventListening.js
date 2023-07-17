'use strict';
import dotenv from 'dotenv';
dotenv.config();

import Web3 from 'web3';
import config from '../config/config.js';
import { readFile } from 'fs/promises';
import { consoleBar, timeLog, resSend } from "../lib/common.js";
import { writeDbMintTicket } from '../lib/db.js';
import { getMetadataByTokenIdWithContract } from './blockchain.js';
import { getTokenInfoByMetadataWithIpfs } from '../lib/ipfs.js';
import { decodeTrxTransfer4, decodeTrxUnlock } from '../lib/contract.js';
import { writeDbTicketInfo, writeDbPhotoCardInfo, writeDbPhotoOpened } from '../lib/db.js';

// ------------------------------------------------------------------------------

const API_URL = process.env.ALCHEMY_WSS;
const web3 = new Web3(API_URL);
const contractAddress = config.ADDRESS.CONTRACT;
const mintAddress = config.ADDRESS.MINT;
const contractAbi = JSON.parse(await readFile(new URL('../lib/contract-abi.json', import.meta.url)));
const contract = new web3.eth.Contract(contractAbi, contractAddress);

// ------------------------------------------------------------------------------

const getTokenMetaData = async (tokenId, results) => {
  const metadata = await getMetadataByTokenIdWithContract(contract, tokenId, results);  // tokenId -> metadataIpfs
  const info = await getTokenInfoByMetadataWithIpfs(metadata, results);  // medadataIpfs -> name, descr, imageIpfs
  info.tokenImageUrl;
  return info;
}
// ------------------------------------------------------------------------------

// event log filter: Transfer

const optionsTransfer = {
  topics: [
    web3.utils.sha3('Transfer(address,address,uint256)')
  ]
};

const startListeningTransfer = () => {
  const listenerForMint = web3.eth.subscribe('logs', optionsTransfer);
  listenerForMint.on('data', async event => {
    if (event.address == contractAddress) {
      const transaction = decodeTrxTransfer4(web3, event.data, event.topics);
      if (transaction.from == mintAddress) {
        const results = {};
        results.result = true;
        results.error = [];

        const tokenId = transaction.tokenId;
        const userAddress = transaction.to;
        const mintBlockNumber = event.blockNumber;

        try {
          await writeDbMintTicket(tokenId, userAddress, results);
        } catch (err) {
          results.error.push('writeDbMintTicket Error');
        }

        const tokenInfo = await getTokenMetaData(tokenId, results);
        writeDbTicketInfo(tokenId, tokenInfo, results);

        results.tokenId = tokenId;
        results.mintBlockNumber = mintBlockNumber;
        results.tokenUri = tokenInfo;
        consoleBar();
        timeLog('EVENTLISTENING mint-ticket // ' + JSON.stringify(results));
      }
    }
  });

  listenerForMint.on('error', err => timeLog(err));
  listenerForMint.on('connected', nr => timeLog('Subscription on mint ticket started with ID' + nr));
}

// ------------------------------------------------------------------------------

// event log filter: unLock

const optionsUnlock = {
  topics: [
    web3.utils.sha3('unLock(uint256)')
  ]
};

const startListeningUnlock = () => {
  const listenerForUnlock = web3.eth.subscribe('logs', optionsUnlock);
  listenerForUnlock.on('data', async event => {
    if (event.address = contractAddress) {
      const transaction = decodeTrxUnlock(web3, event.data, event.topics);


      const results = {};
      results.result = true;
      results.error = [];

      const tokenCount = transaction.tokenIndex;

      try {
        await writeDbPhotoOpened(results);
      } catch (err) {
        results.error.push('writeDbPhotoOpened Error');
      }

      results.tokenCount = tokenCount;

      for (let i = 0; i < tokenCount; i++){
        const tokenInfo = await getTokenMetaData(i, results);
        writeDbPhotoCardInfo(tokenId, tokenInfo, results);
      }

      consoleBar();
      timeLog('EVENTLISTENING unLock-ticket // ' + JSON.stringify(results));
    }
  });
  listenerForUnlock.on('error', err => timeLog(err));
  listenerForUnlock.on('connected', nr => timeLog('Subscription on unlock ticket started with ID' + nr));

}

export { startListeningTransfer, startListeningUnlock };
'use strict';
import dotenv from 'dotenv';
dotenv.config();

import Web3 from 'web3';
import config from '../config/config.js';
import { readFile } from 'fs/promises';
import { consoleBar, timeLog, resSend } from "../lib/common.js";
import { writeDbMintTicket } from '../lib/db.js';
import { getMetadataByTokenIdWithContract } from './blockchain.js';
import { getTokenInfoByMetadataWithIpfs, getImageUrlByImageIpfsWithIpfs } from '../lib/ipfs.js';
import { decodeTrxTransfer4 } from '../lib/contract.js';

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
  const imageUrl = await getImageUrlByImageIpfsWithIpfs(info.tokenImageIpfs, results);  // imageIpfs -> imageUrl
  info.tokenIpfs = metadata;
  info.tokenImageUrl = imageUrl;
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
        writeDbTicketUri(tokenId, tokenInfo, results);

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

export { startListeningTransfer };
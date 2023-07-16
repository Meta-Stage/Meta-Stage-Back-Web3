'use strict';
import dotenv from 'dotenv';
dotenv.config();

import Web3 from 'web3';
import config from '../config/config.js';
import { readFile } from 'fs/promises';
import { consoleBar, timeLog, resSend } from "../lib/common.js";
import { writeDbMintTicket } from '../lib/db.js';

const web3 = new Web3(process.env.WEB_ALCHEMY);
const contractAddress = config.ADDRESS.CONTRACT;
const mintAddress = config.ADDRESS.MINT;
const contractAbi = JSON.parse(await readFile(new URL('../lib/contract-abi.json', import.meta.url)));
const contract = new web3.eth.Contract(contractAbi, contractAddress);

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

                try{
                    await writeDbMintTicket(tokenId, userAddress, results);
                } catch (err) {
                    results.error.push('writeDbMintTicket Error');
                }

                //const tokenUri = await getTokenMetaData(tokenId, results);
                //writeDbTicketUri(tokenId, tokenUri, results);

                results.tokenId = tokenId;
                results.mintBlockNumber = mintBlockNumber;
                results.tokenUri = tokenUri;
                consoleBar();
                timeLog('EVENTLISTENING mint-ticket // '+ JSON.stringify(results));
            }
        }
    });

    listenerForMint.on('error', err => timeLog(err));
    listenerForMint.on('connected', nr => timeLog('Subscription on mint ticket started with ID' + nr));
}

export { listenerForMint };
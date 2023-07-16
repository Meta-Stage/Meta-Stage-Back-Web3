'use strict';
import dotenv from 'dotenv';
dotenv.config();

import Web3 from 'web3';
import config from '../config/config.js';
import { readFile } from 'fs/promises';
import { consoleBar, timeLog, resSend } from "../lib/common.js";

const API_URL = process.env.ALCHEMY_WSS;
const web3 = new Web3(API_URL);
const contractAddress = config.ADDRESS.CONTRACT;
const contractAbi = JSON.parse(await readFile(new URL('../lib/contract-abi.json', import.meta.url)));
const contract = new web3.eth.Contract(contractAbi, contractAddress);

// --------- getTokenMetaData ---------

// const getTokenMetaData = async (tokenId, results) => {
//     try {
//         const metadata = await contract.methods.tokenURI
//     }
// }




// --------[Get] nft-count ----------

const getNftCount = async (req, res) => {
    const results = {};
    results.result = true;
    results.error = [];
    let nftCount = 0;

    try {
        nftCount = await contract.methods.totalSupply().call();
        results.nftCount = Number(nftCount);
    } catch (err) {
        results.result = false;
        results.error.push('[ETH] getNftCount Error');
    }

    res.send(results);
    consoleBar();
    timeLog('GET nft-count called // ' + JSON.stringify(req.query) + ' // ' + JSON.stringify(results));
};

export { getNftCount };

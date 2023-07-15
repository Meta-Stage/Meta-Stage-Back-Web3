'use strict';
import dotenv from 'dotenv';
dotenv.config();

import Web3 from 'web3';
import config from '../config/config.js';
import { readFile } from 'fs/promises';
import { consoleBar, timeLog, resSend } from "../lib/common.js";

const web3 = new Web3(process.env.WEB_ALCHEMY);
const contractAddress = config.ADDRESS.CONTRACT;
const contractAbi = JSON.parse(await readFile(new URL('../lib/contract-abi.json', import.meta.url)));
const contract = new web3.eth.Contract(contractAbi, contractAddress);


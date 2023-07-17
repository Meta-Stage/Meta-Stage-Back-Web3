'use strict'
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import config from './config/config.js';
import { consoleBar, timeLog } from './lib/common.js';
import { ping } from './controller/system.js';
import { getNftCount } from './controller/blockchain.js';
import { startListeningTransfer, startListeningUnlock } from './controller/eventListening.js';
import { getNftInfo } from './lib/db.js';

// ------------------ router set -----------------

const serverPort = config.SERVER_PORT;
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
const router = express.Router();


// -------------------- api --------------------

router.route('/ping').get(ping);
router.route('/nft-count').get(getNftCount);
router.route('/nft-info').get(getNftInfo);


// ----------------- listener -------------------

startListeningTransfer();
startListeningUnlock();

// ---------------- server start -----------------

app.use('/meta-stage-web3/api/v1', router);
app.listen(serverPort);
consoleBar();
timeLog('Test Server Started');
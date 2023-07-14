'use strict'
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import config from './config/config.js';
import multer from 'multer';
import { consoleBar, timeLog } from './lib/common.js';
import { ping } from './controller/system.js';

// ------------------ router set -----------------

const serverPort = config.SERVER_PORT;
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
const router = express.Router();

// ------------------ multer set ------------------

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './chatImages/')
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        cb(null, path.basename(file.originalname, ext) + '-' + Date.now() + ext);
    }
});
const upload = multer({ storage: storage });

// -------------------- api --------------------

router.route('/ping').get(ping);


// ----------------- listener -------------------


// ---------------- server start -----------------

app.use('/meta-stage/api/v1', router);
app.use('/chatImages', express.static('chatImages')); // multer chat image load with url
app.listen(serverPort);
consoleBar();
timeLog('Test Server Started');
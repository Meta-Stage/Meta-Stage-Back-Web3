'use strict';
import dotenv from 'dotenv';
dotenv.config();

import mysql from 'mysql2/promise';
import config from '../config/config.js';
import { pool } from './connect.js';
import { consoleBar, timeLog } from './common.js';

// ---------- mintTicket -----------

const writeDbMintTicket = async (tokenId, to, results) => {
    const query = 'REPLACE INTO nftinfo (tokenId, ownerAddress) VALUE (?, ?); ';
    const queryData = [tokenId, to];
    
    try {
        const connection = await pool.getConnection(async conn => conn); 
        try {
            const [rows, fields] = await connection.query(query, queryData);
        } catch (err) {
            results.result = false;
            results.error.push('Query Error');
        }
        connection.release();
    } catch (err) {
        results.result = false;
        results.error.push('DB Error');
    }
};

// ------------- writeDbTicketInfo ---------------

const writeDbTicketInfo = async (tokenId, tokenInfo, results) => {
    const query = 'UPDATE nftinfo SET ticketUri = ? WHERE tokenId = ?; ';
    const queryData = [tokenInfo.tokenImageUrl, tokenId];

    try {
        const connection = await pool.getConnection(async conn => conn);
        try {
            const [rows, fields] = await connection.query(query, queryData);
        } catch (err) {
            results.result = false;
            results.result.push('Query Error');
        }
        connection.release();
    } catch (err) {
        results.result = false;
        results.error.push('DB Error');
    }
    return results;
};

// ------------- writeDbPhotoCardInfo ---------------

const writeDbPhotoCardInfo = async (tokenId, tokenInfo, results) => {
    const query = 'UPDATE nftinfo SET photoUri = ? WHERE tokenId = ?; ';
    const queryData = [tokenInfo.tokenImageUrl, tokenId];

    try {
        const connection = await pool.getConnection(async conn => conn);
        try {
            const [rows, fields] = await connection.query(query, queryData);
        } catch (err) {
            results.result = false;
            results.result.push('Query Error');
        }
        connection.release();
    } catch (err) {
        results.result = false;
        results.error.push('DB Error');
    }
    return results;
};

// ------------- writeDbPhotoOpened ---------------

const writeDbPhotoOpened = async (results) => {
    const query = 'UPDATE nftinfo SET photoOpened = 1 WHERE photoOpened = 0; ';

    try {
        const connection = await pool.getConnection(async conn => conn);
        try {
            const [rows, fields] = await connection.query(query);
        } catch (err) {
            results.result = false;
            results.result.push('Query Error');
        }
        connection.release();
    } catch (err) {
        results.result = false;
        results.error.push('DB Error');
    }
    return results;
};

// ------------- writeDbIsRegistered ---------------

const writeDbIsRegistered = async (results, tokenId) => {
    const query = 'UPDATE nftinfo SET isRegistered = 1 WHERE tokenId = ?; ';
    try {
        const connection = await pool.getConnection(async conn => conn);
        try {
            const [rows, fields] = await connection.query(query, tokenId);
        } catch (err) {
            results.result = false;
            results.result.push('Query Error');
        }
        connection.release();
    } catch (err) {
        results.result = false;
        results.error.push('DB Error');
    }
    return results;
};

// ------------- writeDbUnregister ---------------

const writeDbUnregister = async (results, tokenId) => {
    const query = 'UPDATE nftinfo SET isRegistered = 0 WHERE tokenId = ?; ';

    try {
        const connection = await pool.getConnection(async conn => conn);
        try {
            const [rows, fields] = await connection.query(query, tokenId);
        } catch (err) {
            results.result = false;
            results.result.push('Query Error');
        }
        connection.release();
    } catch (err) {
        results.result = false;
        results.error.push('DB Error');
    }
    return results;
};


// ------------- [get] ticketInfo ---------------

const getNftInfo = async (req, res) => {
    const query = 'SELECT tokenId, ticketUri, photoUri FROM nftinfo WHERE ownerAddress = ?; ';
    const ownerAddress = req.query.ownerAddress;
    const results = {};
    results.result = true;
    results.error = [];
    results.ownerAddress = ownerAddress;
    
    try {
        const connection = await pool.getConnection(async conn => conn);
        try {
            const [rows, field] = await connection.query(query, ownerAddress);
            results.tokenId = rows[0].tokenId;
            results.ticketUri = rows[0].ticketUri;
            results.photoUri = rows[0].photoUri;
        } catch (err) {
            results.result = false;
            results.error.push('Query Error');
        }
    } catch (err) {
        results.result = false;
        results.error.push('DB Error');
    }
    res.send(results);
    consoleBar();
    timeLog('GET nft-info called // ' + JSON.stringify(req.query) + ' // ' + JSON.stringify(results));
}

export { writeDbMintTicket, writeDbTicketInfo, writeDbPhotoCardInfo, 
    writeDbPhotoOpened, writeDbIsRegistered, writeDbUnregister, getNftInfo };
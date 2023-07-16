'use strict';
import dotenv from 'dotenv';
dotenv.config();

import mysql from 'mysql2/promise';
import config from '../config/config.js';
import { pool } from './connect.js';

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

// ------------- writeDbTokenInfo ---------------

const writeDbTokenInfo = async (tokenId, tokenInfo, results) => {
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
}


export { writeDbMintTicket, writeDbTokenInfo };
'use strict';
import dotenv from 'dotenv';
dotenv.config();

// ------------- decode contract log transfer4 ---------------

const decodeTrxTransfer4 = (web3, data, topics) => {
  const transaction = web3.eth.abi.decodeLog([{
    type: 'address',
    name: 'from',
    indexed: true
  }, {
    type: 'address',
    name: 'to',
    indexed: true
  }, {
    type: 'uint256',
    name: 'tokenId',
    indexed: true
  }],
    data,
    [topics[1], topics[2], topics[3]]);

  return transaction;
};

// ------------- decode contract log unLock ---------------

const decodeTrxUnlock = (web3, data, topics) => {
  const transaction = web3.eth.abi.decodeLog([{
    type: "uint256",
    name: "tokenIndex",
    indexed: true
  }],
    data,
    [topics[1]]);

  return transaction;
};


// ------------- decode contract log register ---------------

const decodeTrxRegister = (web3, data, topics) => {
  const transaction = web3.eth.abi.decodeLog([{
    type: "address",
    name: "from",
    indexed: true
  }, {
    type: "uint256",
    name: "tokenId",
    indexed: true
  }],
    data,
    [topics[1], topics[2]]);

  return transaction;
};

export { decodeTrxTransfer4, decodeTrxUnlock, decodeTrxRegister };
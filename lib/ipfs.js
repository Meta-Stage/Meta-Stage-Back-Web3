'use strict';
import dotenv from 'dotenv';
dotenv.config();

import axios from 'axios';

// --------------- common --------------------------

const getGatewayUrl = (ipfs) => {
    return `https://ipfs.io/ipfs/${ipfs.split('ipfs://')[1]}`;
};

// ------------- getIpfsTokenInfo ---------------

const getTokenInfoByMetadataWithIpfs = async (metadata, results) => {
    const gatewayUrl = getGatewayUrl(metadata);
    try {
      const resp = await axios.get(gatewayUrl);
      const out = {};
      out.tokenName = resp.data.name;
      out.tokenDescr = resp.data.description;
      out.tokenImageIpfs = resp.data.image;
      return out;
    } catch (err) {
      results.error.push('ipfs=' + metadata + ' / IPFS read Error');
    }
    return null;
};

  // ------------- getImageUrlByImageIpfsWithIpfs ---------------

const getImageUrlByImageIpfsWithIpfs = async (imageIpfs, results) => {
    return getGatewayUrl(imageIpfs);
};
  
export { getTokenInfoByMetadataWithIpfs, getImageUrlByImageIpfsWithIpfs };
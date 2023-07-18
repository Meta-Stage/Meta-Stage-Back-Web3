'use strict';
import dotenv from 'dotenv';
dotenv.config();

import axios from 'axios';

// ------------- getIpfsTokenInfo ---------------

const getTokenInfoByMetadataWithIpfs = async (metadata, results) => {
    try {
      const resp = await axios.get(metadata);
      const out = {};
      out.tokenName = resp.data.name;
      out.tokenDescr = resp.data.description;
      out.tokenImageUrl = resp.data.image;
      return out;
    } catch (err) {
      results.error.push('ipfs=' + metadata + ' / IPFS read Error');
    }
    return null;
};

export { getTokenInfoByMetadataWithIpfs };
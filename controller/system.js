'use strict';
import { consoleBar, timeLog, resSend } from "../lib/common.js";

// -------------ping---------------

const ping = (req, res) => {
  const result = true;
  res.send({ result });
  consoleBar();
  timeLog('GET ping called');
};

export { ping };
'use strict';
import moment from 'moment-timezone';

function resSend(res, data) {
  if (data.error) { timeLog('    error=' + JSON.stringify(data.error)) }
  res.send(data)
  timeLog('    ==> res=' + JSON.stringify(data))
}

function consoleBar() {
  console.log('-------------------------------------------------------------------');
}

function timeLog(log) {
  const time_current = moment().tz('Asia/Seoul').format('YYYY-MM-DD H:mm:ss');            // KST
  console.log('[KST: ' + time_current + '] ' + log);
}

const sleep = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export { resSend, consoleBar, timeLog, sleep };
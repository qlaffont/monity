const { parentPort, isMainThread } = require('worker_threads');
const { CronJob } = require('cron');
const { ping, http } = require('../services/fetch/fetch');

const crons = {};

if (isMainThread) {
  throw new Error('This file is a worker.');
}

/**
 * Make Ping Call from Data
 * @param {*} data (address, port, id)
 */
const pingCall = data => {
  ping(data, (res) => {
    parentPort.postMessage({cmd: 'cb', ...res});
  });
};

/**
 * Make Http Call from Data (Specify Adress, id)
 * @param {*} data (address, id)
 */
const httpCall = data => {
  http(data, (res) => {
    parentPort.postMessage({cmd: 'cb', ...res});
  });
};

/**
 * Start Cron Process
 * @param {*} data (address, port, type, id)
 */
const start = data => {
  crons[data.id] = new CronJob(data.cron, () => {
    if (data.type === 'ping') {
      pingCall(data);
    }

    if (data.type === 'http') {
      httpCall(data);
    }
  });
  crons[data.id].start();
};

/**
 * Stop Cron Process
 * @param {*} data (address, port, type, id)
 */
const stop = data => {
  if (crons[data.id]) {
    crons[data.id].stop();
    delete crons[data.id];
  }
};

/**
 * Get Crons Object
 */
const info = () => {
  const keys = Object.keys(crons);
  parentPort.postMessage({ cmd: 'info', data: keys });
};

/**
 * Clean Old Metrics
 */

const clean = () => {
  crons["cleanMetrics"] = new CronJob('* * */8 * *', () => {
    parentPort.postMessage({ cmd: 'clean' });
  });
  crons["cleanMetrics"].start();
};

/**
 * Launch Cache System
 */

const cache = () => {
  crons["cache"] = new CronJob('*/5 * * * *', () => {
    parentPort.postMessage({ cmd: 'cache' });
  });
  crons["cache"].start();
};

parentPort.on('message', function(data) {
  if (typeof data === 'object') {
    if (process.env.DEBUG_WORKER && data.cmd && data.cmd !== 'info') {
      parentPort.postMessage({
        cmd: 'debug',
        log: 'W CMD -> ' + JSON.stringify(data),
      });
    }

    switch (data.cmd) {
      case 'info':
        info();
        break;
      case 'clean':
        clean();
        break;
      case 'cache':
        cache();
        break;
      default:
    }

    if(!process.env.ENABLE_CRONTAB){
      switch (data.cmd) {
        case 'init':
          start(data);
          break;
        case 'stop':
          stop(data);
          break;
        default:
      }
    }
  }
});

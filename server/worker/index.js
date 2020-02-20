const { parentPort, isMainThread } = require('worker_threads');
const { CronJob } = require('cron');
const { ping } = require('tcp-ping');
const fetch = require('node-fetch');

const crons = {};

if (isMainThread) {
  throw new Error('This file is a worker.');
}

/**
 * Make Ping Call from Data
 * @param {*} data (address, port, id)
 */
const pingCall = data => {
  ping({ address: data.address, port: data.port, timeout: 1000 }, (err, res) => {
    if (err || Number.isNaN(res.avg)) {
      parentPort.postMessage({ cmd: 'cb', id: data.id, ms: 0, code: 500 });
    } else {
      parentPort.postMessage({ cmd: 'cb', id: data.id, ms: Math.round(res.avg), code: 200 });
    }
  });
};

/**
 * Make Http Call from Data (Specify Adress, id)
 * @param {*} data (address, id)
 */
const httpCall = data => {
  const arrayCall = [];

  const prom = data => {
    return new Promise(resolve => {
      const dateStart = Date.now();
      fetch(data.address, { redirect: 'manual' }).then(res => {
        const dateEnd = Date.now();
        const ms = dateEnd - dateStart;
        resolve({ statusCode: res.status, ms });
      }).catch(() => {
        const dateEnd = Date.now();
        const ms = dateEnd - dateStart;
        resolve({ statusCode: 500, ms })
      });
    });
  };

  for (let index = 0; index < 10; index++) {
    arrayCall.push(prom(data));
  }

  Promise.all(arrayCall).then(res => {
    let sum = 0;
    res.map(val => {
      sum += val.ms;
    });
    const avg = sum / res.length;
    parentPort.postMessage({ cmd: 'cb', id: data.id, ms: Math.round(avg), code: res[0].statusCode });
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

parentPort.on('message', function(data) {
  if (typeof data === 'object') {
    if (process.env.DEBUG_WORKER && data.cmd && data.cmd !== 'info') {
      parentPort.postMessage({
        cmd: 'debug',
        log: 'W CMD -> ' + JSON.stringify(data),
      });
    }

    switch (data.cmd) {
      case 'init':
        start(data);
        break;
      case 'stop':
        stop(data);
        break;
      case 'info':
        info();
      default:
    }
  }
});

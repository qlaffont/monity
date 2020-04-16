const pingLib = require('tcp-ping');
const fetch = require('node-fetch');

/**
 * Make Ping Call from Data
 * @param {*} data (address, port, id)
 */
const ping = (data, cb) => {
  pingLib.ping({ address: data.address, port: data.port, timeout: 3000 }, (err, res) => {
    if (err || Number.isNaN(res.avg)) {
      cb({ id: data.id, ms: 0, code: 500 });
    } else {
      cb({ id: data.id, ms: Math.round(res.avg), code: 200 });
    }
  });
};

/**
 * Make Http Call from Data (Specify Adress, id)
 * @param {*} data (address, id)
 */
const http = (data, cb) => {
  const arrayCall = [];

  const prom = data => {
    return new Promise(resolve => {
      const dateStart = Date.now();
      fetch(data.address, { redirect: 'manual', timeout: 3000 })
        .then(res => {
          const dateEnd = Date.now();
          const ms = dateEnd - dateStart;
          resolve({ statusCode: res.status, ms });
        })
        .catch(() => {
          const dateEnd = Date.now();
          const ms = dateEnd - dateStart;
          resolve({ statusCode: 500, ms });
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
    cb({ id: data.id, ms: Math.round(avg), code: res[0].statusCode })
  }).catch(() => {
    cb({ id: data.id, ms: 0, code: 500 });
  });
};

module.exports = {
  ping,
  http
}

import { Worker } from 'worker_threads';

const pathWorker = __dirname + '/index.js';

describe('Worker', () => {
  describe('Mount Worker Instance', () => {
    it('should be a worker', () => {
      let worker;
      try {
        worker = new Worker(pathWorker);
      } catch (e) {
        throw new Error(e);
      }
      worker.terminate();
    });
  });

  describe('PostMessage', () => {
    let worker;

    beforeAll(() => {
      worker = new Worker(pathWorker);
    });
    afterAll(() => {
      worker.terminate();
    });

    it('Info Event is sent', done => {
      worker.postMessage({ cmd: 'info' });
      worker.once('message', msg => {
        expect(typeof msg).toBe('object');
        expect(msg).toEqual({ cmd: 'info', data: [] });
        done();
      });
    });

    it('Init Event is sent', done => {
      const data = { cmd: 'init', type: 'ping', address: '8.8.8.8', port: 80, cron: '0 0 0 0 *', id: '56' };
      worker.postMessage(data);
      worker.once('message', msg => {
        expect(typeof msg).toBe('object');
        if (msg.cmd && msg.cmd === 'debug') {
          expect(msg).toEqual({
            cmd: 'debug',
            log: 'W CMD -> {"cmd":"init","type":"ping","address":"8.8.8.8","port":80,"cron":"0 0 0 0 *","id":"56"}',
          });
          done();
        }
      });
    });

    it('Stop Event is sent', done => {
      const data = { cmd: 'stop', type: 'ping', address: '8.8.8.8', port: 80, cron: '0 0 0 0 *', id: '56' };
      worker.postMessage(data);
      worker.on('message', msg => {
        expect(typeof msg).toBe('object');
        if (msg.cmd && msg.cmd === 'debug') {
          expect(msg).toEqual({
            cmd: 'debug',
            log: 'W CMD -> {"cmd":"stop","type":"ping","address":"8.8.8.8","port":80,"cron":"0 0 0 0 *","id":"56"}',
          });
          done();
        }
      });
    });
  });

  describe('start', () => {
    let worker;

    beforeAll(() => {
      worker = new Worker(pathWorker);
    });
    afterAll(() => {
      worker.terminate();
    });

    it('should start cronjob', done => {
      const data = { cmd: 'init', type: 'ping', address: '8.8.8.8', port: 80, cron: '0 0 0 0 *', id: '56' };
      worker.postMessage(data);
      worker.postMessage({ cmd: 'info' });
      worker.on('message', msg => {
        if (msg && msg.cmd === 'info') {
          expect(typeof msg).toBe('object');
          expect(msg).toEqual({ cmd: 'info', data: [data.id] });
          done();
        }
      });
    });
  });

  describe('stop', () => {
    let worker;

    beforeAll(() => {
      worker = new Worker(pathWorker);
    });
    afterAll(() => {
      worker.terminate();
    });

    it('should stop cronjob', done => {
      const data = { cmd: 'init', type: 'ping', address: '8.8.8.8', port: 80, cron: '0 0 0 0 *', id: '56' };
      worker.postMessage(data);
      worker.postMessage({ cmd: 'stop', id: data.id });
      worker.postMessage({ cmd: 'info' });
      worker.on('message', msg => {
        if (msg && msg.cmd === 'info') {
          expect(typeof msg).toBe('object');
          expect(msg).toEqual({ cmd: 'info', data: [] });
          done();
        }
      });
    });
  });

  describe('pingCall', () => {
    let worker;

    beforeEach(() => {
      worker = new Worker(pathWorker);
    });
    afterEach(() => {
      worker.terminate();
    });

    it('should return value 200 if everything is good', done => {
      const data = { cmd: 'init', type: 'ping', address: '216.239.38.117', port: 80, cron: '*/3 * * * * *', id: '56' };
      worker.postMessage(data);
      worker.on('message', msg => {
        if (msg && msg.cmd === 'cb') {
          expect(typeof msg).toBe('object');
          expect(msg.id).toBe(data.id);
          expect(typeof msg.ms).toBe('number');
          expect(typeof msg.code).toBe('number');
          expect(msg.code).toBe(200);
          done();
        }
      });
    }, 10000);

    it('should return value 500 if problem with port or ip', done => {
      const data = { cmd: 'init', type: 'ping', address: '216.239.38.117', port: 800, cron: '*/3 * * * * *', id: '57' };
      worker.postMessage(data);
      worker.on('message', msg => {
        if (msg && msg.cmd === 'cb') {
          expect(typeof msg).toBe('object');
          expect(msg.id).toBe(data.id);
          expect(typeof msg.ms).toBe('number');
          expect(typeof msg.code).toBe('number');
          expect(msg.code).toBe(500);
          done();
        }
      });
    }, 20000);
  });

  describe('httpCall', () => {
    let worker;

    beforeEach(() => {
      worker = new Worker(pathWorker);
    });
    afterEach(() => {
      worker.terminate();
    });

    it('should return statusCode if everything is good', done => {
      const data = { cmd: 'init', type: 'http', address: 'https://google.com', cron: '*/3 * * * * *', id: '56' };
      worker.postMessage(data);
      worker.on('message', msg => {
        if (msg && msg.cmd === 'cb') {
          expect(typeof msg).toBe('object');
          expect(msg.id).toBe(data.id);
          expect(typeof msg.ms).toBe('number');
          expect(typeof msg.code).toBe('number');
          expect(msg.code).toBe(301);
          done();
        }
      });
    }, 10000);

    it('should return value statusCode if problem with port or ip', done => {
      const data = { cmd: 'init', type: 'ping', address: 'https://fakegooglendd.com', cron: '*/3 * * * * *', id: '57' };
      worker.postMessage(data);
      worker.on('message', msg => {
        if (msg && msg.cmd === 'cb') {
          expect(typeof msg).toBe('object');
          expect(msg.id).toBe(data.id);
          expect(typeof msg.ms).toBe('number');
          expect(typeof msg.code).toBe('number');
          expect(msg.code).toBe(500);
          done();
        }
      });
    }, 20000);
  });
});

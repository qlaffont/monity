import { Worker } from 'worker_threads';

const pathWorker = __dirname + '/index.js';

process.env.DEBUG_WORKER = 'true';

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
      worker.once('message', data => {
        expect(typeof data).toBe('object');
        expect(data).toEqual({ cmd: 'info', data: [] });
        done();
      });
    });

    it('Init Event is sent', done => {
      const data = { cmd: 'init', type: 'ping', address: '8.8.8.8', port: 80, cron: '0 0 0 0 *', id: '56' };
      worker.postMessage(data);
      worker.once('message', data => {
        expect(typeof data).toBe('object');
        expect(data).toEqual({
          cmd: 'debug',
          log: 'W CMD -> {"cmd":"init","type":"ping","address":"8.8.8.8","port":80,"cron":"0 0 0 0 *","id":"56"}',
        });
        done();
      });
    });

    it('Stop Event is sent', done => {
      const data = { cmd: 'stop', type: 'ping', address: '8.8.8.8', port: 80, cron: '0 0 0 0 *', id: '56' };
      worker.postMessage(data);
      worker.once('message', data => {
        expect(typeof data).toBe('object');
        expect(data).toEqual({
          cmd: 'debug',
          log: 'W CMD -> {"cmd":"stop","type":"ping","address":"8.8.8.8","port":80,"cron":"0 0 0 0 *","id":"56"}',
        });
        done();
      });
    });
  });
});

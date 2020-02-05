import { getKeyFormat } from './../metrics/metricsTools';
import app from '../../server';
import { authHeaders } from '../../jest/fastifyHeaders';

describe('CheckersRoutes', () => {
  let fastify, token, group;

  beforeAll(async done => {
    fastify = await app();

    fastify.ready(() => {
      fastify
        .inject({
          method: 'GET',
          url: '/auth/generate',
        })
        .then(res => {
          token = JSON.parse(res.body).data.token;

          fastify
            .inject({
              method: 'POST',
              url: '/groups',
              ...authHeaders(token),
              body: {
                name: 'My Group',
              },
            })
            .then(resGrp => {
              group = JSON.parse(resGrp.body).data;
              done();
            });
        });
    });
  });

  afterAll(done => {
    fastify.close().then(() => done());
  });

  describe('POST /checkers', () => {
    it('should create a checker with data and a good group Id', async () => {
      const data = {
        name: 'My Checker',
        description: 'My Description',
        checkerType: 'ping',
        address: '127.0.0.1',
        port: '80',
        cron: '* * * * *',
        groupId: group._id,
      };

      const res = await fastify.inject({
        method: 'POST',
        url: '/checkers',
        ...authHeaders(token),
        body: data,
      });

      expect(res.statusCode).toEqual(200);
      expect(JSON.parse(res.body)).toMatchObject({ message: 'Checker successfully created !' });
    });

    it('should create a checker with only name checkerType address', async () => {
      const data = {
        name: 'My Checker',
        checkerType: 'ping',
        address: '127.0.0.1',
        port: '80',
        cron: '* * * * *',
        groupId: group._id,
      };

      const res = await fastify.inject({
        method: 'POST',
        url: '/checkers',
        ...authHeaders(token),
        body: data,
      });

      expect(res.statusCode).toEqual(200);
      expect(JSON.parse(res.body)).toMatchObject({ message: 'Checker successfully created !' });
    });

    it('should return an error if checkerType is "http" and address don\'t contain "http://"', async () => {
      const data = {
        name: 'My Checker',
        checkerType: 'http',
        address: '127.0.0.1',
        cron: '* * * * *',
        groupId: group._id,
      };

      const res = await fastify.inject({
        method: 'POST',
        url: '/checkers',
        ...authHeaders(token),
        body: data,
      });

      expect(res.statusCode).toEqual(400);
      expect(JSON.parse(res.body)).toMatchObject({ message: 'Form Error' });
    });

    it('should return an error if checkerType is "ping" and port doesn\'t exist', async () => {
      const data = {
        name: 'My Checker',
        checkerType: 'ping',
        address: '127.0.0.1',
        cron: '* * * * *',
        groupId: group._id,
      };

      const res = await fastify.inject({
        method: 'POST',
        url: '/checkers',
        ...authHeaders(token),
        body: data,
      });

      expect(res.statusCode).toEqual(400);
      expect(JSON.parse(res.body)).toMatchObject({ message: 'Form Error' });
    });

    it("should return an error if we don't send any data", async () => {
      const res = await fastify.inject({
        method: 'POST',
        url: '/checkers',
        ...authHeaders(token),
        body: {},
      });

      expect(res.statusCode).toEqual(400);
      expect(JSON.parse(res.body)).toMatchObject({ message: 'Form Error' });
    });

    it('should return an error if we provide a wrong groupId', async () => {
      const data = {
        name: 'My Checker',
        checkerType: 'ping',
        address: '127.0.0.1',
        port: '80',
        cron: '* * * * *',
        groupId: 'qeazeazea',
      };
      const res = await fastify.inject({
        method: 'POST',
        url: '/checkers',
        ...authHeaders(token),
        body: data,
      });

      expect(res.statusCode).toEqual(400);
      expect(JSON.parse(res.body)).toMatchObject({ message: 'Form Error' });
    });
  });

  describe('PUT /checkers', () => {
    let id;
    beforeAll(async done => {
      const data = {
        name: 'My Checker',
        checkerType: 'ping',
        address: '127.0.0.1',
        port: '80',
        cron: '* * * * *',
        groupId: group._id,
      };

      const res = await fastify.inject({
        method: 'POST',
        url: '/checkers',
        ...authHeaders(token),
        body: data,
      });
      id = JSON.parse(res.body).data._id;
      done();
    });

    it('should update a checker with name and a good id', async () => {
      const data = {
        name: 'My Checker edited',
      };

      const res = await fastify.inject({
        method: 'PUT',
        url: `/checkers/${id}`,
        body: data,
        ...authHeaders(token),
      });

      expect(res.statusCode).toEqual(200);
      expect(JSON.parse(res.body)).toMatchObject({ message: 'Checker successfully edited !', data });
    });

    it('should return an error if id is not good', async () => {
      const data = {
        name: 'My Checker edited',
      };

      const res = await fastify.inject({
        method: 'PUT',
        url: `/checkers/wrongid`,
        body: data,
        ...authHeaders(token),
      });

      expect(res.statusCode).toEqual(400);
      expect(JSON.parse(res.body)).toMatchObject({ message: 'Form Error' });
    });
  });

  describe('DELETE /checkers', () => {
    let id;
    beforeAll(async done => {
      const data = {
        name: 'My Checker',
        checkerType: 'ping',
        address: '127.0.0.1',
        port: '80',
        cron: '* * * * *',
        groupId: group._id,
      };

      const res = await fastify.inject({
        method: 'POST',
        url: '/checkers',
        ...authHeaders(token),
        body: data,
      });
      id = JSON.parse(res.body).data._id;
      done();
    });

    it('should delete a checker with good id', async () => {
      const res = await fastify.inject({
        method: 'DELETE',
        url: `/checkers/${id}`,
        ...authHeaders(token),
      });

      expect(res.statusCode).toEqual(200);
      expect(JSON.parse(res.body)).toMatchObject({ message: 'Checker successfully deleted !' });
    });

    it('should return an error if id is not good', async () => {
      const res = await fastify.inject({
        method: 'DELETE',
        url: `/checkers/azeazeae`,
        ...authHeaders(token),
      });

      expect(res.statusCode).toEqual(400);
      expect(JSON.parse(res.body)).toMatchObject({ message: 'Form Error' });
    });
  });

  describe('GET /checkers', () => {
    let id;
    beforeAll(async done => {
      const data = {
        name: 'My Checker',
        checkerType: 'ping',
        address: '127.0.0.1',
        port: '80',
        cron: '* * * * *',
        groupId: group._id,
      };

      const res = await fastify.inject({
        method: 'POST',
        url: '/checkers',
        ...authHeaders(token),
        body: data,
      });
      id = JSON.parse(res.body).data._id;
      done();
    });

    it('should return an array with all checkers', async () => {
      const res = await fastify.inject({
        method: 'GET',
        url: `/checkers`,
        ...authHeaders(token),
      });
      expect(res.statusCode).toEqual(200);

      const data = JSON.parse(res.body).data;
      expect(Array.isArray(data)).toEqual(true);

      const item = data.find(e => e._id === id);
      expect(item).toBeDefined();
    });
  });

  describe('GET /checkers/:id', () => {
    let data;
    beforeAll(async done => {
      const dataSample = {
        name: 'My Checker',
        checkerType: 'ping',
        address: '127.0.0.1',
        port: '80',
        cron: '* * * * *',
        groupId: group._id,
      };

      const res = await fastify.inject({
        method: 'POST',
        url: '/checkers',
        ...authHeaders(token),
        body: dataSample,
      });
      data = JSON.parse(res.body).data;
      done();
    });

    it('should return checker info if good id', async () => {
      const res = await fastify.inject({
        method: 'GET',
        url: `/checkers/${data._id}`,
        ...authHeaders(token),
      });

      expect(res.statusCode).toEqual(200);

      const d = JSON.parse(res.body).data;
      expect(typeof d).toEqual('object');
      const expectedResult = { ...data };
      delete expectedResult.groupId;
      expect(d).toMatchObject(expectedResult);
    });

    it('should return not found if not good id', async () => {
      const res = await fastify.inject({
        method: 'GET',
        url: `/checkers/azeazeae`,
        ...authHeaders(token),
      });

      expect(res.statusCode).toEqual(404);
    });
  });

  describe('GET /checkers/:id/metrics', () => {
    let data, metric;
    beforeAll(async done => {
      const dataSample = {
        name: 'My Checker',
        checkerType: 'ping',
        address: '127.0.0.1',
        port: '80',
        cron: '* * * * *',
        groupId: group._id,
      };

      const res = await fastify.inject({
        method: 'POST',
        url: '/checkers',
        ...authHeaders(token),
        body: dataSample,
      });
      data = JSON.parse(res.body).data;

      const metricSample = {
        ms: 2,
        statusCode: 200,
        checkerId: data._id,
      };

      const resMetric = await fastify.inject({
        method: 'POST',
        url: '/metrics',
        body: metricSample,
        ...authHeaders(token),
      });
      metric = JSON.parse(resMetric.body).data;

      done();
    });

    it('should return metrics if good id', async () => {
      const res = await fastify.inject({
        method: 'GET',
        url: `/checkers/${data._id}/metrics`,
        ...authHeaders(token),
      });

      expect(res.statusCode).toEqual(200);

      const d = JSON.parse(res.body).data;
      expect(Array.isArray(d)).toEqual(true);

      const item = d.find(e => e._id === metric._id);
      expect(item).toBeDefined();
    });

    it('should return not found if not good id', async () => {
      const res = await fastify.inject({
        method: 'GET',
        url: `/checkers/azeazeae/metrics`,
        ...authHeaders(token),
      });

      expect(res.statusCode).toEqual(404);
    });
  });

  describe('GET /checkers/:id/metrics/export', () => {
    let data, metric, metricSample;
    beforeAll(async done => {
      const dataSample = {
        name: 'My Checker',
        checkerType: 'ping',
        address: '127.0.0.1',
        port: '80',
        cron: '* * * * *',
        groupId: group._id,
      };

      const res = await fastify.inject({
        method: 'POST',
        url: '/checkers',
        ...authHeaders(token),
        body: dataSample,
      });
      data = JSON.parse(res.body).data;

      metricSample = {
        ms: 2,
        statusCode: 200,
        checkerId: data._id,
      };

      const resMetric = await fastify.inject({
        method: 'POST',
        url: '/metrics',
        body: metricSample,
        ...authHeaders(token),
      });
      metric = JSON.parse(resMetric.body).data;

      done();
    });

    it('should return ms metrics if good id', async () => {
      const res = await fastify.inject({
        method: 'GET',
        url: `/checkers/${data._id}/metrics/export`,
        query: {
          field: 'ms',
          filter: 'hour',
        },
        ...authHeaders(token),
      });

      expect(res.statusCode).toEqual(200);

      const d = JSON.parse(res.body).data;
      expect(Array.isArray(d.keys)).toBe(true);
      expect(Array.isArray(d.values)).toBe(true);
      expect(d.keys.length).toBe(d.values.length);

      expect(d.keys[0]).toBe(getKeyFormat(metric.metricsDate));
      expect(d.values[0]).toBe(metricSample.ms.toString());
    });

    it('should return statusCode metrics if good id', async () => {
      const res = await fastify.inject({
        method: 'GET',
        url: `/checkers/${data._id}/metrics/export`,
        query: {
          field: 'statusCode',
          filter: 'hour',
        },
        ...authHeaders(token),
      });

      expect(res.statusCode).toEqual(200);

      const d = JSON.parse(res.body).data;
      expect(Array.isArray(d.keys)).toBe(true);
      expect(Array.isArray(d.values)).toBe(true);
      expect(d.keys.length).toBe(d.values.length);

      expect(d.keys[0]).toBe(getKeyFormat(metric.metricsDate));
      expect(d.values[0]).toBe(metricSample.statusCode.toString());

      expect(d['2xx'][0]).toBe(1);
      expect(d['3xx'][0]).toBe(0);
      expect(d['4xx'][0]).toBe(0);
      expect(d['5xx'][0]).toBe(0);
    });

    it('should return not found if not good id', async () => {
      const res = await fastify.inject({
        method: 'GET',
        url: `/checkers/azeazeae/metrics`,
        ...authHeaders(token),
      });

      expect(res.statusCode).toEqual(404);
    });
  });

  describe('PUT /checkers/:id/start', () => {
    let id;
    beforeAll(async done => {
      const data = {
        name: 'My Checker',
        checkerType: 'ping',
        address: '127.0.0.1',
        port: '80',
        cron: '* * * * *',
        groupId: group._id,
      };

      const res = await fastify.inject({
        method: 'POST',
        url: '/checkers',
        ...authHeaders(token),
        body: data,
      });
      id = JSON.parse(res.body).data._id;
      done();
    });

    it('should start with a good id', async () => {
      const res = await fastify.inject({
        method: 'PUT',
        url: `/checkers/${id}/start`,
        ...authHeaders(token),
      });

      expect(res.statusCode).toEqual(200);
      expect(JSON.parse(res.body)).toMatchObject({ message: 'Checker Started' });
    });

    it('should return an error if id is not good', async () => {
      const data = {
        name: 'My Checker edited',
      };

      const res = await fastify.inject({
        method: 'PUT',
        url: `/checkers/wrongid/start`,
        body: data,
        ...authHeaders(token),
      });

      expect(res.statusCode).toEqual(404);
      expect(JSON.parse(res.body)).toMatchObject({ message: 'Checker not found' });
    });
  });

  describe('PUT /checkers/:id/stop', () => {
    let id;
    beforeAll(async done => {
      const data = {
        name: 'My Checker',
        checkerType: 'ping',
        address: '127.0.0.1',
        port: '80',
        cron: '* * * * *',
        groupId: group._id,
      };

      const res = await fastify.inject({
        method: 'POST',
        url: '/checkers',
        ...authHeaders(token),
        body: data,
      });
      id = JSON.parse(res.body).data._id;
      done();
    });

    it('should stop with a good id', async () => {
      const res = await fastify.inject({
        method: 'PUT',
        url: `/checkers/${id}/stop`,
        ...authHeaders(token),
      });

      expect(res.statusCode).toEqual(200);
      expect(JSON.parse(res.body)).toMatchObject({ message: 'Checker Stopped' });
    });

    it('should return an error if id is not good', async () => {
      const res = await fastify.inject({
        method: 'PUT',
        url: `/checkers/wrongid/stop`,
        ...authHeaders(token),
      });

      expect(res.statusCode).toEqual(404);
      expect(JSON.parse(res.body)).toMatchObject({ message: 'Checker not found' });
    });
  });
});

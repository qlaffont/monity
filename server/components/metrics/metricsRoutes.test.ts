import app from '../../server';
import { authHeaders } from '../../jest/fastifyHeaders';

describe('MetricsRoutes', () => {
  let fastify, token, group, checker;

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
              fastify
                .inject({
                  method: 'POST',
                  url: '/checkers',
                  ...authHeaders(token),
                  body: {
                    name: 'My Checker',
                    checkerType: 'ping',
                    address: '127.0.0.1',
                    port: '80',
                    cron: '* * * * *',
                    groupId: group._id,
                  },
                })
                .then(resChecker => {
                  checker = JSON.parse(resChecker.body).data;
                  done();
                });
            });
        });
    });
  });

  afterAll(done => {
    fastify.close().then(() => done());
  });

  describe('POST /metrics', () => {
    it('should create a metric with data and a good checker Id', async () => {
      const data = {
        ms: 2,
        statusCode: 200,
        checkerId: checker._id,
      };

      const res = await fastify.inject({
        method: 'POST',
        url: '/metrics',
        ...authHeaders(token),
        body: data,
      });

      expect(res.statusCode).toEqual(200);
      expect(JSON.parse(res.body)).toMatchObject({ message: 'Metric successfully created !' });
    });

    it("should return an error if we don't send any data", async () => {
      const res = await fastify.inject({
        method: 'POST',
        url: '/metrics',
        ...authHeaders(token),
        body: {},
      });

      expect(res.statusCode).toEqual(400);
      expect(JSON.parse(res.body)).toMatchObject({ message: 'Form Error' });
    });

    it('should return an error if we provide a wrong groupId', async () => {
      const data = {
        ms: 2,
        statusCode: 200,
        checkerId: 'totlotlo',
      };
      const res = await fastify.inject({
        method: 'POST',
        url: '/metrics',
        ...authHeaders(token),
        body: data,
      });

      expect(res.statusCode).toEqual(400);
      expect(JSON.parse(res.body)).toMatchObject({ message: 'Form Error' });
    });
  });

  describe('DELETE /metrics', () => {
    let id;
    beforeAll(async done => {
      const data = {
        ms: 2,
        statusCode: 200,
        checkerId: checker._id,
      };

      const res = await fastify.inject({
        method: 'POST',
        url: '/metrics',
        ...authHeaders(token),
        body: data,
      });
      id = JSON.parse(res.body).data._id;
      done();
    });

    it('should delete a metric with good id', async () => {
      const res = await fastify.inject({
        method: 'DELETE',
        url: `/metrics/${id}`,
        ...authHeaders(token),
      });

      expect(res.statusCode).toEqual(200);
      expect(JSON.parse(res.body)).toMatchObject({ message: 'Metric successfully deleted !' });
    });

    it('should return an error if id is not good', async () => {
      const res = await fastify.inject({
        method: 'DELETE',
        url: `/metrics/azeazeae`,
        ...authHeaders(token),
      });

      expect(res.statusCode).toEqual(400);
      expect(JSON.parse(res.body)).toMatchObject({ message: 'Form Error' });
    });
  });

  describe('GET /metrics', () => {
    let id;
    beforeAll(async done => {
      const data = {
        ms: 2,
        statusCode: 200,
        checkerId: checker._id,
      };

      const res = await fastify.inject({
        method: 'POST',
        url: '/metrics',
        ...authHeaders(token),
        body: data,
      });
      id = JSON.parse(res.body).data._id;
      done();
    });

    it('should return an array with all metrics', async () => {
      const res = await fastify.inject({
        method: 'GET',
        url: `/metrics`,
        ...authHeaders(token),
      });
      expect(res.statusCode).toEqual(200);

      const data = JSON.parse(res.body).data;
      expect(Array.isArray(data)).toEqual(true);

      const item = data.find(e => e._id === id);
      expect(item).toBeDefined();
    });
  });

  describe('GET /metrics/:id', () => {
    let data;
    beforeAll(async done => {
      const dataSample = {
        ms: 2,
        statusCode: 200,
        checkerId: checker._id,
      };

      const res = await fastify.inject({
        method: 'POST',
        url: '/metrics',
        ...authHeaders(token),
        body: dataSample,
      });
      data = JSON.parse(res.body).data;
      done();
    });

    it('should return metric info if good id', async () => {
      const res = await fastify.inject({
        method: 'GET',
        url: `/metrics/${data._id}`,
        ...authHeaders(token),
      });

      expect(res.statusCode).toEqual(200);

      const d = JSON.parse(res.body).data;
      expect(typeof d).toEqual('object');
      expect(d).toEqual(data);
    });

    it('should return not found if not good id', async () => {
      const res = await fastify.inject({
        method: 'GET',
        url: `/metrics/azeazeae`,
        ...authHeaders(token),
      });

      expect(res.statusCode).toEqual(404);
    });
  });
});

import app from '../../server';
import { authHeaders } from '../../jest/fastifyHeaders';

describe('DashboardRoutes', () => {
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

  describe('GET /dashboard/checkers', () => {
    beforeAll(async done => {
      const data = {
        ms: 2,
        statusCode: 200,
        checkerId: checker._id,
      };

      await fastify.inject({
        method: 'PUT',
        url: `/checkers/${checker._id}/start`,
        ...authHeaders(token),
      });

      await fastify.inject({
        method: 'POST',
        url: '/metrics',
        ...authHeaders(token),
        body: data,
      });
      done();
    });

    afterAll(async done => {
      await fastify.inject({
        method: 'PUT',
        url: `/checkers/${checker._id}/stop`,
        ...authHeaders(token),
      });
      done();
    });

    it('should return all checkers with groups', async () => {
      const res = await fastify.inject({
        method: 'GET',
        url: '/dashboard/checkers',
      });
      expect(res.statusCode).toEqual(200);
      expect(JSON.parse(res.body)).toMatchObject({ message: 'Success' });
      expect(Object.keys(JSON.parse(res.body).data)).toMatchObject(['groups', 'checkers']);
    });
  });

  describe('GET /dashboard/metrics/:id', () => {
    beforeAll(async done => {
      const data = {
        ms: 2,
        statusCode: 200,
        checkerId: checker._id,
      };

      await fastify.inject({
        method: 'PUT',
        url: `/checkers/${checker._id}/start`,
        ...authHeaders(token),
      });

      await fastify.inject({
        method: 'POST',
        url: '/metrics',
        ...authHeaders(token),
        body: data,
      });
      done();
    });

    it('should return no data if no cache', async () => {
      const res = await fastify.inject({
        method: 'GET',
        url: `/dashboard/metrics/${checker._id}`,
      });
      expect(res.statusCode).toEqual(200);
      expect(JSON.parse(res.body)).toMatchObject({ message: 'Success' });
      expect(Object.keys(JSON.parse(res.body).data)).toMatchObject([]);
    });
  });
});

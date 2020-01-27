import app from '../../server';

describe('AuthRoutes', () => {
  let fastify;

  beforeAll(done => {
    fastify = app();

    fastify.ready(() => {
      done();
    });
  });

  describe('GET /auth/generate', () => {
    it('should create a token', async () => {
      const res = await fastify.inject({
        method: 'GET',
        url: '/auth/generate',
      });
      expect(res.statusCode).toEqual(200);
      expect(JSON.parse(res.body)).toMatchObject({ message: 'Token successfully created !' });
    });
  });
});

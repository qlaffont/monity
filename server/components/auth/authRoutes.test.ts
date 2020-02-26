import app from '../../server';

describe('AuthRoutes', () => {
  let fastify;

  describe('GET /auth/generate', () => {
    beforeEach(async done => {
      fastify = await app();

      fastify.ready(() => {
        done();
      });
    });

    afterEach(done => {
      fastify.close().then(() => done());
    });

    it('should create a token', async () => {
      const res = await fastify.inject({
        method: 'GET',
        url: '/auth/generate',
      });
      expect(res.statusCode).toEqual(200);
      expect(JSON.parse(res.body)).toMatchObject({ message: 'Token successfully created !' });
    });

    it('should send 403 if we try to generate token before it expired', async () => {
      await fastify.inject({
        method: 'GET',
        url: '/auth/generate',
      });
      const res = await fastify.inject({
        method: 'GET',
        url: '/auth/generate',
      });
      expect(res.statusCode).toEqual(403);
      expect(JSON.parse(res.body)).toMatchObject({ message: 'Token already exist !' });
    });
  });
});

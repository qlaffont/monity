import app from '../../server';
import { authHeaders } from '../../jest/fastifyHeaders';

describe('GroupsRoutes', () => {
  let fastify, token;

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
          done();
        });
    });
  });

  afterAll(done => {
    fastify.close().then(() => done());
  });

  describe('POST /groups', () => {
    it('should create a group with name and description', async () => {
      const res = await fastify.inject({
        method: 'POST',
        url: '/groups',
        ...authHeaders(token),
        body: {
          name: 'My Group',
          description: 'With My Description',
        },
      });

      expect(res.statusCode).toEqual(200);
      expect(JSON.parse(res.body)).toMatchObject({ message: 'Group successfully created !' });
    });

    it('should create a group with name and without description', async () => {
      const res = await fastify.inject({
        method: 'POST',
        url: '/groups',
        ...authHeaders(token),
        body: {
          name: 'My Group',
        },
      });

      expect(res.statusCode).toEqual(200);
      expect(JSON.parse(res.body)).toMatchObject({ message: 'Group successfully created !' });
    });

    it("should return an error if we don't provide name", async () => {
      const res = await fastify.inject({
        method: 'POST',
        url: '/groups',
        ...authHeaders(token),
        body: {},
      });

      expect(res.statusCode).toEqual(400);
      expect(JSON.parse(res.body)).toMatchObject({ message: 'Form Error' });
    });
  });

  describe('PUT /groups', () => {
    let id;
    beforeAll(async done => {
      const res = await fastify.inject({
        method: 'POST',
        url: '/groups',
        ...authHeaders(token),
        body: {
          name: 'My Group',
          description: 'With My Description',
        },
      });
      id = JSON.parse(res.body).data._id;
      done();
    });

    it('should update a group with name and a good id', async () => {
      const data = {
        name: 'My Group edited',
      };

      const res = await fastify.inject({
        method: 'PUT',
        url: `/groups/${id}`,
        body: data,
        ...authHeaders(token),
      });

      expect(res.statusCode).toEqual(200);
      expect(JSON.parse(res.body)).toMatchObject({ message: 'Group successfully edited !', data });
    });

    it('should return an error if id is not good', async () => {
      const res = await fastify.inject({
        method: 'PUT',
        url: `/groups/wrongid`,
        body: {},
        ...authHeaders(token),
      });

      expect(res.statusCode).toEqual(400);
      expect(JSON.parse(res.body)).toMatchObject({ message: 'Form Error' });
    });
  });

  describe('DELETE /groups', () => {
    let id;
    beforeAll(async done => {
      const res = await fastify.inject({
        method: 'POST',
        url: '/groups',
        ...authHeaders(token),
        body: {
          name: 'My Group',
          description: 'With My Description',
        },
      });
      id = JSON.parse(res.body).data._id;
      done();
    });

    it('should delete a group with good id', async () => {
      const res = await fastify.inject({
        method: 'DELETE',
        url: `/groups/${id}`,
        ...authHeaders(token),
      });

      expect(res.statusCode).toEqual(200);
      expect(JSON.parse(res.body)).toMatchObject({ message: 'Group successfully deleted !' });
    });

    it('should return an error if id is not good', async () => {
      const res = await fastify.inject({
        method: 'DELETE',
        url: `/groups/azeazeae`,
        ...authHeaders(token),
      });

      expect(res.statusCode).toEqual(400);
      expect(JSON.parse(res.body)).toMatchObject({ message: 'Form Error' });
    });
  });

  describe('GET /groups', () => {
    let id;
    beforeAll(async done => {
      const res = await fastify.inject({
        method: 'POST',
        url: '/groups',
        ...authHeaders(token),
        body: {
          name: 'My Group',
          description: 'With My Description',
        },
      });
      id = JSON.parse(res.body).data._id;
      done();
    });

    it('should return an array with all groups', async () => {
      const res = await fastify.inject({
        method: 'GET',
        url: `/groups`,
        ...authHeaders(token),
      });
      expect(res.statusCode).toEqual(200);

      const data = JSON.parse(res.body).data;
      expect(Array.isArray(data)).toEqual(true);

      const item = data.find(e => e._id === id);
      expect(item).toBeDefined();
    });
  });

  describe('GET /groups/:id', () => {
    let data;
    beforeAll(async done => {
      const res = await fastify.inject({
        method: 'POST',
        url: '/groups',
        ...authHeaders(token),
        body: {
          name: 'My Group',
          description: 'With My Description',
        },
      });
      data = JSON.parse(res.body).data;
      done();
    });

    it('should return group info if good id', async () => {
      const res = await fastify.inject({
        method: 'GET',
        url: `/groups/${data._id}`,
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
        url: `/groups/azeazeae`,
        ...authHeaders(token),
      });

      expect(res.statusCode).toEqual(404);
    });
  });
});

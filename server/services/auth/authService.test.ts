import jwt from 'jsonwebtoken';
import fs from 'fs';
import Fastify from 'fastify';

import {
  generateToken,
  saveTokenInFile,
  generateAndSaveToken,
  checkTokenValidity,
  FastifyInstanceAuth,
  verifyAuth,
} from './authService';

describe('Auth Service', () => {
  const expiredToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwa2ciOiJtb25pdHkiLCJpYXQiOjE1Nzk3ODMyNTYsImV4cCI6MTU3OTc4MzI1N30.5prVgOo4JJDrBuMWBgdctQeGphmi4eTlDsmDFRjBGVk';

  describe('generateToken', () => {
    it('should return a token when we called it', () => {
      const token = generateToken();
      expect(typeof token).toBe('string');
      const jwtTokenContent = jwt.verify(token, 'monity-secret');
      expect(jwtTokenContent).toMatchObject({ pkg: 'monity' });
    });

    it('should return a token who be valid 1 day', () => {
      const tommorowDate = new Date();
      tommorowDate.setDate(tommorowDate.getDate() + 1);

      const timeTommorow = parseInt(
        tommorowDate
          .getTime()
          .toString()
          .slice(0, -3),
        10,
      );
      const token = generateToken();

      const jwtTokenContent = jwt.verify(token, 'monity-secret');

      expect(timeTommorow).toEqual(jwtTokenContent.exp);
    });
  });

  describe('saveTokenInFile', () => {
    afterAll(() => {
      fs.unlinkSync(process.cwd() + '/auth-token.txt');
    });

    it('should create a auth-token.txt file with token content', () => {
      const token = 'thisismytoken';
      saveTokenInFile('thisismytoken');

      const fileToken = Buffer.from(fs.readFileSync(process.cwd() + '/auth-token.txt')).toString();

      expect(fileToken).toBe(token);
    });
  });

  describe('generateAndSaveToken', () => {
    it('should return a string with token', () => {
      const fastify = Fastify({ logger: { level: 'error' } });
      fastify.decorate('authToken', false);

      const token = generateAndSaveToken(fastify);

      expect(typeof token).toBe('string');
    });

    it('should return a fastify instance with authToken fill with token', () => {
      const fastify: FastifyInstanceAuth = Fastify({ logger: { level: 'error' } });
      fastify.decorate('authToken', false);

      const token = generateAndSaveToken(fastify);

      expect(fastify.authToken).toEqual(token);
    });
  });

  describe('checkTokenValidity', () => {
    it('should verify token validity', () => {
      const token = generateToken();

      const jwtTokenContent = checkTokenValidity(token);
      expect(jwtTokenContent).toMatchObject({ pkg: 'monity' });
    });

    it('should verify token validity and return error if token is expired', () => {
      expect(() => {
        checkTokenValidity(expiredToken);
      }).toThrow(new Error('jwt expired'));
    });
  });

  describe('verifyAuth', () => {
    let fastify: FastifyInstanceAuth, token, request, response, done;
    beforeEach(() => {
      fastify = Fastify({ logger: { level: 'error' } });
      fastify.decorate('authToken', false);

      token = generateAndSaveToken(fastify);
      request = {
        headers: {
          Authorization: token,
        },
      };
      response = {
        status: jest.fn(() => ({ send: jest.fn() })),
      };
      done = jest.fn();
    });

    it("should return unauthorized when we don't provide token", () => {
      request = { headers: {} };
      verifyAuth(fastify)(request, response, done);

      expect(done).toHaveBeenCalled();

      expect(response.status).toHaveBeenCalled();
      expect(response.status).toHaveBeenCalledWith(401);
    });

    it("should return forbidden when we don't provide an expired token", () => {
      request = { headers: { Authorization: expiredToken } };
      fastify.authToken = expiredToken;
      verifyAuth(fastify)(request, response, done);

      expect(done).toHaveBeenCalled();

      expect(response.status).toHaveBeenCalled();
      expect(response.status).toHaveBeenCalledWith(403);
    });

    it("should res nothing if everything it's good", () => {
      verifyAuth(fastify)(request, response, done);

      expect(done).toHaveBeenCalled();
      expect(response.status).not.toHaveBeenCalled();
    });
  });
});

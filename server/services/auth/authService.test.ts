import jwt from 'jsonwebtoken';
import fs from 'fs';
import Fastify from 'fastify';

import {
  generateToken,
  saveTokenInFile,
  generateAndSaveToken,
  checkTokenValidity,
  FastifyInstanceAuth,
} from './authService';

describe('Auth Service', () => {
  const secretAuthKey = 'Thisismy@uthSecret190';
  beforeAll(() => {
    process.env = Object.assign(process.env, { AUTH_SECRET: secretAuthKey });
  });

  describe('generateToken', () => {
    it('should return a token when we called it', () => {
      const token = generateToken();
      expect(typeof token).toBe('string');
      const jwtTokenContent = jwt.verify(token, secretAuthKey);
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

      const jwtTokenContent = jwt.verify(token, secretAuthKey);

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

    it('should verify token validity', () => {
      expect(() => {
        const token =
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwa2ciOiJtb25pdHkiLCJpYXQiOjE1Nzk3MzAwOTIsImV4cCI6MTU3OTczMDA5M30.reVvf50A1nqFtpAn0bNw8ldNgE1NZ9E_mJO-F3iY96c';

        checkTokenValidity(token);
      }).toThrow(new Error('jwt expired'));
    });
  });

  describe('verifyAuth', () => {
    // TODO: Need to add Verify Auth Tests
  });
});

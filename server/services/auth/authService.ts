import { forbidden, unauthorized } from '@hapi/boom';
import jwt from 'jsonwebtoken';
import { FastifyInstance, FastifyMiddleware } from 'fastify';
import { writeFileSync } from 'fs';

import { HandlingBoom } from '../httpHandling/httpHandlingService';

export const generateToken = (): void => {
  const secret = process.env.AUTH_SECRET || 'monity-secret';
  const token = jwt.sign({ foo: 'bar' }, secret, { expiresIn: '1d' });
  return token;
};

export const saveTokenInFile = (token): void => {
  return writeFileSync(__dirname + 'auth-token.txt', token);
};

export const generateAndSaveToken = (fastify: FastifyInstance): void => {
  const token = generateToken();

  //@ts-ignore
  fastify.authToken = token;

  return token;
};

export const checkTokenValidity = (token: string): string | Error => {
  return jwt.verify(token, process.env.AUTH_SECRET);
};

export const verifyAuth: FastifyMiddleware = (request, reply, done) => {
  let token;

  if (request.headers.authorization || request.headers.Authorization) {
    token = request.headers.authorization || request.headers.Authorization;
  }

  if (token) {
    try {
      checkTokenValidity(token);
      done();
    } catch (error) {
      HandlingBoom(forbidden('Token expired !'), reply);
      done();
    }
  } else {
    HandlingBoom(unauthorized(), reply);
    done();
  }
};

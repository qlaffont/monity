/* eslint-disable @typescript-eslint/no-explicit-any */
import { forbidden, unauthorized } from '@hapi/boom';
import jwt from 'jsonwebtoken';
import { FastifyInstance } from 'fastify';
import { writeFileSync } from 'fs';

import { HandlingBoom } from '../httpHandling/httpHandlingService';

let SECRET = 'monity-secret';

if (process.env.AUTH_SECRET && process.env.AUTH_SECRET !== '') {
  SECRET = process.env.AUTH_SECRET;
}

export interface FastifyInstanceAuth extends FastifyInstance {
  authToken?: string | boolean;
}

export const generateToken = (): string => {
  const token = jwt.sign({ pkg: 'monity' }, SECRET, { expiresIn: '1d' });
  return token;
};

export const saveTokenInFile = (token): void => {
  return writeFileSync(process.cwd() + '/auth-token.txt', token);
};

export const generateAndSaveToken = (fastify: FastifyInstanceAuth): string => {
  const token = generateToken();

  fastify.authToken = token;

  return token;
};

export const checkTokenValidity = (token: string): any | Error => {
  return jwt.verify(token, SECRET);
};

export const verifyAuth = (fastify: FastifyInstanceAuth) => (request, reply, done): void => {
  let token;

  if (request.headers.authorization || request.headers.Authorization) {
    token = request.headers.authorization || request.headers.Authorization;
  }

  if (token && fastify.authToken && token === fastify.authToken) {
    try {
      checkTokenValidity(token);
      done();
    } catch (error) {
      fastify.authToken = false;
      HandlingBoom(forbidden('Token expired !'), reply);
      done();
    }
  } else {
    HandlingBoom(unauthorized(), reply);
    done();
  }
};

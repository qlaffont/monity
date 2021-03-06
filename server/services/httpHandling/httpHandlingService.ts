/* eslint-disable @typescript-eslint/no-explicit-any */
import { Boom, badRequest, forbidden, notFound, badImplementation } from '@hapi/boom';
import { FastifyReply } from 'fastify';

interface BoomOptions {
  statusCode?: number;
  data?: object;
}

interface BoomMessage {
  output: {
    payload: {
      message?: string;
      data?: any;
      statusCode: number;
    };
    statusCode: number;
  };
}

export const HandlingBoom = (obj: Boom<any> | BoomMessage, res: FastifyReply<any>): void => {
  if (obj.output.payload.message === '') {
    delete obj.output.payload.message;
  }
  res.status(obj.output.statusCode).send(obj.output.payload);
};

export const ReturnFormError = (res: FastifyReply<any>): void => {
  const error = badRequest('Form Error');
  HandlingBoom(error, res);
};

export const ReturnSuccess = (res: FastifyReply<any>, msg = 'Success', options: BoomOptions = {}): void => {
  const statusCode = options.statusCode || 200;

  const boomMessage: BoomMessage = {
    output: { payload: { message: msg, statusCode: statusCode, data: options.data || {} }, statusCode },
  };

  HandlingBoom(boomMessage, res);
};

export const HandlingError = (res: FastifyReply<any>, err: Error): void => {
  switch (err.message) {
    case 'Forbidden':
      HandlingBoom(forbidden('You are not allowed to do that !'), res);
      break;
    case 'Not Found':
      HandlingBoom(notFound('Element Not found'), res);
      break;
    default:
      HandlingBoom(badImplementation('Server Error'), res);
      break;
  }
};

export default {
  HandlingBoom,
  ReturnFormError,
  ReturnSuccess,
  HandlingError,
};

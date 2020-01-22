/* eslint-disable @typescript-eslint/no-explicit-any */
import { Boom, badRequest, forbidden, notFound, badImplementation } from '@hapi/boom';
import { FastifyReply } from 'fastify';

interface BoomOptions {
  statusCode?: number;
  data?: object;
}

const HandlingBoom = (obj: Boom<any>, res: FastifyReply<any>): void => {
  if (obj.output.payload.message === '') {
    delete obj.output.payload.message;
  }
  res.status(obj.output.statusCode).send(obj.output.payload);
};

const ReturnFormError = (res: FastifyReply<any>): void => {
  const error = badRequest('Form Error');
  HandlingBoom(error, res);
};

const ReturnSuccess = (res: FastifyReply<any>, msg = 'Success', options: BoomOptions = {}): void => {
  const boomMessage = new Boom(msg, {
    statusCode: options.statusCode || 200,
    data: options.data || {},
  });

  HandlingBoom(boomMessage, res);
};

const HandlingError = (res: FastifyReply<any>, err: Error): void => {
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

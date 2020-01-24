/* eslint-disable @typescript-eslint/no-explicit-any */
import { forbidden } from '@hapi/boom';
import { ReturnSuccess, HandlingBoom } from './../../services/httpHandling/httpHandlingService';
import { AuthService } from './authService';
import { FastifyInstanceAuth } from './../../services/auth/authService';
import { FastifyReply, FastifyRequest } from 'fastify';

export class AuthController {
  public static generateToken(_req: FastifyRequest, res: FastifyReply<any>, fastify: FastifyInstanceAuth): void {
    try {
      const token = AuthService.generateToken(fastify);

      ReturnSuccess(res, 'Token successfully created !', { data: { token: token } });
    } catch (error) {
      HandlingBoom(forbidden(error.message), res);
    }
  }
}

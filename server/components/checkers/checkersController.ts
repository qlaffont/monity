/* eslint-disable @typescript-eslint/no-explicit-any */
import { notFound } from '@hapi/boom';
import { HandlingBoom } from '../../services/httpHandling/httpHandlingService';
import { CheckersService } from './checkersService';
import { ReturnSuccess, ReturnFormError } from '../../services/httpHandling/httpHandlingService';
import { FastifyRequest, FastifyReply } from 'fastify';

export class CheckersController {
  public static async addChecker(req: FastifyRequest, res: FastifyReply<any>): Promise<any> {
    try {
      const checker = await CheckersService.addChecker(req.body);
      ReturnSuccess(res, 'Checker successfully created !', { data: checker });
    } catch (error) {
      ReturnFormError(res);
    }
  }

  public static async editChecker(req: FastifyRequest, res: FastifyReply<any>, worker): Promise<any> {
    try {
      const checker = await CheckersService.editChecker(req.params.checkerId, req.body, worker);
      ReturnSuccess(res, 'Checker successfully edited !', { data: checker });
    } catch (error) {
      ReturnFormError(res);
    }
  }

  public static async deleteChecker(req: FastifyRequest, res: FastifyReply<any>, worker): Promise<any> {
    try {
      await CheckersService.deleteChecker(req.params.checkerId, worker);
      ReturnSuccess(res, 'Checker successfully deleted !');
    } catch (error) {
      ReturnFormError(res);
    }
  }

  public static async getCheckers(_req: FastifyRequest, res: FastifyReply<any>): Promise<any> {
    try {
      const checkers = await CheckersService.getCheckers();
      ReturnSuccess(res, undefined, { data: checkers });
    } catch (error) {
      HandlingBoom(notFound('Checkers not found'), res);
    }
  }

  public static async getCheckerById(req: FastifyRequest, res: FastifyReply<any>): Promise<any> {
    try {
      const checker = await CheckersService.getCheckerById(req.params.checkerId);
      ReturnSuccess(res, undefined, { data: checker });
    } catch (error) {
      HandlingBoom(notFound('Checker not found'), res);
    }
  }

  public static async startChecker(req: FastifyRequest, res: FastifyReply<any>, worker): Promise<any> {
    try {
      await CheckersService.startChecker(req.params.checkerId, worker);
      ReturnSuccess(res, 'Checker Started');
    } catch (error) {
      HandlingBoom(notFound('Checker not found'), res);
    }
  }

  public static async stopChecker(req: FastifyRequest, res: FastifyReply<any>, worker): Promise<any> {
    try {
      await CheckersService.stopChecker(req.params.checkerId, worker);
      ReturnSuccess(res, 'Checker Stopped');
    } catch (error) {
      HandlingBoom(notFound('Checker not found'), res);
    }
  }
}

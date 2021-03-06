/* eslint-disable @typescript-eslint/no-explicit-any */
import { HandlingBoom } from './../../services/httpHandling/httpHandlingService';
import { DashboardService } from './dashboardService';
import { FastifyRequest, FastifyReply } from 'fastify';
import { ReturnSuccess } from '../../services/httpHandling/httpHandlingService';
import { badImplementation } from '@hapi/boom';

export class DashboardController {
  public static async getCheckers(_req: FastifyRequest, res: FastifyReply<any>): Promise<any> {
    try {
      const result = await DashboardService.getCheckers();
      ReturnSuccess(res, undefined, { data: result });
    } catch (error) {
      HandlingBoom(badImplementation(), res);
    }
  }

  public static async getMetricsByCheckerId(req: FastifyRequest, res: FastifyReply<any>): Promise<any> {
    try {
      const result = await DashboardService.getMetricsByCheckerIdCache(req.params.id);
      ReturnSuccess(res, undefined, { data: result });
    } catch (error) {
      HandlingBoom(badImplementation(), res);
    }
  }
}

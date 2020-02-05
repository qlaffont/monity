import { MetricsService } from './../metrics/metricsService';
/* eslint-disable @typescript-eslint/no-explicit-any */
import { notFound } from '@hapi/boom';
import { HandlingBoom } from '../../services/httpHandling/httpHandlingService';
import { ReturnSuccess } from '../../services/httpHandling/httpHandlingService';
import { FastifyRequest, FastifyReply } from 'fastify';

export class CheckersMetricsController {
  public static async getMetricsByCheckerId(req: FastifyRequest, res: FastifyReply<any>): Promise<any> {
    try {
      const metrics = await MetricsService.getMetricsByCheckerId(req.params.checkerId);
      ReturnSuccess(res, undefined, { data: metrics });
    } catch (error) {
      HandlingBoom(notFound('Checker not found'), res);
    }
  }

  public static async exportMetrics(req: FastifyRequest, res: FastifyReply<any>): Promise<any> {
    try {
      const metrics = await MetricsService.exportMetrics({
        field: req.query.field,
        filter: req.query.filter,
        checkerId: req.params.checkerId,
      });
      ReturnSuccess(res, undefined, { data: metrics });
    } catch (error) {
      HandlingBoom(notFound('Checker not found'), res);
    }
  }
}

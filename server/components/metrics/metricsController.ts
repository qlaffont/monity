/* eslint-disable @typescript-eslint/no-explicit-any */
import { notFound } from '@hapi/boom';
import { HandlingBoom } from '../../services/httpHandling/httpHandlingService';
import { MetricsService } from './metricsService';
import { ReturnSuccess, ReturnFormError } from '../../services/httpHandling/httpHandlingService';
import { FastifyRequest, FastifyReply } from 'fastify';

export class MetricsController {
  public static async addMetric(req: FastifyRequest, res: FastifyReply<any>): Promise<any> {
    try {
      const metric = await MetricsService.addMetric(req.body);
      ReturnSuccess(res, 'Metric successfully created !', { data: metric });
    } catch (error) {
      ReturnFormError(res);
    }
  }

  public static async deleteMetric(req: FastifyRequest, res: FastifyReply<any>): Promise<any> {
    try {
      await MetricsService.deleteMetric(req.params.metricId);
      ReturnSuccess(res, 'Metric successfully deleted !');
    } catch (error) {
      ReturnFormError(res);
    }
  }

  public static async getMetrics(_req: FastifyRequest, res: FastifyReply<any>): Promise<any> {
    try {
      const metrics = await MetricsService.getMetrics();
      ReturnSuccess(res, undefined, { data: metrics });
    } catch (error) {
      HandlingBoom(notFound('Metrics not found'), res);
    }
  }

  public static async getMetricById(req: FastifyRequest, res: FastifyReply<any>): Promise<any> {
    try {
      const metric = await MetricsService.getMetricById(req.params.metricId);
      ReturnSuccess(res, undefined, { data: metric });
    } catch (error) {
      HandlingBoom(notFound('Metric not found'), res);
    }
  }

  public static async prometheusMetrics(_req: FastifyRequest, res: FastifyReply<any>): Promise<any> {
    try {
      if (process.env.DISABLE_PROMETHEUS) {
        throw new Error('Prometheus export is disabled.');
      }
      const result = await MetricsService.prometheusExport();
      return res.status(200).send(result);
    } catch (error) {
      console.log(error);
      return res.code(500).send('monity_up 0');
    }
  }
}

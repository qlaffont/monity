import { postMetric, deleteMetric, getMetrics, getMetric } from './metricsSchema';
import { MetricsController } from './metricsController';

export default (app): void => {
  app.post('/metrics', { schema: postMetric }, (req, res) => MetricsController.addMetric(req, res));

  app.delete('/metrics/:metricId', { schema: deleteMetric }, (req, res) => MetricsController.deleteMetric(req, res));

  app.get('/metrics', { schema: getMetrics }, (req, res) => MetricsController.getMetrics(req, res));

  app.get('/metrics/:metricId', { schema: getMetric }, (req, res) => MetricsController.getMetricById(req, res));
};

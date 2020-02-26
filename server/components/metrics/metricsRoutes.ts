import { postMetric, deleteMetric, getMetrics, getMetric, getMetricPrometheus } from './metricsSchema';
import { MetricsController } from './metricsController';
import { verifyAuth } from '../../services/auth/authService';

export default (app): void => {
  app.post('/metrics', { schema: postMetric, onRequest: verifyAuth(app) }, (req, res) =>
    MetricsController.addMetric(req, res),
  );

  app.delete('/metrics/:metricId', { schema: deleteMetric, onRequest: verifyAuth(app) }, (req, res) =>
    MetricsController.deleteMetric(req, res),
  );

  app.get('/metrics/all', { schema: getMetrics, onRequest: verifyAuth(app) }, (req, res) =>
    MetricsController.getMetrics(req, res),
  );

  app.get('/metrics/:metricId', { schema: getMetric, onRequest: verifyAuth(app) }, (req, res) =>
    MetricsController.getMetricById(req, res),
  );

  app.get('/metrics', { schema: getMetricPrometheus }, (req, res) => MetricsController.prometheusMetrics(req, res));
};

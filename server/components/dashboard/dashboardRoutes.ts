import { DashboardController } from './dashboardController';
import { getMetrics } from './dashboardSchema';

export default (app): void => {
  app.get('/dashboard/metrics', { schema: getMetrics }, (req, res) => DashboardController.getMetrics(req, res));
};

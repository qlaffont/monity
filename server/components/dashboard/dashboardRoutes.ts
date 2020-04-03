import { DashboardController } from './dashboardController';
import { getMetricsByCheckerId, getCheckers } from './dashboardSchema';

export default (app): void => {
  app.get('/dashboard/checkers', { schema: getCheckers }, (req, res) => DashboardController.getCheckers(req, res));
  app.get('/dashboard/metrics/:id', { schema: getMetricsByCheckerId }, (req, res) =>
    DashboardController.getMetricsByCheckerId(req, res),
  );
};

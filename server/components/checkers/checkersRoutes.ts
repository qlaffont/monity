import {
  postChecker,
  putChecker,
  deleteChecker,
  getCheckers,
  getChecker,
  startChecker,
  stopChecker,
  getMetricsByCheckerId,
  getExportMetricsByCheckerId,
} from './checkersSchema';

import { CheckersController } from './checkersController';
import { CheckersMetricsController } from './checkersMetricsController';

export default (app, worker): void => {
  app.post('/checkers', { schema: postChecker }, (req, res) => CheckersController.addChecker(req, res));

  app.put('/checkers/:checkerId', { schema: putChecker }, (req, res) =>
    CheckersController.editChecker(req, res, worker),
  );

  app.delete('/checkers/:checkerId', { schema: deleteChecker }, (req, res) =>
    CheckersController.deleteChecker(req, res, worker),
  );

  app.get('/checkers', { schema: getCheckers }, (req, res) => CheckersController.getCheckers(req, res));

  app.get('/checkers/:checkerId', { schema: getChecker }, (req, res) => CheckersController.getCheckerById(req, res));

  app.put('/checkers/:checkerId/start', { schema: startChecker }, (req, res) =>
    CheckersController.startChecker(req, res, worker),
  );

  app.put('/checkers/:checkerId/stop', { schema: stopChecker }, (req, res) =>
    CheckersController.stopChecker(req, res, worker),
  );

  app.get('/checkers/:checkerId/metrics', { schema: getMetricsByCheckerId }, (req, res) =>
    CheckersMetricsController.getMetricsByCheckerId(req, res),
  );

  app.get('/checkers/:checkerId/metrics/export', { schema: getExportMetricsByCheckerId }, (req, res) =>
    CheckersMetricsController.exportMetrics(req, res),
  );
};
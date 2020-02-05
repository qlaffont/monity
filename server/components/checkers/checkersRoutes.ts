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
import { verifyAuth } from '../../services/auth/authService';

export default (app, worker): void => {
  app.post('/checkers', { schema: postChecker, onRequest: verifyAuth(app) }, (req, res) =>
    CheckersController.addChecker(req, res),
  );

  app.put('/checkers/:checkerId', { schema: putChecker, onRequest: verifyAuth(app) }, (req, res) =>
    CheckersController.editChecker(req, res, worker),
  );

  app.delete('/checkers/:checkerId', { schema: deleteChecker, onRequest: verifyAuth(app) }, (req, res) =>
    CheckersController.deleteChecker(req, res, worker),
  );

  app.get('/checkers', { schema: getCheckers, onRequest: verifyAuth(app) }, (req, res) =>
    CheckersController.getCheckers(req, res),
  );

  app.get('/checkers/:checkerId', { schema: getChecker, onRequest: verifyAuth(app) }, (req, res) =>
    CheckersController.getCheckerById(req, res),
  );

  app.put('/checkers/:checkerId/start', { schema: startChecker, onRequest: verifyAuth(app) }, (req, res) =>
    CheckersController.startChecker(req, res, worker),
  );

  app.put('/checkers/:checkerId/stop', { schema: stopChecker, onRequest: verifyAuth(app) }, (req, res) =>
    CheckersController.stopChecker(req, res, worker),
  );

  app.get('/checkers/:checkerId/metrics', { schema: getMetricsByCheckerId, onRequest: verifyAuth(app) }, (req, res) =>
    CheckersMetricsController.getMetricsByCheckerId(req, res),
  );

  app.get(
    '/checkers/:checkerId/metrics/export',
    { schema: getExportMetricsByCheckerId, onRequest: verifyAuth(app) },
    (req, res) => CheckersMetricsController.exportMetrics(req, res),
  );
};

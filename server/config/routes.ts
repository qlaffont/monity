// @ts-nocheck
import { FastifyInstance } from 'fastify';

import PingRoutes from '../components/ping/pingRoutes';
import AuthRoutes from '../components/auth/authRoutes';
import GroupsRoutes from '../components/groups/groupsRoutes';
import CheckersRoutes from '../components/checkers/checkersRoutes';
import DashboardRoutes from '../components/dashboard/dashboardRoutes';
import MetricsRoutes from '../components/metrics/metricsRoutes';

import metricsWorker from '../components/metrics/metricsWorker';
import checkersWorker from '../components/checkers/checkersWorker';

export default (app: FastifyInstance, worker): void => {
  PingRoutes(app);
  AuthRoutes(app);
  GroupsRoutes(app);
  MetricsRoutes(app);
  CheckersRoutes(app, worker);
  DashboardRoutes(app);

  metricsWorker(app, worker);
  checkersWorker(app, worker);
};

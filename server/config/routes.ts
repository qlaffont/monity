// @ts-nocheck
import { FastifyInstance } from 'fastify';

import PingRoutes from '../components/ping/pingRoutes';
import AuthRoutes from '../components/auth/authRoutes';
import GroupsRoutes from '../components/groups/groupsRoutes';
import CheckersRoutes from '../components/checkers/checkersRoutes';
import metricsRoutes from '../components/metrics/metricsRoutes';

export default (app: FastifyInstance, worker): void => {
  PingRoutes(app);
  AuthRoutes(app);
  GroupsRoutes(app);
  metricsRoutes(app);
  CheckersRoutes(app, worker);
};

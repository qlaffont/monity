// @ts-nocheck
import { FastifyInstance } from 'fastify';

import PingRoutes from '../components/ping/pingRoutes';
import AuthRoutes from '../components/auth/authRoutes';
import GroupsRoutes from '../components/groups/groupsRoutes';
import CheckersRoutes from '../components/checkers/checkersRoutes';

export default (app: FastifyInstance, worker): void => {
  PingRoutes(app);
  AuthRoutes(app);
  GroupsRoutes(app);
  CheckersRoutes(app, worker);
};

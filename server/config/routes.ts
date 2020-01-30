// @ts-nocheck
import { FastifyInstance } from 'fastify';

import PingRoutes from '../components/ping/pingRoutes';
import AuthRoutes from '../components/auth/authRoutes';
import GroupsRoutes from '../components/groups/groupsRoutes';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (app: FastifyInstance, worker): void => {
  PingRoutes(app);
  AuthRoutes(app);
  GroupsRoutes(app);
};

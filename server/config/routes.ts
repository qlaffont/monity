// @ts-nocheck
import PingRoutes from '../components/ping/pingRoutes';
import AuthRoutes from '../components/auth/authRoutes';
import { FastifyInstance } from 'fastify';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (app: FastifyInstance, worker): void => {
  PingRoutes(app);
  AuthRoutes(app);
};

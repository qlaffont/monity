import PingRoutes from '../components/ping/pingRoutes';
import { FastifyInstance } from 'fastify';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (app: FastifyInstance, worker): void => {
  PingRoutes(app);
};

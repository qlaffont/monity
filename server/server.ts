import Fastify from 'fastify';
import Next from 'next';
import { Worker } from 'worker_threads';

import conf from '../next.config';
import RouteLoaderConfig from './config/routes';

const fastify = Fastify({ logger: { level: 'error' } });

const port = parseInt(process.env.PORT || '3000', 10);
const dev = process.env.NODE_ENV !== 'production';

const worker = new Worker('./server/worker/index.js');

fastify.register((fastify, _opts, next) => {
  const app = Next({ dev, conf: conf });
  app
    .prepare()
    .then(() => {
      const handle = app.getRequestHandler();
      if (dev) {
        fastify.get('/_next/*', (req, reply) => {
          return handle(req.req, reply.res).then(() => {
            reply.sent = true;
          });
        });
      }

      // Load Routes
      RouteLoaderConfig(fastify, worker);

      fastify.all('/*', (req, reply) => {
        return handle(req.req, reply.res).then(() => {
          reply.sent = true;
        });
      });

      fastify.setNotFoundHandler((request, reply) => {
        return app.render404(request.req, reply.res).then(() => {
          reply.sent = true;
        });
      });

      next();
    })
    .catch(err => next(err));
});

fastify.listen(port, err => {
  if (err) throw err;
  console.log(`> Ready on http://localhost:${port}`);
});

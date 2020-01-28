import Fastify, { FastifyInstance } from 'fastify';
import Next from 'next';
import { Worker } from 'worker_threads';

import conf from '../next.config';
import RouteLoaderConfig from './config/routes';

const port = parseInt(process.env.PORT || '3000', 10);
const dev = process.env.NODE_ENV !== 'production';

const worker = new Worker('./server/worker/index.js');

const run = (): void => {
  const fastify = Fastify({ logger: { level: 'error' } });

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

        fastify.decorate('authToken', false);

        fastify.addHook('onRequest', (_request, reply, done) => {
          reply.headers({
            'Access-Control-Allow-Methods': 'GET, PUT, DELETE, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
            'Access-Control-Allow-Origin': '*',
          });
          done();
        });

        if (process.env.NODE_ENV !== 'production') {
          fastify.register(require('fastify-swagger'), {
            routePrefix: '/documentation',
            mode: 'dynamic',
            exposeRoute: true,
            swagger: {
              info: {
                title: 'Monity',
                version: require('../package.json').version,
              },
              externalDocs: {
                url: 'https://github.com/qlaffont/monity',
                description: 'Monity Repository',
              },
              host: 'localhost:' + port,
              schemes: ['http'],
              consumes: ['application/json'],
              produces: ['application/json'],
              securityDefinitions: {
                apiKey: {
                  type: 'apiKey',
                  name: 'Authorization',
                  in: 'header',
                },
              },
            },
          });
        }

        fastify.register(require('fastify-helmet'));

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
};

const runAppInTestMode = (): FastifyInstance => {
  const fastify = Fastify();

  fastify.decorate('authToken', false);

  fastify.addHook('onRequest', (_request, reply, done) => {
    reply.headers({
      'Access-Control-Allow-Methods': 'GET, PUT, DELETE, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
      'Access-Control-Allow-Origin': '*',
    });
    done();
  });

  fastify.register(require('fastify-helmet'));

  RouteLoaderConfig(fastify, worker);

  return fastify;
};

if (process.env.NODE_ENV !== 'test') {
  run();
}

export default runAppInTestMode;

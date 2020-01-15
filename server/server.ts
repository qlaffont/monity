import Fastify from 'fastify'
import Next from 'next'
import withSASS from  '@zeit/next-sass'
import conf from '../next.config'

const fastify = Fastify({ logger: { level: "error" } });

const port = parseInt(process.env.PORT|| "3000", 10);
const dev = process.env.NODE_ENV !== "production";

fastify.register((fastify, _opts, next) => {
  const app = Next({ dev, conf: conf});
  app
    .prepare()
    .then(() => {
      const handle = app.getRequestHandler();
      if (dev) {
        fastify.get("/_next/*", (req, reply) => {
          return handle(req.req, reply.res).then(() => {
            reply.sent = true;
          });
        });
      }

      // Add back request here
      fastify.get("/ping", (_req, reply) => {
        reply.send({message: "Ping !"})
      })

      fastify.all("/*", (req, reply) => {
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

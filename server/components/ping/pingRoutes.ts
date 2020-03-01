import { getPing } from './pingSchema';

export default (app): void => {
  app.get('/ping', { schema: getPing }, (_req, res) => res.status(200).send({ message: 'Pong !' }));
};

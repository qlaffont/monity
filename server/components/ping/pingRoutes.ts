export default (app): void => {
  app.get('/ping', (_req, res) => res.status(200).send({ message: 'Pong !' }));
};

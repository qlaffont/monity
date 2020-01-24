import { AuthController } from './authController';
import { generateToken } from './authSchema';

export default (app): void => {
  app.get('/auth/generate', { schema: generateToken }, (req, res) => AuthController.generateToken(req, res, app));
};

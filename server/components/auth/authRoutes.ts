import { AuthController } from './authController';
import { generateToken } from './authSchema';
import { HandlingBoom } from '../../services/httpHandling/httpHandlingService';
import { forbidden } from '@hapi/boom';

const localhostCheck = (req, res, done): void => {
  if (req.ip === '127.0.0.1') {
    done();
  } else {
    HandlingBoom(forbidden(), res);
  }
};

export default (app): void => {
  app.get('/auth/generate', { schema: generateToken, onRequest: localhostCheck }, (req, res) =>
    AuthController.generateToken(req, res, app),
  );
};

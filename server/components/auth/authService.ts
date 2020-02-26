import { checkTokenValidity, generateAndSaveToken, FastifyInstanceAuth } from './../../services/auth/authService';

export class AuthService {
  public static generateToken(fastify: FastifyInstanceAuth): string | Error {
    if (process.env.DISABLE_AUTH) {
      throw new Error('Authentication is deactivated');
    } else {
      if (typeof fastify.authToken === 'string') {
        let token;

        try {
          token = checkTokenValidity(fastify.authToken);
        } catch (error) {}

        if (token) {
          throw new Error('Token already exist !');
        }
      }

      return generateAndSaveToken(fastify);
    }
  }
}

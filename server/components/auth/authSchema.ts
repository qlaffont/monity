export const generateToken = {
  tags: ['Auth'],
  description: 'Generate Token for Auth',
  response: {
    200: {
      description: 'Successful response with Token',
      type: 'object',
      properties: {
        message: { type: 'string' },
        statusCode: { type: 'number' },
        data: {
          type: 'object',
          properties: {
            token: {
              type: 'string',
            },
          },
        },
      },
      example: {
        message: 'Token successfully created !',
        statusCode: 200,
        data: {
          token: 'Your Generated Token',
        },
      },
    },
    403: {
      description: 'Token Already Exist',
      type: 'object',
      properties: {
        message: { type: 'string' },
        statusCode: { type: 'number' },
        error: { type: 'string' },
      },
      example: {
        message: 'Token already set !',
        statusCode: 403,
        error: 'Forbidden',
      },
    },
  },
};

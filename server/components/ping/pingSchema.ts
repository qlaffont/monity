export const getPing = {
  tags: ['Ping'],
  description: 'Simple Check',
  response: {
    200: {
      description: 'Successful response',
      type: 'object',
      properties: {
        message: { type: 'string' },
      },
      example: {
        message: 'Pong !',
      },
    },
  },
};

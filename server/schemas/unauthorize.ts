const unauthorizeSchema = (): object => ({
  401: {
    description: 'Unauthorized',
    type: 'object',
    properties: {
      message: { type: 'string' },
      error: { type: 'string' },
      statusCode: { type: 'number' },
    },
    example: {
      statusCode: 401,
      error: 'Unauthorized',
      message: 'Unauthorized',
    },
  },
});

export default unauthorizeSchema;

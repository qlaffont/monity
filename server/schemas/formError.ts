export const formErrorSchema = (): object => ({
  400: {
    description: 'Form Error',
    type: 'object',
    properties: {
      message: { type: 'string' },
      statusCode: { type: 'number' },
      error: { type: 'string' },
    },
    example: {
      statusCode: 400,
      error: 'Bad Request',
      message: 'Form Error',
    },
  },
});

export default formErrorSchema;

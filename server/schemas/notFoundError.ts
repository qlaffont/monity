export const notFound = (msg?: string): object => ({
  404: {
    description: 'Not Found',
    type: 'object',
    properties: {
      message: { type: 'string' },
      error: { type: 'string' },
      statusCode: { type: 'number' },
    },
    example: {
      message: msg,
      statusCode: 404,
      error: 'Not Found',
    },
  },
});

export default notFound;

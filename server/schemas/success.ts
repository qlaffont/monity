export const successSchema = (msg?: string, dataProperties?: object): object => ({
  200: {
    description: 'Success',
    type: 'object',
    properties: {
      message: { type: 'string' },
      statusCode: { type: 'number' },
      data: {
        type: 'object',
        properties: dataProperties,
      },
    },
    example: {
      message: msg,
      statusCode: 200,
    },
  },
});

export const successSchemaArray = (msg?: string, dataProperties?: object): object => ({
  200: {
    description: 'Success',
    type: 'object',
    properties: {
      message: { type: 'string' },
      statusCode: { type: 'number' },
      data: {
        type: 'array',
        items: dataProperties,
      },
    },
    example: {
      message: msg,
      statusCode: 200,
    },
  },
});

export default successSchema;

const bodyParams = (params: object, required?: string[]): object => ({
  body: {
    type: 'object',
    properties: params,
    required,
  },
});

export default bodyParams;

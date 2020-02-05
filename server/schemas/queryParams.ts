const queryParams = (params: object, required?: string[]): object => ({
  query: {
    type: 'object',
    properties: params,
    required,
  },
});

export default queryParams;

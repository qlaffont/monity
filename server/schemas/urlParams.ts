const urlParams = (params): object => ({
  params: {
    type: 'object',
    properties: params,
    required: Object.keys(params),
  },
});

export default urlParams;

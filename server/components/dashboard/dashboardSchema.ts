import successSchema from '../../schemas/success';
import formErrorSchema from '../../schemas/formError';

export const groupData = {
  name: {
    type: 'string',
  },

  description: {
    type: 'string',
  },

  _id: {
    type: 'string',
  },
};

const checkerData = {
  name: {
    type: 'string',
  },

  description: {
    type: 'string',
  },

  groupId: {
    type: ['object', 'string'],
    properties: { ...groupData },
  },

  _id: {
    type: 'string',
  },
};

export const metricStatusCodeData = {
  keys: {
    type: 'array',
    items: {
      type: 'string',
    },
  },
  values: {
    type: 'array',
    items: {
      type: 'string',
    },
  },
  '2xx': {
    type: 'array',
    items: {
      type: 'number',
    },
  },
  '3xx': {
    type: 'array',
    items: {
      type: 'number',
    },
  },
  '4xx': {
    type: 'array',
    items: {
      type: 'number',
    },
  },
  '5xx': {
    type: 'array',
    items: {
      type: 'number',
    },
  },
};

export const metricMsData = {
  keys: {
    type: 'array',
    items: {
      type: 'string',
    },
  },
  values: {
    type: 'array',
    items: {
      type: 'string',
    },
  },
};

export const getMetrics = {
  tags: ['Dashboard'],
  description: 'Fetch Metrics for public use',
  response: {
    ...successSchema('Checker successfully created !', {
      groups: {
        type: 'array',
        items: {
          type: 'object',
          properties: groupData,
        },
      },
      checkers: {
        type: 'array',
        items: {
          type: 'object',
          properties: checkerData,
        },
      },
      metricsStatusCode: {
        type: 'object',
        additionalProperties: true,
      },
      metricsMs: {
        type: 'object',
        additionalProperties: true,
      },
      metricsStatusCodeSum: {
        type: 'object',
        additionalProperties: true,
      },
      metricsStatusCodeSumKeys: {
        type: 'object',
        additionalProperties: true,
      },
    }),
    ...formErrorSchema(),
  },
};

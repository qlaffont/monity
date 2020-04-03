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

export const getMetricsByCheckerId = {
  tags: ['Dashboard'],
  description: 'Fetch Metrics for public use by CheckerId',
  response: {
    ...successSchema('Checker successfully created !', {
      metricsStatusCode: {
        type: 'object',
        additionalProperties: true,
      },
      metricsMs: {
        type: 'object',
        additionalProperties: true,
      },
      metricsStatusCodeSum: {
        type: 'array',
        items: {
          type: 'number',
        },
      },
      metricsStatusCodeSumKeys: {
        type: 'array',
        items: {
          type: 'string',
        },
      },
    }),
    ...formErrorSchema(),
  },
};

export const getCheckers = {
  tags: ['Dashboard'],
  description: 'Fetch Checkers for public use by CheckerId',
  response: {
    ...successSchema('Groups & Checkers List', {
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
    }),
    ...formErrorSchema(),
  },
};

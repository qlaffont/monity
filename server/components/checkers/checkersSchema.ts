import { metricData } from './../metrics/metricsSchema';
import { successSchema, successSchemaArray } from './../../schemas/success';
import formErrorSchema from '../../schemas/formError';
import apiSecurity from '../../schemas/apiSecurity';
import bodyParams from '../../schemas/bodyParams';
import urlParams from '../../schemas/urlParams';
import notFound from '../../schemas/notFoundError';
import queryParams from '../../schemas/queryParams';
import unauthorizeSchema from '../../schemas/unauthorize';

const checkerData = {
  name: {
    type: 'string',
  },

  description: {
    type: 'string',
  },

  checkerType: {
    type: 'string',
  },

  address: {
    type: 'string',
  },

  port: {
    type: 'number',
  },

  cron: {
    type: 'string',
  },

  active: {
    type: 'boolean',
  },

  groupId: {
    type: 'object',
  },

  _id: {
    type: 'string',
  },
};

const checkerAddData = { ...checkerData };
delete checkerAddData._id;
delete checkerAddData.active;
checkerAddData.groupId.type = 'string';

const checkerEditData = {
  ...checkerData,
};

delete checkerEditData._id;
delete checkerEditData.active;
delete checkerEditData.checkerType;
delete checkerEditData.groupId;

export const postChecker = {
  tags: ['Checker'],
  description: 'Add Checker',
  ...bodyParams(checkerAddData, ['name', 'checkerType', 'address', 'cron', 'groupId']),
  response: {
    ...successSchema('Checker successfully created !', checkerData),
    ...formErrorSchema(),
    ...unauthorizeSchema(),
  },
  ...apiSecurity,
};

export const putChecker = {
  tags: ['Checker'],
  description: 'Edit Checker',
  ...bodyParams(checkerEditData),
  ...urlParams({
    checkerId: {
      type: 'string',
    },
  }),
  response: {
    ...successSchema('Checker successfully updated !', checkerData),
    ...formErrorSchema(),
    ...unauthorizeSchema(),
  },
  ...apiSecurity,
};

export const deleteChecker = {
  tags: ['Checker'],
  description: 'Delete Checker by Id',
  ...urlParams({
    checkerId: {
      type: 'string',
    },
  }),
  response: {
    ...successSchema('Checker successfully deleted !'),
    ...formErrorSchema(),
    ...unauthorizeSchema(),
  },
  ...apiSecurity,
};

export const getCheckers = {
  tags: ['Checker'],
  description: 'Get Checkers',
  response: {
    ...successSchemaArray(undefined, {
      type: 'object',
      properties: checkerData,
    }),
    ...notFound('Checkers not found'),
    ...unauthorizeSchema(),
  },
  ...apiSecurity,
};

export const getChecker = {
  tags: ['Checker'],
  description: 'Get Checker by Id',
  ...urlParams({
    checkerId: {
      type: 'string',
    },
  }),
  response: {
    ...successSchema(undefined, checkerData),
    ...notFound('Checker not found'),
    ...unauthorizeSchema(),
  },
  ...apiSecurity,
};

export const startChecker = {
  tags: ['Checker'],
  description: 'Start Checker',
  ...urlParams({
    checkerId: {
      type: 'string',
    },
  }),
  response: {
    ...successSchema('Checker Started'),
    ...notFound('Checker not found'),
    ...unauthorizeSchema(),
  },
  ...apiSecurity,
};

export const stopChecker = {
  tags: ['Checker'],
  description: 'Stop Checker',
  ...urlParams({
    checkerId: {
      type: 'string',
    },
  }),
  response: {
    ...successSchema('Checker Stopped'),
    ...notFound('Checker not found'),
    ...unauthorizeSchema(),
  },
  ...apiSecurity,
};

export const getMetricsByCheckerId = {
  tags: ['Checker', 'Metric'],
  description: 'Get Metrics by Checker Id',
  ...urlParams({
    checkerId: {
      type: 'string',
    },
  }),
  response: {
    ...successSchemaArray(undefined, {
      type: 'object',
      properties: metricData,
    }),
    ...notFound('Checker not found'),
    ...unauthorizeSchema(),
  },
  ...apiSecurity,
};

export const getExportMetricsByCheckerId = {
  tags: ['Checker', 'Metric'],
  description: 'Export Metrics by Checker Id',
  ...urlParams({
    checkerId: {
      type: 'string',
    },
  }),
  ...queryParams({
    field: {
      type: 'string',
      enum: ['ms', 'statusCode'],
    },
    filter: {
      type: 'string',
      enum: ['hour', 'day', 'week'],
    },
  }),
  response: {
    ...successSchema(undefined, {
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
    }),
    ...notFound('Checker not found'),
    ...unauthorizeSchema(),
  },
  ...apiSecurity,
};

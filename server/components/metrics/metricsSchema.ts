import { successSchema, successSchemaArray } from './../../schemas/success';
import formErrorSchema from '../../schemas/formError';
import apiSecurity from '../../schemas/apiSecurity';
import bodyParams from '../../schemas/bodyParams';
import urlParams from '../../schemas/urlParams';
import notFound from '../../schemas/notFoundError';

export const metricData = {
  ms: {
    type: 'number',
  },

  statusCode: {
    type: 'number',
  },

  checkerId: {
    type: 'object',
  },

  metricsDate: {
    type: 'number',
  },

  _id: {
    type: 'string',
  },
};

const metricAddData = { ...metricData };
delete metricAddData._id;
delete metricAddData.metricsDate;
metricAddData.checkerId.type = 'string';

export const postMetric = {
  tags: ['Metric'],
  description: 'Add Metric',
  ...bodyParams(metricAddData, ['ms', 'statusCode', 'checkerId']),
  response: {
    ...successSchema('Metric successfully created !', metricData),
    ...formErrorSchema(),
  },
  ...apiSecurity,
};

export const deleteMetric = {
  tags: ['Metric'],
  description: 'Delete Metric by Id',
  ...urlParams({
    metricId: {
      type: 'string',
    },
  }),
  response: {
    ...successSchema('Metric successfully deleted !'),
    ...formErrorSchema(),
  },
  ...apiSecurity,
};

export const getMetrics = {
  tags: ['Metric'],
  description: 'Get Metrics',
  response: {
    ...successSchemaArray(undefined, {
      type: 'object',
      properties: metricData,
    }),
    ...notFound('Metrics not found'),
  },
  ...apiSecurity,
};

export const getMetric = {
  tags: ['Metric'],
  description: 'Get Metric by Id',
  ...urlParams({
    metricId: {
      type: 'string',
    },
  }),
  response: {
    ...successSchema(undefined, metricData),
    ...notFound('Metric not found'),
  },
  ...apiSecurity,
};

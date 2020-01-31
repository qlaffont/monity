import { successSchema, successSchemaArray } from './../../schemas/success';
import formErrorSchema from '../../schemas/formError';
import apiSecurity from '../../schemas/apiSecurity';
import bodyParams from '../../schemas/bodyParams';
import urlParams from '../../schemas/urlParams';
import notFound from '../../schemas/notFoundError';

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
  },
  ...apiSecurity,
};

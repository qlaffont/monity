import { successSchema, successSchemaArray } from './../../schemas/success';
import formErrorSchema from '../../schemas/formError';
import apiSecurity from '../../schemas/apiSecurity';
import bodyParams from '../../schemas/bodyParams';
import urlParams from '../../schemas/urlParams';
import notFound from '../../schemas/notFoundError';
import unauthorizeSchema from '../../schemas/unauthorize';

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

export const postGroup = {
  tags: ['Group'],
  description: 'Add Group',
  ...bodyParams(
    {
      name: {
        type: 'string',
      },
      description: {
        type: 'string',
      },
    },
    ['name'],
  ),
  response: {
    ...successSchema('Group successfully created !', groupData),
    ...formErrorSchema(),
    ...unauthorizeSchema(),
  },
  ...apiSecurity,
};

export const putGroup = {
  tags: ['Group'],
  description: 'Edit Group',
  ...bodyParams({
    name: {
      type: 'string',
    },
    description: {
      type: 'string',
    },
  }),
  ...urlParams({
    groupId: {
      type: 'string',
    },
  }),
  response: {
    ...successSchema('Group successfully updated !', groupData),
    ...formErrorSchema(),
    ...unauthorizeSchema(),
  },
  ...apiSecurity,
};

export const deleteGroup = {
  tags: ['Group'],
  description: 'Delete Group by Id',
  ...urlParams({
    groupId: {
      type: 'string',
    },
  }),
  response: {
    ...successSchema('Group successfully deleted !'),
    ...formErrorSchema(),
    ...unauthorizeSchema(),
  },
  ...apiSecurity,
};

export const getGroups = {
  tags: ['Group'],
  description: 'Get Groups',
  response: {
    ...successSchemaArray(undefined, {
      type: 'object',
      properties: groupData,
    }),
    ...notFound('Groups not found'),
    ...unauthorizeSchema(),
  },
  ...apiSecurity,
};

export const getGroup = {
  tags: ['Group'],
  description: 'Get Group by Id',
  ...urlParams({
    groupId: {
      type: 'string',
    },
  }),
  response: {
    ...successSchema(undefined, groupData),
    ...notFound('Group not found'),
    ...unauthorizeSchema(),
  },
  ...apiSecurity,
};

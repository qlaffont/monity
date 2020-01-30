import { GroupsController } from './groupsController';
import { postGroup, putGroup, deleteGroup, getGroup, getGroups } from './groupsSchema';

export default (app): void => {
  app.post('/groups', { schema: postGroup }, (req, res) => GroupsController.createGroup(req, res));

  app.put('/groups/:groupId', { schema: putGroup }, (req, res) => GroupsController.editGroup(req, res));

  app.delete('/groups/:groupId', { schema: deleteGroup }, (req, res) => GroupsController.deleteGroup(req, res));

  app.get('/groups', { schema: getGroups }, (req, res) => GroupsController.getGroups(req, res));

  app.get('/groups/:groupId', { schema: getGroup }, (req, res) => GroupsController.getGroupById(req, res));
};

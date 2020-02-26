import { GroupsController } from './groupsController';
import { postGroup, putGroup, deleteGroup, getGroup, getGroups } from './groupsSchema';
import { verifyAuth } from '../../services/auth/authService';

export default (app): void => {
  app.post('/groups', { schema: postGroup, onRequest: verifyAuth(app) }, (req, res) =>
    GroupsController.createGroup(req, res),
  );

  app.put('/groups/:groupId', { schema: putGroup, onRequest: verifyAuth(app) }, (req, res) =>
    GroupsController.editGroup(req, res),
  );

  app.delete('/groups/:groupId', { schema: deleteGroup, onRequest: verifyAuth(app) }, (req, res) =>
    GroupsController.deleteGroup(req, res),
  );

  app.get('/groups', { schema: getGroups, onRequest: verifyAuth(app) }, (req, res) =>
    GroupsController.getGroups(req, res),
  );

  app.get('/groups/:groupId', { schema: getGroup, onRequest: verifyAuth(app) }, (req, res) =>
    GroupsController.getGroupById(req, res),
  );
};

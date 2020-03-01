import { notFound } from '@hapi/boom';
import { HandlingBoom } from './../../services/httpHandling/httpHandlingService';
/* eslint-disable @typescript-eslint/no-explicit-any */
import { GroupsService } from './groupsService';
import { ReturnSuccess, ReturnFormError } from './../../services/httpHandling/httpHandlingService';
import { FastifyRequest, FastifyReply } from 'fastify';

export class GroupsController {
  public static async createGroup(req: FastifyRequest, res: FastifyReply<any>): Promise<any> {
    try {
      const group = await GroupsService.addGroup(req.body.name, req.body.description);
      ReturnSuccess(res, 'Group successfully created !', { data: group });
    } catch (error) {
      ReturnFormError(res);
    }
  }

  public static async editGroup(req: FastifyRequest, res: FastifyReply<any>): Promise<any> {
    try {
      const group = await GroupsService.editGroup(req.params.groupId, req.body.name, req.body.description);
      ReturnSuccess(res, 'Group successfully edited !', { data: group });
    } catch (error) {
      ReturnFormError(res);
    }
  }

  public static async deleteGroup(req: FastifyRequest, res: FastifyReply<any>): Promise<any> {
    try {
      await GroupsService.deleteGroup(req.params.groupId);
      ReturnSuccess(res, 'Group successfully deleted !');
    } catch (error) {
      ReturnFormError(res);
    }
  }

  public static async getGroups(_req: FastifyRequest, res: FastifyReply<any>): Promise<any> {
    try {
      const groups = await GroupsService.getGroups();
      ReturnSuccess(res, undefined, { data: groups });
    } catch (error) {
      HandlingBoom(notFound('Groups not found'), res);
    }
  }

  public static async getGroupById(req: FastifyRequest, res: FastifyReply<any>): Promise<any> {
    try {
      const group = await GroupsService.getGroupById(req.params.groupId);
      ReturnSuccess(res, undefined, { data: group });
    } catch (error) {
      HandlingBoom(notFound('Group not found'), res);
    }
  }
}

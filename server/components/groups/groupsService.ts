import Group, { GroupType } from './groupsModel';
import { CheckersService } from '../checkers/checkersService';

export class GroupsService {
  public static async addGroup(name: string, description: string): Promise<GroupType | Error> {
    const groupData = new Group({ name, description });

    if (!name) throw Error('Name is required');

    return await groupData.save();
  }

  public static async editGroup(id: string, name: string, description: string): Promise<GroupType | Error> {
    const data = { name, description };

    return await Group.findByIdAndUpdate(
      {
        _id: id,
      },
      data,
      {
        new: true,
      },
    );
  }

  public static async deleteGroup(id: string): Promise<string | Error> {
    const group = await Group.findById(id);

    if (!group) throw new Error('Group Not Found');

    await CheckersService.deleteAllByGroupId(id);

    await Group.findByIdAndDelete(id);

    return 'Group deleted';
  }

  public static async getGroups(): Promise<GroupType[]> {
    return await Group.find();
  }

  public static async getGroupById(id: string): Promise<GroupType[]> {
    return await Group.findById(id);
  }
}

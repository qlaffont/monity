import Checker, { CheckerType, CheckerAddDataType, CheckerEditDataType } from './checkersModel';
import Group from '../groups/groupsModel';

const addressValidator = async (address, port, type): Promise<Error | void> => {
  if (type === 'http') {
    if (!(address.startsWith('http://') || address.startsWith('https://'))) throw 'Address malformated';
  } else {
    if (!port) throw 'Port is missing';
  }
};

export class CheckersService {
  public static async addChecker(data: CheckerAddDataType): Promise<CheckerType | Error> {
    const checkerData = new Checker(data);

    const group = await Group.findById(data.groupId);

    if (!group) throw new Error('Group Not Found');

    await addressValidator(data.address, data.port, data.checkerType);

    return await checkerData.save();
  }

  public static async editChecker(id: string, data: CheckerEditDataType, worker): Promise<CheckerType | Error> {
    const checker = await Checker.findById(id);

    if (!checker) throw new Error('Checker Not Found');

    if (data.address) {
      await addressValidator(data.address, data.port || checker.port, checker.checkerType);
    }

    const newChecker = await Checker.findByIdAndUpdate(
      {
        _id: id,
      },
      data,
      {
        new: true,
      },
    );

    await this.stopChecker(id, worker);

    return newChecker;
  }

  public static async deleteChecker(id: string, worker): Promise<string | Error> {
    const checker = await Checker.findById(id);

    if (!checker) throw new Error('Checker Not Found');

    worker.postMessage({ cmd: 'stop', id: checker._id });
    // TODO: Delete all metrics

    await Checker.findByIdAndDelete(id);

    return 'Checker deleted';
  }

  public static async getCheckers(): Promise<CheckerType[]> {
    return await Checker.find();
  }

  public static async getCheckerById(id: string): Promise<CheckerType[]> {
    return await Checker.findById(id);
  }

  public static async startChecker(_id: string, worker): Promise<string> {
    const { address, port, checkerType, cron, id } = await Checker.findById(_id);

    if (!id) throw new Error('Checker Not Found');

    worker.postMessage({ cmd: 'start', id, address, type: checkerType, port, cron });

    await Checker.findByIdAndUpdate(
      {
        _id: id,
      },
      { active: true },
      {
        new: true,
      },
    );

    return 'Checker started';
  }

  public static async stopChecker(_id: string, worker): Promise<string> {
    const { id } = await Checker.findById(_id);

    if (!id) throw new Error('Checker Not Found');

    worker.postMessage({ cmd: 'stop', id });

    await Checker.findByIdAndUpdate(
      {
        _id: id,
      },
      { active: false },
      {
        new: true,
      },
    );

    return 'Checker stopped';
  }

  public static async deleteAllByGroupId(groupId: string): Promise<Error | number> {
    try {
      const checkers = await Checker.find({ groupId });

      let deletedCount = 0;

      checkers.map(async checker => {
        // TODO: Remove Metrics

        await Checker.findByIdAndDelete(checker.id);
        deletedCount++;
      });

      return deletedCount;
    } catch (error) {
      throw 'Impossible to remove Checkers by Group Id';
    }
  }
}

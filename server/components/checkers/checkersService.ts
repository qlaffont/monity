import { MetricsService } from './../metrics/metricsService';
import Checker, { CheckerType, CheckerAddDataType, CheckerEditDataType } from './checkersModel';
import Group from '../groups/groupsModel';
import { addressValidator, cronValidator } from '../../../services/validator/checkerValidator';

export class CheckersService {
  public static async addChecker(data: CheckerAddDataType): Promise<CheckerType | Error> {
    const checkerData = new Checker(data);

    const group = await Group.findById(data.groupId);

    if (!group) throw new Error('Group Not Found');

    await addressValidator(data.address, data.port, data.checkerType);
    await cronValidator(data.cron);

    return await checkerData.save();
  }

  public static async editChecker(id: string, data: CheckerEditDataType, worker): Promise<CheckerType | Error> {
    const checker = await Checker.findById(id);

    if (!checker) throw new Error('Checker Not Found');

    if (data.address) {
      await addressValidator(data.address, data.port || checker.port, checker.checkerType);
    }

    if (data.cron) {
      await cronValidator(data.cron);
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
    await MetricsService.deleteAllByCheckerId(checker.id);

    await Checker.findByIdAndDelete(id);

    return 'Checker deleted';
  }

  public static async getCheckers(): Promise<CheckerType[]> {
    return await Checker.find()
      .populate('groupId')
      .exec();
  }

  public static async getCheckerById(id: string): Promise<CheckerType[]> {
    return await Checker.findById(id)
      .populate('groupId')
      .exec();
  }

  public static async startChecker(_id: string, worker): Promise<string> {
    const { address, port, checkerType, cron, _id: id } = await Checker.findById(_id);

    if (!id) throw new Error('Checker Not Found');

    worker.postMessage({ cmd: 'init', id: id.toString(), address, type: checkerType, port, cron });

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
    const { _id: id } = await Checker.findById(_id);

    if (!id) throw new Error('Checker Not Found');

    worker.postMessage({ cmd: 'stop', id: id.toString() });

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
        await MetricsService.deleteAllByCheckerId(checker.id);
        await Checker.findByIdAndDelete(checker.id);
        deletedCount++;
      });

      return deletedCount;
    } catch (error) {
      throw 'Impossible to remove Checkers by Group Id';
    }
  }
}

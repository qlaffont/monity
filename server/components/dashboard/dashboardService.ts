/* eslint-disable @typescript-eslint/no-explicit-any */
import { MetricsService, FilterEnum, FieldEnum } from './../metrics/metricsService';
import { GroupsService } from '../groups/groupsService';
import { CheckersService } from '../checkers/checkersService';
import { getKeyFormat } from '../metrics/metricsTools';
import Dashboard from './dashboardModel';

export class DashboardService {
  public static async getCheckers(): Promise<any> {
    const groups = await GroupsService.getGroups();
    let checkers = await CheckersService.getCheckers();

    // Get Only Active Checkers
    checkers = checkers.filter(checker => {
      return checker.active;
    });

    return { checkers, groups };
  }

  public static async getMetricsByCheckerIdCache(checkerId: string): Promise<any> {
    const cache = await Dashboard.findOne({ idChecker: checkerId });

    return JSON.stringify(cache);
  }

  public static async getMetricsByCheckerId(checkerId: string): Promise<any> {
    const checker = await CheckersService.getCheckerById(checkerId);

    if (!checker || !checker.active) {
      throw new Error('Checker Not Found');
    }

    const metricsStatusCode = await MetricsService.exportMetrics({
      checkerId,
      filter: FilterEnum.DAY30,
      field: FieldEnum.statusCode,
    });
    const metricsMs = await MetricsService.exportMetrics({
      checkerId,
      filter: FilterEnum.DAY30,
      field: FieldEnum.ms,
    });

    // Calculate Metrics Status Code during 30 min
    const iteration = 48;
    const actualDate = new Date();

    const metricsStatusCodeSum = new Array(iteration).fill(0);
    const metricsStatusCodeSumKeys = new Array(iteration).fill('');

    for (let index = iteration - 1; index >= 0; index--) {
      if (index !== iteration - 1) {
        actualDate.setMinutes(actualDate.getMinutes() - 30);
      }
      const previousDate = new Date(actualDate.getTime());
      previousDate.setMinutes(actualDate.getMinutes() - 30);

      if (metricsStatusCodeSumKeys[index] === '') {
        const prevStringDate = getKeyFormat(previousDate.getTime(), ['second']);
        const nextStringDate = getKeyFormat(actualDate.getTime(), ['second']);
        metricsStatusCodeSumKeys[index] = `${prevStringDate} - ${nextStringDate}`;
      }

      // Search dates who have been between previous and actual
      metricsStatusCode.keys.map((dateMetric, indexMap) => {
        if (dateMetric >= previousDate.getTime() && dateMetric <= actualDate.getTime()) {
          if (!metricsStatusCodeSum[index]) {
            metricsStatusCodeSum[index] = metricsStatusCode.values[indexMap];
          } else {
            if (metricsStatusCode.values[indexMap] > metricsStatusCodeSum[index]) {
              metricsStatusCodeSum[index] = metricsStatusCode.values[indexMap];
            }
          }
        }
      });
    }

    return { metricsMs, metricsStatusCodeSum, metricsStatusCodeSumKeys };
  }

  public static async loadCache(): Promise<void> {
    let checkers = await CheckersService.getCheckers();

    // Get Only Active Checkers
    checkers = checkers.filter(checker => {
      return checker.active;
    });

    for (let index = 0; index < checkers.length; index++) {
      const checkerItem = checkers[index];

      // @ts-ignore
      const stats = await this.getMetricsByCheckerId(checkerItem._id);
      // @ts-ignore
      let cache = await Dashboard.findOne({ idChecker: checkerItem._id });

      if (!cache) {
        cache = new Dashboard({
          //@ts-ignore
          idChecker: checkerItem._id,
          value: JSON.stringify(stats),
        });

        await cache.save();
      } else {
        await Dashboard.findOneAndUpdate(
          {
            _id: cache._id,
          },
          {
            value: JSON.stringify(stats),
            lastCache: Date.now(),
          },
        );
      }
    }
  }
}

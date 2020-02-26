/* eslint-disable @typescript-eslint/no-explicit-any */
import { MetricsService, FilterEnum, FieldEnum } from './../metrics/metricsService';
import { GroupsService } from '../groups/groupsService';
import { CheckersService } from '../checkers/checkersService';
import { getKeyFormat } from '../metrics/metricsTools';

export class DashboardService {
  public static async getMetrics(): Promise<any> {
    const groups = await GroupsService.getGroups();
    let checkers = await CheckersService.getCheckers();
    const metricsStatusCode = {};
    const metricsMs = {};
    const metricsStatusCodeSum = {};
    let metricsStatusCodeSumKeys;

    // Get Only Active Checkers
    checkers = checkers.filter(checker => {
      return checker.active;
    });

    // Fetch Metrics for Each Active Checker
    for (let index = 0; index < checkers.length; index++) {
      const checker = checkers[index];
      // @ts-ignore
      const checkerId = checker._id;

      metricsStatusCode[checkerId] = await MetricsService.exportMetrics({
        checkerId,
        filter: FilterEnum.DAY30,
        field: FieldEnum.statusCode,
      });
      metricsMs[checkerId] = await MetricsService.exportMetrics({
        checkerId,
        filter: FilterEnum.DAY30,
        field: FieldEnum.ms,
      });

      // Calculate Metrics Status Code during 30 min
      const iteration = 48;
      const actualDate = new Date();

      metricsStatusCodeSum[checkerId] = new Array(iteration).fill(0);
      metricsStatusCodeSumKeys = new Array(iteration).fill('');

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
        metricsStatusCode[checkerId].keys.map((dateMetric, indexMap) => {
          if (
            new Date(dateMetric).getTime() >= previousDate.getTime() &&
            new Date(dateMetric).getTime() <= actualDate.getTime()
          ) {
            if (!metricsStatusCodeSum[checkerId][index]) {
              metricsStatusCodeSum[checkerId][index] = metricsStatusCode[checkerId].values[indexMap];
            } else {
              if (metricsStatusCode[checkerId].values[indexMap] > metricsStatusCodeSum[checkerId][index]) {
                metricsStatusCodeSum[checkerId][index] = metricsStatusCode[checkerId].values[indexMap];
              }
            }
          }
        });
      }
    }

    return { groups, checkers, metricsStatusCode, metricsMs, metricsStatusCodeSum, metricsStatusCodeSumKeys };
  }
}

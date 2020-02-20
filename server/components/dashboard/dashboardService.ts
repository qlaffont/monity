/* eslint-disable @typescript-eslint/no-explicit-any */
import { MetricsService, FilterEnum, FieldEnum } from './../metrics/metricsService';
import { GroupsService } from '../groups/groupsService';
import { CheckersService } from '../checkers/checkersService';

export class DashboardService {
  public static async getMetrics(): Promise<any> {
    const groups = await GroupsService.getGroups();
    let checkers = await CheckersService.getCheckers();
    const metricsStatusCode = {};
    const metricsMs = {};

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
        filter: FilterEnum.DAY,
        field: FieldEnum.statusCode,
      });
      metricsMs[checkerId] = await MetricsService.exportMetrics({
        checkerId,
        filter: FilterEnum.DAY,
        field: FieldEnum.ms,
      });
    }

    return { groups, checkers, metricsStatusCode, metricsMs };
  }
}

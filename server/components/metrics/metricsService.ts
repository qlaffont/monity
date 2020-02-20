import { exportMetrics, exportStatusCodeMetrics } from './metricsTools';
import Metric, { MetricType, MetricAddDataType } from './metricsModel';
import Checker from '../checkers/checkersModel';

export enum FilterEnum {
  HOUR = 'hour',
  DAY = 'day',
  WEEK = 'week',
}

export enum FieldEnum {
  ms = 'ms',
  statusCode = 'statusCode',
}

interface ExportMetricsOptions {
  checkerId: string;
  filter: FilterEnum;
  field: FieldEnum;
}

export class MetricsService {
  public static async addMetric(options: MetricAddDataType): Promise<MetricType | Error> {
    const metricData = new Metric(options);

    if (!options.ms || !options.statusCode || !options.checkerId) throw Error('ms, statusCode, checkerId is required');

    const checker = await Checker.findById(options.checkerId);

    if (!checker) throw new Error('Checker Not Found');

    return await metricData.save();
  }

  public static async deleteMetric(id: string): Promise<string | Error> {
    const metric = await Metric.findById(id);

    if (!metric) throw new Error('Metric Not Found');

    await Metric.findByIdAndDelete(id);

    return 'Metric deleted';
  }

  public static async getMetrics(): Promise<MetricType[]> {
    return await Metric.find()
      .populate('checkerId')
      .exec();
  }

  public static async getMetricsByCheckerId(checkerId: string): Promise<MetricType[]> {
    const checker = await Checker.findById(checkerId);

    if (!checker) throw new Error('Checker Not Found');

    return await Metric.find({ checkerId })
      .populate('checkerId')
      .exec();
  }

  public static async getMetricById(id: string): Promise<MetricType[]> {
    return await Metric.findById(id)
      .populate('checkerId')
      .exec();
  }

  public static async deleteAllByCheckerId(checkerId: string): Promise<Error | number> {
    try {
      const metrics = await Metric.find({ checkerId });

      let deletedCount = 0;

      metrics.map(async metric => {
        await Metric.findByIdAndDelete(metric.id);
        deletedCount++;
      });

      return deletedCount;
    } catch (error) {
      throw 'Impossible to remove Metrics by Checker Id';
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public static async exportMetrics(options: ExportMetricsOptions): Promise<any> {
    const checker = await Checker.findById(options.checkerId);

    if (!checker) throw new Error('Checker Not Found');

    const searchDate = new Date();

    switch (options.filter) {
      case 'day':
        searchDate.setDate(searchDate.getDate() - 1);
        break;
      case 'week':
        searchDate.setDate(searchDate.getDate() - 7);
        break;
      default:
        searchDate.setHours(searchDate.getHours() - 1);
        break;
    }

    const metrics = await Metric.find({ checkerId: options.checkerId, metricsDate: { $gt: searchDate.getTime() } });

    let metricsObject = exportMetrics(metrics, options.filter, options.field);

    if (options.field === 'statusCode') {
      metricsObject = exportStatusCodeMetrics(metricsObject);
    }

    return metricsObject;
  }
}

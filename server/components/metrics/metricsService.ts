import Metric, { MetricType, MetricAddDataType } from './metricsModel';
import Checker from '../checkers/checkersModel';

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
    return await Metric.find();
  }

  public static async getMetricsByCheckerId(checkerId: string): Promise<MetricType[]> {
    const checker = await Checker.findById(checkerId);

    if (!checker) throw new Error('Checker Not Found');

    return await Metric.find({ checkerId });
  }

  public static async getMetricById(id: string): Promise<MetricType[]> {
    return await Metric.findById(id);
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
}

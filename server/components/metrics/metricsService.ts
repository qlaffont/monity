import { exportMetrics, exportStatusCodeMetrics } from './metricsTools';
import Metric, { MetricType, MetricAddDataType } from './metricsModel';
import Checker from '../checkers/checkersModel';
import fetch from 'node-fetch';
import { formatMessage } from '../../services/templates/format';
import { version } from '../../../package.json';

export enum FilterEnum {
  HOUR = 'hour',
  DAY = 'day',
  DAY30 = 'day-30',
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
      case 'day-30':
        searchDate.setDate(searchDate.getDate() - 1);
        break;
      case 'week':
        searchDate.setDate(searchDate.getDate() - 7);
        break;
      default:
        searchDate.setHours(searchDate.getHours() - 1);
        break;
    }

    const metrics = await Metric.find({ checkerId: options.checkerId, metricsDate: { $gte: searchDate.getTime() } });

    let metricsObject = exportMetrics(metrics, options.filter, options.field);

    if (options.field === 'statusCode') {
      metricsObject = exportStatusCodeMetrics(metricsObject);
    }

    return metricsObject;
  }

  public static async sendWebhookNotif(options: MetricAddDataType): Promise<void> {
    if (!options.ms || !options.statusCode || !options.checkerId) throw Error('ms, statusCode, checkerId is required');

    if (process.env.WEBHOOK_URL && process.env.WEBHOOK_MESSAGE) {
      const checker = await Checker.findById(options.checkerId);
      if (!checker) throw new Error('Checker Not Found');

      const metric = await Metric.findOne({ checkerId: options.checkerId })
        .sort('metricsDate')
        .exec();

      if (metric && options.statusCode !== metric.statusCode) {
        const templateVars = [
          {
            name: 'oldStatusCode',
            content: metric.statusCode,
          },
          {
            name: 'newStatusCode',
            content: options.statusCode,
          },
          {
            name: 'checkerName',
            content: checker.name,
          },
          {
            name: 'checkerAddress',
            content: checker.checkerType === 'http' ? checker.address : checker.address + ':' + checker.port,
          },
          {
            name: 'checkerPort',
            content: checker.port,
          },
        ];

        const body = JSON.stringify({
          text: formatMessage(process.env.WEBHOOK_MESSAGE, templateVars),
          username: 'Monity',
        }).replace(/\\\\n/g, '\\n');

        // Send Notification
        await fetch(process.env.WEBHOOK_URL, {
          method: 'post',
          body,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }
  }

  public static async prometheusExport(): Promise<string> {
    let result = '';

    // Tell that monity server export is working
    result += 'monity_up 1\n';
    result += '# HELP monity_version Monity Server Version\n';
    result += `monity_version{version="${version}"} 1\n`;

    const checkers = await Checker.find({ active: true });

    for (let index = 0; index < checkers.length; index++) {
      const checker = checkers[index];

      const metric = await Metric.findOne({ checkerId: checker._id })
        .sort('metricsDate')
        .exec();

      const key = checker.name.replace(/\s/g, '').replace(/[^\w\s]/gi, '`_');
      if (metric) {
        result += `# HELP monity_checker_${key}_status Status Code for ${checker.name}\n`;
        result += `monity_checker_${key}_status ${metric.statusCode}\n`;
        result += `# HELP monity_checker_${key}_ms Response time in ms for ${checker.name}\n`;
        result += `monity_checker_${key}_ms ${metric.ms}\n`;
      }
    }

    return result;
  }
}

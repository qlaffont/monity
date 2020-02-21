/* eslint-disable @typescript-eslint/no-explicit-any */
import { MetricType } from './metricsModel';

interface ExportMetricsType {
  keys: string[];
  values: any[];
}

interface EnrichedExportMetricsType extends ExportMetricsType {
  '2xx': number[];
  '3xx': number[];
  '4xx': number[];
  '5xx': number[];
}

export const getKeyFormat = (date: number, optionsToDelete: string[] = []): string => {
  const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  };

  if (optionsToDelete.length > 0) {
    optionsToDelete.map(elem => {
      delete options[elem];
    });
  }

  return new Date(date).toLocaleDateString('fr-FR', options);
};

export const exportMetrics = (metrics: MetricType[], filterDate: string, field = 'ms'): ExportMetricsType => {
  const keys: string[] = [];
  const values: any[] = [];
  const result = {};

  if (filterDate === 'day') {
    for (let index = 0; index < metrics.length; index++) {
      const elem = metrics[index];

      if (!result[getKeyFormat(elem.metricsDate, ['minute', 'second']) + 'h']) {
        keys.push(getKeyFormat(elem.metricsDate, ['minute', 'second']) + 'h');
        values.push(elem[field]);
        result[getKeyFormat(elem.metricsDate, ['minute', 'second']) + 'h'] = true;
      }
    }
  }

  if (filterDate === 'day-30') {
    for (let index = 0; index < metrics.length; index++) {
      const elem = metrics[index];

      if (!result[getKeyFormat(elem.metricsDate, ['second'])]) {
        keys.push(getKeyFormat(elem.metricsDate, ['second']));
        values.push(elem[field]);
        result[getKeyFormat(elem.metricsDate, ['second'])] = true;
      }
    }
  }

  if (filterDate === 'week') {
    for (let index = 0; index < metrics.length; index++) {
      const elem = metrics[index];

      if (!result[getKeyFormat(elem.metricsDate, ['hour', 'minute', 'second'])]) {
        keys.push(getKeyFormat(elem.metricsDate, ['hour', 'minute', 'second']));
        values.push(elem[field]);
        result[getKeyFormat(elem.metricsDate, ['hour', 'minute', 'second'])] = true;
      }
    }
  }

  if (filterDate === 'hour') {
    for (let index = 0; index < metrics.length; index++) {
      const elem = metrics[index];
      keys.push(getKeyFormat(elem.metricsDate));
      values.push(elem[field]);
    }
  }

  return { keys, values };
};

export const exportStatusCodeMetrics = (metricsObject: ExportMetricsType): EnrichedExportMetricsType => {
  const res2xx: number[] = [];
  const res3xx: number[] = [];
  const res4xx: number[] = [];
  const res5xx: number[] = [];

  for (let index = 0; index < metricsObject.values.length; index++) {
    const value = metricsObject.values[index];
    res2xx[index] = 0;
    res3xx[index] = 0;
    res4xx[index] = 0;
    res5xx[index] = 0;

    switch (value.toString().charAt(0)) {
      case '2':
        res2xx[index] = 1;
        break;

      case '3':
        res3xx[index] = 1;
        break;

      case '4':
        res4xx[index] = 1;
        break;

      default:
        res5xx[index] = 1;
        break;
    }
  }

  return {
    ...metricsObject,
    '2xx': res2xx,
    '3xx': res3xx,
    '4xx': res4xx,
    '5xx': res5xx,
  };
};

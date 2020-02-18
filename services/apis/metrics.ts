/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { generateAxiosConfig, HTTPMethod } from './generateAxiosConfig';

export enum FilterEnum {
  HOUR = 'hour',
  DAY = 'day',
  WEEK = 'week',
}

export enum FieldEnum {
  ms = 'ms',
  statusCode = 'statusCode',
}

export const exportMetrics = (checkerId: string, field: FieldEnum, filter: FilterEnum) =>
  generateAxiosConfig(`/checkers/${checkerId}/metrics/export?field=${field}&filter=${filter}`, HTTPMethod.GET);

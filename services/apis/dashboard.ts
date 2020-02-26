/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { generateAxiosConfig, HTTPMethod } from './generateAxiosConfig';

export const getMetrics = () => generateAxiosConfig('/dashboard/metrics', HTTPMethod.GET);

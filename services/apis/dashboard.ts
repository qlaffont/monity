/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { generateAxiosConfig, HTTPMethod } from './generateAxiosConfig';

export const getMetricsByCheckerId = checkerId =>
  generateAxiosConfig(`/dashboard/metrics/${checkerId}`, HTTPMethod.GET);
export const getCheckers = () => generateAxiosConfig('/dashboard/checkers', HTTPMethod.GET);

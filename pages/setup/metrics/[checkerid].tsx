import React, { useEffect } from 'react';
import useAxios from 'axios-hooks';
import { useRouter } from 'next/router';

import Navbar from '../../../components/layout/Navbar';
import Content from '../../../components/layout/Content';
import { getCheckerById } from '../../../services/apis/checkers';
import { exportMetrics, FieldEnum, FilterEnum } from '../../../services/apis/metrics';
import { renderIcon } from '../../../components/metrics/metricsService';
import FrappeChart from '../../../components/lib/chartFrappe';

const sumArray = (array): number => {
  return array.reduce((accumulator, currentValue) => {
    if (typeof currentValue === 'string') {
      return parseInt(currentValue, 10) + accumulator;
    }
    return accumulator + currentValue;
  }, 0);
};

const avgArray = (array): number => {
  return Math.round(sumArray(array) / array.length);
};

const percentage = (num, num2): number => {
  return Math.round((num / num2) * 100);
};

const Index = (): JSX.Element => {
  const router = useRouter();
  const { checkerid: checkerId } = router.query;
  // @ts-ignore
  const [{ data, loading: isLoading }, execute] = useAxios(getCheckerById(checkerId), {
    useCache: false,
    manual: true,
  });

  const [{ data: dataMetrics, loading: isLoadingMetrics }, executeMetrics] = useAxios(
    exportMetrics(checkerId?.toString(), FieldEnum.ms, FilterEnum.HOUR),
    {
      useCache: false,
      manual: true,
    },
  );

  const [{ data: dataMetricsStatus, loading: isLoadingMetricsStatus }, executeMetricsStatus] = useAxios(
    exportMetrics(checkerId?.toString(), FieldEnum.statusCode, FilterEnum.HOUR),
    {
      useCache: false,
      manual: true,
    },
  );

  useEffect(() => {
    if (checkerId) {
      execute();
      executeMetrics();
      executeMetricsStatus();
    }
  }, [checkerId]);

  const renderAddress = (checker): JSX.Element | void => {
    if (checker) {
      switch (checker.checkerType) {
        case 'ping':
          return (
            <>
              {checker.address}
              {checker.port}
            </>
          );
          break;

        case 'http':
          return (
            <>
              <a href={checker.address} target="_blank" rel="noopener noreferrer">
                {checker.address}
              </a>
            </>
          );
          break;

        default:
          break;
      }
    }
  };

  const errorPercentage = (): number => {
    return percentage(
      sumArray(dataMetricsStatus?.data['4xx']) + sumArray(dataMetricsStatus?.data['5xx']),
      sumArray(dataMetricsStatus?.data['2xx']) + sumArray(dataMetricsStatus?.data['3xx']),
    );
  };

  return (
    <>
      <Navbar />
      <Content>
        {isLoading || isLoadingMetrics || isLoadingMetricsStatus || !dataMetrics || !dataMetricsStatus ? (
          <>Loading ....</>
        ) : (
          <>
            <h2 className="title is-2">Metrics - {data?.data.name}</h2>
            <p>{data?.data.description}</p>
            <p>
              {renderIcon(data?.data.checkerType)}
              {renderAddress(data?.data)}
            </p>
            <div className="columns mt-3">
              <div className="column">
                <div>
                  <FrappeChart
                    title="Status Code by type"
                    type="pie"
                    colors={['green', 'blue', 'orange', 'red']}
                    data={{
                      labels: ['2xx', '3xx', '4xx', '5xx'],
                      datasets: [
                        {
                          name: 'Status Code',
                          values: [
                            sumArray(dataMetricsStatus?.data['2xx']),
                            sumArray(dataMetricsStatus?.data['3xx']),
                            sumArray(dataMetricsStatus?.data['4xx']),
                            sumArray(dataMetricsStatus?.data['5xx']),
                          ],
                        },
                      ],
                    }}
                  />
                </div>
              </div>
              <div className="column">
                <h2 className="title is-3">Response Time (average)</h2>
                <div className="has-text-centered">
                  <p className="title is-2 mt-3">{avgArray(dataMetrics?.data.values)} ms</p>
                </div>
              </div>
              <div className="column">
                <h2 className="title is-3">Percentage Error (5xx/4xx)</h2>
                <div className="has-text-centered">
                  <p className="title is-2 mt-3">{errorPercentage()} %</p>
                </div>
              </div>
            </div>
            <div className="mt-3">
              <FrappeChart
                title="Response Time (in ms)"
                type="line"
                heatline
                region_fill
                data={{
                  labels: dataMetrics?.data.keys,
                  datasets: [
                    {
                      values: dataMetrics?.data.values,
                    },
                  ],
                }}
                tooltipOptions={{
                  formatTooltipY: (d): string => d + 'ms',
                }}
              />
            </div>

            <div className="mt-3">
              <FrappeChart
                title="Status Code"
                type="line"
                heatline
                region_fill
                data={{
                  labels: dataMetricsStatus?.data.keys,
                  datasets: [
                    {
                      values: dataMetricsStatus?.data.values,
                    },
                  ],
                  yRegions: [
                    {
                      label: 'Good Status Code',
                      start: 200,
                      end: 399,
                      options: { labelPos: 'right' },
                    },
                  ],
                }}
              />
            </div>
          </>
        )}
      </Content>
    </>
  );
};
export default Index;

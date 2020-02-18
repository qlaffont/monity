import React, { useEffect } from 'react';
import useAxios from 'axios-hooks';
import { useRouter } from 'next/router';

import Navbar from '../../../components/layout/Navbar';
import Content from '../../../components/layout/Content';
import { getCheckerById } from '../../../services/apis/checkers';
import { exportMetrics, FieldEnum, FilterEnum } from '../../../services/apis/metrics';
import { renderIcon } from '../../../components/metrics/metricsService';
import FrappeChart from '../../../components/lib/chartFrappe';

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

  return (
    <>
      <Navbar />
      <Content>
        {isLoading || isLoadingMetrics || isLoadingMetricsStatus ? (
          <>Loading ....</>
        ) : (
          <>
            <h2 className="title is-2">Metrics - {data?.data.name}</h2>
            <p>{data?.data.description}</p>
            <p>
              {renderIcon(data?.data.checkerType)}
              {renderAddress(data?.data)}
            </p>
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
              />
            </div>

            <div className="mt-3">
              <FrappeChart
                title="Status Code"
                type="line"
                heatline
                region_fill
                colors={['green', 'blue', 'orange', 'red']}
                data={{
                  labels: dataMetricsStatus?.data.keys,
                  datasets: [
                    {
                      values: dataMetricsStatus?.data['2xx'],
                      name: '2xx',
                    },
                    {
                      values: dataMetricsStatus?.data['3xx'],
                      name: '3xx',
                    },
                    {
                      values: dataMetricsStatus?.data['4xx'],
                      name: '4xx',
                    },
                    {
                      values: dataMetricsStatus?.data['5xx'],
                      name: '5xx',
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

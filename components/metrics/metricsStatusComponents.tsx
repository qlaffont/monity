/* eslint-disable react/prop-types */
import React from 'react';

import './metricsStatusComponents.scss';

const MetricStatusComponent = ({ metrics }): JSX.Element => {
  const RenderMetricItem = ({ value }): JSX.Element => {
    switch (value.toString().charAt(0)) {
      case '2':
        return <div className="status status-good"></div>;
        break;
      case '3':
        return <div className="status status-info"></div>;
        break;
      case '4':
        return <div className="status status-warn"></div>;
        break;
      case '5':
        return <div className="status status-danger"></div>;
        break;
      default:
        return <div className="status"></div>;
        break;
    }
  };

  return (
    <>
      <div className="metricsStatus">
        <div className="is-flex">
          {metrics.map((metricValue, index) => {
            return <RenderMetricItem value={metricValue} key={index}></RenderMetricItem>;
          })}
        </div>
        <div className="has-text-right ">
          <p className="is-size-7 has-text-grey is-italic">last 24 H (each tick = 30 min)</p>
        </div>
      </div>
    </>
  );
};

export default MetricStatusComponent;

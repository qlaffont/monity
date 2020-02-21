/* eslint-disable react/prop-types */
import React from 'react';
import useAxios from 'axios-hooks';
import PropTypes from 'prop-types';
import { getMetrics } from '../services/apis/dashboard';
import MetricStatusComponent from '../components/metrics/metricsStatusComponents';

import './index.scss';

const RenderToolTip = (description): JSX.Element => (
  <span data-tooltip={description}>
    <i className="fas fa-info-circle"></i>
  </span>
);

const RenderChecker = ({ checker, statusCode, ms }): JSX.Element => {
  const avgMS = Math.round(ms.values.reduce((item, next) => item + next, 0) / ms.values.length);

  return (
    <>
      <div className="p-1">
        <p className="has-text-weight-medium title is-5 mb-1">
          {checker.name} {checker.description && RenderToolTip(checker.description)}
        </p>
        <p>
          AVG Response time: <span className="has-text-weight-bold">{avgMS} ms</span>
        </p>
        <MetricStatusComponent metrics={statusCode}></MetricStatusComponent>
      </div>
    </>
  );
};

RenderChecker.propTypes = {
  checker: PropTypes.shape({
    name: PropTypes.string,
    address: PropTypes.string,
    checkerType: PropTypes.string,
    _id: PropTypes.string,
  }),
};

const RenderGroup = ({ group, checkers, statusCode, ms }): JSX.Element => {
  const haveCheckers = checkers.some(checker => {
    if (checker.groupId._id === group._id) {
      return true;
    }
    return false;
  });

  if (!haveCheckers) {
    return <></>;
  }

  return (
    <>
      <div className="p-1 group mb-1">
        <p className="title is-3">
          {group.name} {group.description && RenderToolTip(group.description)}
        </p>
        {checkers.map(checker => {
          if (checker.groupId._id === group._id) {
            return (
              <RenderChecker
                key={checker._id}
                checker={checker}
                statusCode={statusCode[checker._id]}
                ms={ms[checker._id]}
              />
            );
          }
        })}
      </div>
    </>
  );
};

RenderGroup.propTypes = {
  checkers: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      checkerType: PropTypes.string,
      _id: PropTypes.string,
    }),
  ),
  group: PropTypes.shape({
    name: PropTypes.string,
    description: PropTypes.string,
    _id: PropTypes.string,
  }),
};

const Index = (): JSX.Element => {
  const [{ data, loading: isLoading }] = useAxios(getMetrics());

  const renderGroups = (): JSX.Element | void => {
    if (data && data.data) {
      return (
        <>
          {data.data.groups.map(group => {
            return (
              <RenderGroup
                key={group._id}
                group={group}
                checkers={data.data.checkers}
                statusCode={data.data.metricsStatusCodeSum}
                ms={data.data.metricsMs}
              />
            );
          })}
        </>
      );
    }
  };

  return (
    <>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.12.1/css/brands.min.css" />
      <div className="container mt-5">
        <div className="card">
          <div className="card-content">
            <h1 className="title is-1"> 🖥 Monity</h1>
            {isLoading ? 'Loading...' : renderGroups()}
          </div>
        </div>
        <div className="m-3 has-text-centered">
          Status page generated with <i className="fas fa-heart has-text-danger"></i> from{' '}
          <a href="https://github.com/qlaffont/monity" target="_blank" className="link" rel="noopener noreferrer">
            <i className="fab fa-github"></i> Monity
          </a>
        </div>
      </div>
    </>
  );
};

export default Index;

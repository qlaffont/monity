import React from 'react';
import useAxios from 'axios-hooks';
import PropTypes from 'prop-types';
import Link from 'next/link';

import Navbar from '../../../components/layout/Navbar';
import Content from '../../../components/layout/Content';
import { getGroups } from '../../../services/apis/groups';
import { getCheckers } from '../../../services/apis/checkers';

import './index.scss';
import { renderIcon } from '../../../components/metrics/metricsService';

const RenderChecker = ({ checker }): JSX.Element => {
  return (
    <>
      <div className="panel-block">
        <div className="columns is-fullwidth">
          <div className="column">
            <p>
              {renderIcon(checker.checkerType)}
              {checker.name}
            </p>
          </div>
          <div className="column">{checker.address}</div>
          <div className="column">
            <Link href={`/setup/metrics/` + checker._id}>
              <button className="button is-info">See Metrics</button>
            </Link>
          </div>
        </div>
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

const RenderGroup = ({ group, checkers }): JSX.Element => {
  return (
    <>
      <nav className="panel">
        <p className="panel-heading">{group.name}</p>
        {checkers.map(checker => {
          if (checker.groupId._id === group._id) {
            return <RenderChecker key={checker._id} checker={checker} />;
          }
        })}
      </nav>
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
    _id: PropTypes.string,
  }),
};

const Index = (): JSX.Element => {
  const [{ data }] = useAxios(getGroups(), { useCache: false });
  const [{ data: dataCheckers }] = useAxios(getCheckers(), { useCache: false });

  const renderGroups = (): JSX.Element | void => {
    if (data && data.data && dataCheckers && dataCheckers.data) {
      return (
        <>
          {data.data.map(group => {
            return <RenderGroup key={group._id} group={group} checkers={dataCheckers.data} />;
          })}
        </>
      );
    }
  };

  return (
    <>
      <Navbar />
      <Content>
        <h2 className="title is-2">Metrics</h2>
        {renderGroups()}
      </Content>
    </>
  );
};
export default Index;

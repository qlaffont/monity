/* eslint-disable react/prop-types */
import React from 'react';
import classNames from 'classnames';

import './Content.scss';

const Content = (props): JSX.Element => {
  const { children, className } = props;

  return (
    <>
      <div className={classNames('container', className)}>
        <div className="notification">{children}</div>
      </div>
    </>
  );
};

export default Content;

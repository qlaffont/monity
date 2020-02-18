import React from 'react';
export const renderIcon = (type): JSX.Element | void => {
  switch (type) {
    case 'ping':
      return <i className="fas fa-server mr-2" aria-hidden="true"></i>;

    case 'http':
      return <i className="far fa-window-maximize mr-2" aria-hidden="true"></i>;

    default:
      break;
  }
};

/* eslint-disable react/no-unescaped-entities */
import React, { useState } from 'react';
import classNames from 'classnames';

import Navbar from '../../components/layout/Navbar';
import Content from '../../components/layout/Content';

import './auth.scss';

const copyToClipboard = (textToCopy): void => {
  const myTemporaryInputElement = document.createElement('input');
  myTemporaryInputElement.type = 'text';
  myTemporaryInputElement.value = textToCopy;

  document.body.appendChild(myTemporaryInputElement);

  myTemporaryInputElement.select();
  document.execCommand('Copy');

  document.body.removeChild(myTemporaryInputElement);
  alert('Command copied !');
};

const FetchTokenDockerTab = (): JSX.Element => {
  return (
    <>
      <div
        className="button btn-copy"
        onClick={(): void => copyToClipboard('docker exec monity "curl localhost:5000/auth/generate"')}
      >
        <span className="icon">
          <i className="far fa-copy"></i>
        </span>{' '}
        <span>Copy Command</span>
      </div>
      <div className="code-block">
        $ <i>docker exec monity "curl localhost:5000/auth/generate"</i>
        <br />
        <span>
          &#123;"message":"Token successfully created !","statusCode":200,"data": &#123;"token":"<b>Token to use</b>
          "&#125;&#125;
        </span>
      </div>
    </>
  );
};

const FetchTokenCurlTab = (): JSX.Element => {
  return (
    <>
      <div className="button btn-copy" onClick={(): void => copyToClipboard('curl localhost:5000/auth/generate')}>
        <span className="icon">
          <i className="far fa-copy"></i>
        </span>{' '}
        <span>Copy Command</span>
      </div>
      <div className="code-block">
        $ <i>curl localhost:5000/auth/generate</i>
        <br />
        <span>
          &#123;"message":"Token successfully created !","statusCode":200,"data": &#123;"token":"<b>Token to use</b>
          "&#125;&#125;
        </span>
      </div>
    </>
  );
};

const Auth = (): JSX.Element => {
  const [tabIndex, setTabIndex] = useState(0);

  const selectTab = (number): void => {
    setTabIndex(number);
  };

  const displayTab = (): JSX.Element => {
    switch (tabIndex) {
      case 0:
        return (
          <>
            <FetchTokenCurlTab></FetchTokenCurlTab>
          </>
        );
      case 1:
        return (
          <>
            <FetchTokenDockerTab></FetchTokenDockerTab>
          </>
        );
      default:
        return <></>;
    }
  };

  return (
    <>
      <Navbar />
      <Content className="auth-page">
        <h2 className="title is-2">Get Monity Auth Token</h2>
        <p>
          To manage all your metrics/groups/checkers, you need to be authentificated. You will see below the process to
          be authenticated.
        </p>
        <br />
        <div>
          <h3 className="title is-3">How to be authenticated ? </h3>
          <ul className="list">
            <li className="list-item">
              1. Be sure that <i>DISABLE_AUTH</i> environment variable not exist.
            </li>
            <li className="list-item">
              <p>2. Fetch your token.</p>
              <div className="tabs">
                <ul>
                  <li onClick={(): void => selectTab(0)} className={classNames({ 'is-active': tabIndex === 0 })}>
                    <a>Hosted directly</a>
                  </li>
                  <li onClick={(): void => selectTab(1)} className={classNames({ 'is-active': tabIndex === 1 })}>
                    <a>Docker</a>
                  </li>
                </ul>
              </div>
              <div className="tab-content">{displayTab()}</div>
            </li>
            <li className="list-item">
              <p>3. Now you can use your token ! </p>
              <p>
                - Rest API -> Use you token as a header <b>"Authorization"</b>
              </p>
              <p>- Web Interface -> Paste your token in the input on the navbar and click on "Connect"</p>
            </li>
          </ul>
        </div>
      </Content>
    </>
  );
};

export default Auth;

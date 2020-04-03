import React, { useState } from 'react';
import Link from 'next/link';
import Cookies from 'js-cookie';
import cogoToast from 'cogo-toast';

import { AuthContext } from '../../services/auth/authContext';

import './Navbar.scss';

const Navbar = (): JSX.Element => {
  const ctx = React.useContext(AuthContext);
  const [token, setToken] = useState(ctx?.auth.token);

  const onChange = (event): void => {
    setToken(event.target.value);
  };

  const onSubmit = (): void => {
    ctx?.auth.setToken(token || '');
    Cookies.set('monityToken', token, { expires: 1 });

    if (token === '') {
      Cookies.remove('monityToken');
    }

    cogoToast.success('Token Set !', { heading: 'Success !' });
  };

  return (
    <nav className="navbar is-info" role="navigation" aria-label="main navigation">
      <div className="navbar-brand">
        <Link href="/">
          <a className="navbar-item has-text-weight-bold">🖥 Monity</a>
        </Link>

        <a
          role="button"
          className="navbar-burger burger"
          aria-label="menu"
          aria-expanded="false"
          data-target="navbarBasicExample"
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>

      <div id="navbarBasicExample" className="navbar-menu">
        <div className="navbar-start">
          <Link href="/setup">
            <a className="navbar-item">Home</a>
          </Link>
          <Link href="/setup/groups">
            <a className="navbar-item">Groups</a>
          </Link>
          <Link href="/setup/checkers">
            <a className="navbar-item">Checkers</a>
          </Link>
          <Link href="/setup/metrics">
            <a className="navbar-item">Metrics</a>
          </Link>
          <Link href="/setup/auth">
            <a className="navbar-item">Get Monity Auth Token</a>
          </Link>
          <Link href="/documentation">
            <a className="navbar-item">REST Documentation</a>
          </Link>
        </div>

        <div className="navbar-end">
          <div className="navbar-item">
            <div className="field has-addons">
              <div className="control">
                <input
                  className="input"
                  type="text"
                  placeholder="Monity Token"
                  value={token}
                  onChange={(e): void => onChange(e)}
                />
              </div>
              <div className="control">
                <a className="button is-primary" onClick={(): void => onSubmit()}>
                  Connect
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

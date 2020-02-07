import React from 'react';
import Link from 'next/link';

const Navbar = (): JSX.Element => {
  return (
    <nav className="navbar is-info" role="navigation" aria-label="main navigation">
      <div className="navbar-brand">
        <Link href="/">
          <a className="navbar-item" href="https://bulma.io">
            <img src="https://bulma.io/images/bulma-logo.png" width="112" height="28" />
          </a>
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
          <a className="navbar-item">Groups</a>
          <a className="navbar-item">Checkers</a>
          <a className="navbar-item">Metrics</a>
          <Link href="/setup/auth">
            <a className="navbar-item">Get Monity Auth Token</a>
          </Link>
        </div>

        <div className="navbar-end">
          <div className="navbar-item">
            <div className="field has-addons">
              <div className="control">
                <input className="input" type="text" placeholder="Monity Token" />
              </div>
              <div className="control">
                <a className="button is-primary">Connect</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

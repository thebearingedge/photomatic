import React from 'react';
import { Link } from 'react-router-dom';
import AppContext from '../lib/context';

export default class Header extends React.Component {
  render() {
    const userIconClass = this.context.isLoggedIn()
      ? 'fas fa-user nav-icon text-dark'
      : 'far fa-user nav-icon text-dark';
    return (
      <header className="navbar fixed-top navbar-light border-bottom py-0 bg-white">
        <Link to="/upload">
          <i className="fas fa-camera nav-icon text-dark" />
        </Link>
        <Link to="/" className="app-brand navbar-brand brand brand-sm m-0">
          Photomatic
        </Link>
        <Link to="/login">
          <i className={userIconClass} />
        </Link>
      </header>
    );
  }
}

Header.contextType = AppContext;

import React, { Component } from "react";
import { Link } from 'react-router-dom';

class Navbar extends Component {
  render() {
    return (
      <nav className="navbar navbar-dark fixed-top flex-md-nowrap p-0 shadow" style={{ backgroundColor: "#FFD700" }}>
        <Link to='/'
          className="navbar-brand col-sm-3 col-md-2 mr-0"
          target="_blank"
          rel="noopener noreferrer"
        >
          Shop Card Game
        </Link>
        <ul className="navbar-nav px-3">
          <li className="nav-item text-nowrap d-none d-sm-block">
            <small className="text-white">
              <Link to='/addProduct' className='nav-link'>AddProduct</Link>
            </small>
          </li>
          <li className="nav-item text-nowrap d-none  d-sm-block">
            <small className="text-white">
              <span id="account">Acc : {this.props.account}</span>
            </small>
          </li>
        </ul>
      </nav>
    );
  }
}

export default Navbar;

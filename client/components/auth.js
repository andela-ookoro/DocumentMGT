import React from 'react';
import Login from './Login';
import Signup from './Signup';
import generateDocument from '../helpers/exportDoc';

/**
 * @class Auth
 * @extends {React.Component}
 */
class Auth extends React.Component {
  /**
   * redirects user to dashboard page if jwt exists in localStorage,
   * @memberof Auth
   * @returns {null} - return null
   */
  componentWillMount() {
    // if jwt exist take user to dashboard page
    if (localStorage.getItem('jwt')) {
      window.location = '/#/dashboard';
    }
    // generateDocument('hello', 'loved', 'loving');
  }

  /**
   * @returns {object} - html doc
   * @memberof Auth
   */
  render() {
    $(document).ready(() => {
      $('ul.tabs').tabs();
    });
    return (
      <div className="container">
        <div className="welcomeDiv">
          <img src="/logo.png" id="logoImg" alt="logo" />
          <span className="logoName"> Doc Hub </span>
          welcome .....
        </div>
        <div className="row">
          <div className="col s12">
            <ul className="tabs">
              <li className="tab col s3">
                <a className="active" href="#signin" id="signintab">Sign in</a>
              </li>
              <li className="tab col s3">
                <a href="#signup" id="signuptab">Create a account</a>
              </li>
            </ul>
          </div>

          <div className="body row" id="signin">
            <Login />
          </div>

          <div className="body row" id="signup">
            <Signup />
          </div>
        </div>
      </div>
    );
  }
}

export default Auth;

import React from 'react';
import Login from './Login';
import Signup from './Signup';

class Auth extends React.Component{
  constructor(props){
    super(props);
  }

  componentWillMount() {
    // if jwt exist take user to dashboard page
    if (localStorage.getItem('jwt')) {
      window.location = '/#/dashboard';
    }
  }

  render(){
    $(document).ready(() => {
      $('ul.tabs').tabs();
    });
    return (
      <div className="container">
        <div className="welcomeDiv">
          <img src="/logo.png" id="logoImg"/>
          <span className="logoName"> Doc Hub </span>
          welcome .....
        </div>
       <div className="row">
        <div className="col s12">
          <ul className="tabs">
            <li className="tab col s3">
              <a className="active" href="#signin">Sign in</a>
            </li>
            <li className="tab col s3">
                <a href="#signup">Create a account</a>
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
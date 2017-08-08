import React from 'react';

const PageNotFound = () => (
  <div className="container" >
    <div className="welcomeDiv">
      <img src="/logo.png" id="logoImg" alt="logo" />
      <span className="logoName"> Doc Hub </span>
      welcome .....
    </div>
    <div className="row">
      <div className="col s12">
        <h5> <i className="large material-icons">visibility_off</i></h5>
        <h5> Sorry Page this page was not found </h5>
        <h6>
          Please, visit our
          <a href="#/" id="lnkHome"> home page </a> for more information
        </h6>
      </div>
    </div>
  </div>
);

export default PageNotFound;

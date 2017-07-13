import React from 'react';

const pageNotFound = () => (
  <div className="container">
    <div className="welcomeDiv">
      <img src="/logo.png" id="logoImg" alt="logo" />
      <span className="logoName" id="brandName"> Doc Hub </span>
      welcome .....
    </div>
    <div className="row">
      <div className="col s12">
        <h2> Sorry Page this page was not found </h2>
        <h2>
          Please, visit our
          <a href="#/" id="lnkHome"> home page </a> for more information
        </h2>
      </div>
    </div>
  </div>
);

export default pageNotFound;

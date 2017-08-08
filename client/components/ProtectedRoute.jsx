/* global localStorage */
import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';
import NavigationBar from './NavigationBar';
import Footer from './Footer';

const ProtectedRoute = ({ Component: component, ...rest }) => (
  <Route
    {...rest}
    render={props => (
    localStorage.getItem('jwt') ? (
      <div>
        <NavigationBar />
        <div className="extraDiv" />
         <Component  />
        <Footer />
      </div>
    ) : (
      <Redirect to={{
        pathname: '/',
        state: { from: props.location }
      }}
      />
    )
  )}
  />
);

ProtectedRoute.propTypes = {
  component: PropTypes.func,
  location: PropTypes.object
};

ProtectedRoute.defaultProps = {
  component: null,
  location: null
};

export default ProtectedRoute;
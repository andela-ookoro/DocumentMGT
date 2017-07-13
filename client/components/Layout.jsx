import React from 'react';
import PropTypes from 'prop-types';
import $ from 'jquery';
import addJWT from '../actions/addJWT';
// import component
import NavigationBar from './NavigationBar';
import Footer from './Footer';


/**
 * @class Layout
 * @extends {React.Component}
 */
class Layout extends React.Component {

  /**
   * @memberof Layout
   * @return {null} -
   */
  componentWillMount() {
    // if jwt does not exist, take user to login page
    if (!localStorage.getItem('jwt')) {
      window.location = '/#/';
    } else {
      addJWT();
    }
  }

  /**
   * @returns {object} - html doc
   * @memberof Auth
   */
  render() {
    $(document).ready(() => {
      /**
       * set border bottom for active link
      * remove class from all list item
       */
      $('a').removeClass('activelink');
      const url = window.location.toString();
      if (url.includes('#/dashboard')) {
        $('a[href$="#/dashboard"]').addClass('activelink');
      } else if (url.includes('#/document')) {
        $('a[href$="#/document"]').addClass('activelink');
      } else if (url.includes('#/createDocument')) {
        $('a[href$="#/createDocument"]').addClass('activelink');
      }
    });
    return (
      <div>
        <NavigationBar />
        <div className="extraDiv" />
        { this.props.children }
        <Footer />
      </div>
    );
  }
}

Layout.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(React.PropTypes.node),
    PropTypes.node
  ]).isRequired
};

Layout.defaultProps = {
  children: '',
};
export default Layout;

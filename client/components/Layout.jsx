import React from 'react';
import PropTypes from 'prop-types';
import $ from 'jquery';
import addJWT from '../actions/addJWT';
// import component
import PageNotFound from './PageNotFound';
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
   * @memberof Layout
   */
  render() {
    $(document).ready(() => {
      /**
       * set border bottom for active link
      * remove class from all list item
       */
      $('a').removeClass('activelink');
      const url = window.location.toString();
      if (/^((http[s]?|ftp):\/\/)?(.*)(\/)?(#\/dashboard)(\/)?$/.test(url)
      ||
      /^((http[s]?|ftp):\/\/)?(.*)(\/)?#\/$/.test(url)) {
        $('a[href$="#/dashboard"]').addClass('activelink');
      } else if (/^((http[s]?|ftp):\/\/)?(.*)(\/)?(#\/document)(\/)?(\w*)(\/)?([a-zA-Z0-9!@#$%\^&*),(+=._-]*)$/.test(url)) {
        $('a[href$="#/document"]').addClass('activelink');
      } else if (/^((http[s]?|ftp):\/\/)?(.*)(\/)?(#\/createDocument)(\/)?(\w*)(\/)?([a-zA-Z0-9!@#$%\^&*),(+=._-]*)(\/)?(\w*)$/.test(url)) {
        $('a[href$="#/createDocument"]').addClass('activelink');
      } else if (/^((http[s]?|ftp):\/\/)?(.*)(\/)?(#\/profile)(\/)?(\w*)$/.test(url)) {
        $('a[href$="#/profile"]').addClass('activelink');
     } else if (/^((http[s]?|ftp):\/\/)?(.*)(\/)?(#\/manageUsers)(\/)?(\w*)$/.test(url)) {
         $('a[href$="#/manageUsers"]').addClass('activelink');
      } else {
        window.location ='/#/notfound';
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

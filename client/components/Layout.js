import React from 'react';
import addJWT from '../actions/addJWT';
import $ from 'jquery';

// import component
import NavigationBar from './NavigationBar';
import Footer from'./Footer';

const customGoogleSearch = () => {
  const cx = '008956209690011123482:ot0nxazwtpq';
  const gcse = document.createElement('script');
  gcse.type = 'text/javascript';
  gcse.async = true;
  gcse.src = 'https://cse.google.com/cse.js?cx=' + cx;
  var s = document.getElementsByTagName('script')[0];
  s.parentNode.insertBefore(gcse, s);
}

class Layout extends React.Component {
  componentWillMount(){
    // if jwt does not exist, take user to login page
    if (!localStorage.getItem('jwt')) {
      window.location = '/#/';
    } else {
      addJWT();
    }
  }
  render() {
    $(document).ready(() => {
      /**
       * set border bottom for active link
      * remove class from all list item
       */
      $("a").removeClass("activelink");
      let url = window.location.toString();
      if( url.includes("#/dashboard")) {
          $('a[href$="#/dashboard"]').addClass('activelink');
      }else if( url.includes("#/document")) {
          $('a[href$="#/document"]').addClass('activelink');
      }else if( url.includes("#/createDocument")) {
          $('a[href$="#/createDocument"]').addClass('activelink');
      }
    });
    return (
      <div>
        <NavigationBar />
        <div className="extraDiv">
        </div>
        { this.props.children }
        <Footer />
      </div>
    )
  }
  
}

export default Layout;
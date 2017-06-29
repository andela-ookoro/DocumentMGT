import React from 'react';
import $ from 'jquery';

// import component
import NavigationBar from './NavigationBar';
import Footer from'./Footer';

class App extends React.Component {
  render() {
     $(document).ready(() => {

      /**
       * set border bottom for active link
      * remove class from all list item
       */
      $("a").removeClass("activelink");
      let url = window.location.toString();
      console.log('window.location.toString()', window.location.toString());
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
        <div className="container sitemapdiv">
        </div>
        { this.props.children }
        <Footer />
      </div>
    )
  }
  
}

export default App;
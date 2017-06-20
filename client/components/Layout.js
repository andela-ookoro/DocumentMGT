import React from 'react';

// import component
import NavigationBar from './NavigationBar';
import Footer from'./Footer';

class App extends React.Component {
  render() {
    return (
      <div>
        <NavigationBar />
        <div className="container sitemapdiv">
          <p className="sitemap">
            <a href="#!" className="breadcrumb">First</a>
          <a href="#!" className="breadcrumb">Second</a>
          <a href="#!" className="breadcrumb">Third</a></p>
        </div>
        { this.props.children }
        <Footer />
      </div>
    )
  }
  
}

export default App;
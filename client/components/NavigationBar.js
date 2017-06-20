import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import * as UserAction from '../actions/users';

class NavigationBar extends React.Component{
  constructor(props){
    super(props);
  }

  render(){
    return (
      <div className="mainHeader">
        <div className="container">
          <div className="row">
            <div className=" col l12 m12 s12" >
              <nav className="heading"> 
                <div className="header nav-wrapper" >
                  <a href="#!" className="brand-logo">
                    <img src="/logo.png" id="logoImg"/>
                    Doc Hub</a>
                  <a href="#" data-activates="mobile-demo" className="button-collapse">
                    <i className="material-icons">menu</i>
                  </a>
                  <ul className="right hide-on-med-and-down">
                    <li><Link to="/documents">Documents</Link></li>
                    <li><Link to="/document">Document</Link></li>
                    <li><Link to="/createDocument">Create Document</Link></li>
                    <li><a >Okoro Celestine</a></li>
                    <li><Link to="/signup">Signup</Link></li>
                    <li><Link to="/login">Signin</Link></li>
                  </ul>
                  <ul className="side-nav" id="mobile-demo">
                    <li><a href="sass.html">Sass</a></li>
                    <li><a href="badges.html">Components</a></li>
                    <li><a href="collapsible.html">Javascript</a></li>
                    <li><a href="mobile.html">Mobile</a></li>
                  </ul>
                </div>
              </nav>
            </div>
          </div>
        </div>
      </div>
    );
 }
}
 // Maps state from store to props
  const mapStateToProps = (state, ownProps) => {
    return {
      // You can now say this.props.books
      books: state.pens
    }
  };

// Maps actions to props
const mapDispatchToProps = (dispatch) => {
  return {
  // You can now say this.props.createBook
    createBook: book => dispatch(bookActions.createBook(book))
  }
};

// Use connect to put them together
export default connect(mapStateToProps, mapDispatchToProps)(NavigationBar);
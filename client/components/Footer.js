import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
// import * as UserAction from '../actions/users';

class Footer extends React.Component{
  constructor(props){
    super(props);
  }

  render(){
    return (
      <div>
      <div className="extraDiv"></div>
      <div id="footerDiv">
        <footer className="page-footer">
          <div className="footer-copyright" >
            <div className="container">
             © 2017 Cele
             <a className="grey-text text-lighten-4 right"
                href="mailto:okwudiri.okoro@andela.com?Subject=User%20Feedback"
                target="_top"
              >
              Feedback mail
            </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
    );
 }
}
 // Maps state from store to props
  const mapStateToProps = (state, ownProps) => {
    return {
      // You can now say this.props.books
      // books: state.pens
    }
  };

// Maps actions to props
const mapDispatchToProps = (dispatch) => {
  return {
  // You can now say this.props.createBook
  // createBook: book => dispatch(bookActions.createBook(book))
  }
};

// Use connect to put them together
export default connect(mapStateToProps, mapDispatchToProps)(Footer);
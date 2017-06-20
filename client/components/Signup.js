import React from 'react';
import { connect } from 'react-redux';
// import * as bookActions from '../actions/bookActions';

class Signup extends React.Component{
  constructor(props){
    super(props);
  }

  // submitBook(input){
  //   this.props.createBook(input);
  // }

  render(){
    return(
      <div className="container">
        <div className="body row">
          <form className="col s12">
            <br />
            <div className="row">
              <div className="input-field col l4 m6 s12">
                <i className="material-icons prefix">account_circle</i>
                <input placeholder="First Name" id="first_name" type="text" className="validate" />
                <label for="first_name">First Name</label>
              </div>
              <div className="input-field col l4 m6 s12">
                <i className="material-icons prefix">account_circle</i>
                <input placeholder="Middle Name" id="middle_name" type="text" className="validate" />
                <label for="middle_name">Middle Name</label>
              </div>
              <div className="input-field col l4 m6 s12">
                <i className="material-icons prefix">account_circle</i>
                <input id="last_name" placeholder="Last Name" type="text" className="validate" />
                <label for="last_name">Last Name</label>
              </div>
            </div>
            <div className="row">
              <div className="input-field col  l4 m6 s12">
                <i className="material-icons prefix">lock</i>
                <input placeholder="Password" id="password" type="password" className="validate" />
                <label for="password">Password</label>
              </div>
               <div className="input-field col  l4 m6 s12">
                 <i className="material-icons prefix">lock</i>
                <input placeholder="Comfirm Password" id="comfirmpassword" type="password" className="validate" />
                <label for="password">Comfirm Password</label>
              </div>
              <div className="input-field col  l4 m6 s12">
                <i className="material-icons prefix">email</i>
                <input placeholder="Email" id="email" type="email" className="validate" />
                <label for="email" data-error="wrong" data-success="right">Email</label>
              </div>
            </div>
            <div className="row">
              <div className="input-field col s12" >
                 <button className="btn waves-effect waves-light right" type="submit" name="action">
                   Submit <i className="material-icons right">send</i>
                  </button>
              </div>
            </div>
            </form>
          </div>
        </div>
    )
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
export default connect(mapStateToProps, mapDispatchToProps)(Signup);
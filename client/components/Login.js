import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { logInUser } from '../actions/session';

class Login extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      email: '',
      password: ''
    };
    this.onChange = this.onChange.bind(this);
    this.onSave = this.onSave.bind(this);
  }

   componentWillReceiveProps(nextProps) {
      Materialize.toast(nextProps.loginMessage, 3000, 'rounded');
   }
  /**
   * set the value of the control to the respective state node
   * @param {*} e 
   */
  onChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  /**
   * 
   * @param {*} event 
   */
  onSave(event) {
    event.preventDefault();
    this.props.siginin(this.state);
  }

  render(){
    return(
      <div>
        <br />
        <p>  {this.props.loginMessage}  </p>
        <form className="col s12">
          <div className="input-field col  s12">
            <i className="material-icons prefix">email</i>
            <input
              placeholder="Email" value={this.state.email} onChange={this.onChange}
              name="email" type="email" className="validate" required
            />
            <label htmlFor="email" data-error="wrong" data-success="right">Email</label>
          </div>
          <div className="input-field col  s12">
            <i className="material-icons prefix">lock</i>
            <input placeholder="Password" name="password"
              value={this.state.password} onChange={this.onChange}
              type="password" className="validate" required
            />
            <label htmlFor="password">Password</label>
          </div>
          <div className="input-field col s12" >
            <button
              className="btn waves-effect waves-light right" type="submit"
              onClick={this.onSave} name="action">
              Login <i className="material-icons right">send</i>
              </button>
          </div>

              <br />
        </form>
      </div>
    )
  }
}

// Maps state from store to props
const mapStateToProps = (state, ownProps) => {
  return {
    // You can now say this.props.books
    loginMessage: state.loginMessage
  }
};

// Maps actions to props
const mapDispatchToProps = (dispatch) => {
  return {
    siginin: credentials => dispatch(logInUser(credentials))
  }
};

// Use connect to put them together
export default connect(mapStateToProps, mapDispatchToProps)(Login);


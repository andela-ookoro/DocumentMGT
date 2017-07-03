import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { logIn } from '../actions/login';


/**
 * @class Login
 * @extends {React.Component}
 */
class Login extends React.Component {

  /**
   * Creates an instance of Login.
   * @param {any} props -
   * @memberof Login
   * @returns {null} -
   */
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: ''
    };
    this.onChange = this.onChange.bind(this);
    this.onSave = this.onSave.bind(this);
  }


   /**
    * @param {any} nextProps -
    * @memberof Login
    * @returns {null} -
    */
  componentWillReceiveProps(nextProps) {
    Materialize.toast(nextProps.loginMessage, 3000, 'rounded');
  }

  /**
   * set the value of the control to the respective state node
   * @param {*} e
   * @returns {null} -
   */
  onChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  /**
   * signin user
   * @param {*} event
   * @returns {null} -
   */
  onSave(event) {
    event.preventDefault();
    this.props.siginin(this.state);
  }

   /**
   * @returns {object} - html doc
   * @memberof Auth
   */
  render() {
    return (
      <div>
        <br />
        <p> {this.props.loginMessage} </p>
        <form className="col s12">
          <div className="input-field col  s12">
            <i className="material-icons prefix">email</i>
            <input
              placeholder="Email"
              value={this.state.email}
              onChange={this.onChange}
              name="email"
              type="email"
              className="validate"
              required
            />
            <label htmlFor="email" data-error="wrong" data-success="right">
              Email
            </label>
          </div>
          <div className="input-field col  s12">
            <i className="material-icons prefix">lock</i>
            <input
              placeholder="Password"
              name="password"
              value={this.state.password}
              onChange={this.onChange}
              type="password"
              className="validate"
              required
            />
            <label htmlFor="password">Password</label>
          </div>
          <div className="input-field col s12" >
            <button
              className="btn waves-effect waves-light right"
              type="submit"
              onClick={this.onSave}
              name="action"
            >
              Login <i className="material-icons right">send</i>
            </button>
          </div>
          <br />
        </form>
      </div>
    );
  }
}

// Maps state from store to props
const mapStateToProps = (state) => {
  return {
    loginMessage: state.loginMessage
  };
};

// Maps actions to props
const mapDispatchToProps = (dispatch) => {
  return {
    siginin: credentials => dispatch(logIn(credentials))
  };
};

// Use connect to put them together
export default connect(mapStateToProps, mapDispatchToProps)(Login);


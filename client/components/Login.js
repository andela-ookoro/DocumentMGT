import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import toaster from 'toastr';
import { logIn } from '../actions/login';
import {
  validateEmail,
  validatePassword
} from '../helpers/validator';


/**
 * @class Login
 * @extends {React.Component}
 */
export class Login extends React.Component {

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
      password: '',
      validControls: {},
      message: ''
    };
    this.onChange = this.onChange.bind(this);
    this.onSave = this.onSave.bind(this);
  }

    /**
    * @param {any} nextProps -
    * @memberof Login
    * @returns {null} -
    */
  componentDidMount() {
    document.getElementById('signinSubmit').disabled = true;
  }

  /**
  * @param {any} nextProps -
  * @memberof Login
  * @returns {null} -
  */
  componentWillReceiveProps(nextProps) {
    if (nextProps.messageFrom === 'login') {
      toaster.info(nextProps.message);
      this.setState({
        message: nextProps.message
      });
    }
  }

  /**
   * set the value of the control to the respective state node
   * @param {*} e
   * @returns {null} -
   */
  onChange(e) {
    let validationStatus;
    if (e.target.name === 'email') {
      validationStatus = validateEmail(e.target.value);
    } else if (e.target.name === 'password') {
      validationStatus = validatePassword(e.target.value);
    }
    // get validControls
    const validControls = this.state.validControls;
    const validationLabel = document
      .getElementById(`${e.target.name}Validator`);
    // set state when input is valid
    if (validationStatus === true) {
      // check if control was valid
      if (!validControls.hasOwnProperty(e.target.name)) {
        validControls[e.target.name] = e.target.name;
      }
      // remove error message
      validationLabel.textContent = '';
    } else {
      // remove control from list of validControls
      if (validControls.hasOwnProperty(e.target.name)) {
        delete validControls[e.target.name];
      }
      // show error message
      validationLabel.textContent = validationStatus;
      validationLabel.style.color = '#BD2F10';
    }
    // set state
    this.setState({
      [e.target.name]: e.target.value,
      validControls
    });
    // enable button when every control is valid
    if (Object.keys(validControls).length === 1) {
      document.getElementById('signinSubmit').disabled = false;
    } else {
      document.getElementById('signinSubmit').disabled = true;
    }
  }

  /**
   * signin user
   * @param {*} event
   * @returns {null} -
   */
  onSave(event) {
    event.preventDefault();
    const user = this.state;
    // delete validControls and message from the user object
    delete user.validControls;
    this.props.siginin(user);
  }

   /**
   * @returns {object} - html doc
   * @memberof Auth
   */
  render() {
    return (
      <div>
        <br />
        <p className="errorMessage"> {this.state.message} </p>
        <form className="col s12">
          <div className="input-field col  s12">
            <i className="material-icons prefix">email</i>
            <input
              placeholder="Email"
              id="email"
              value={this.state.email}
              onChange={this.onChange}
              name="email"
              type="email"
              className="validate"
              required
            />
            <label htmlFor="email">Email</label>
            <div className="comfirmPasswordStatus">
              <span id="emailValidator" />
            </div>
          </div>
          <div className="input-field col  s12">
            <i className="material-icons prefix">lock</i>
            <input
              placeholder="Password"
              name="password"
              id="password"
              value={this.state.password}
              onChange={this.onChange}
              type="password"
              className="validate"
              required
            />
            <label htmlFor="password">Password</label>
            <div className="comfirmPasswordStatus">
              <span id="passwordValidator" />
            </div>
          </div>
          <div className="input-field col s12" >
            <button
              className="btn waves-effect waves-light right"
              type="submit"
              id="signinSubmit"
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
const mapStateToProps = state => (
  {
    message: state.message.info,
    messageFrom: state.message.from
  }
);

// Maps actions to props
const mapDispatchToProps = dispatch => (
  {
    siginin: credentials => dispatch(logIn(credentials))
  }
);

Login.propTypes = {
  siginin: PropTypes.func.isRequired,
  message: PropTypes.string,
  messageFrom: PropTypes.string
};

Login.defaultProps = {
  message: '',
  messageFrom: ''
};
// Use connect to put them together
export default connect(mapStateToProps, mapDispatchToProps)(Login);


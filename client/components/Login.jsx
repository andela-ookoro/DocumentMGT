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
      message: '',
      isloading: false,
      disableSigninSubmit: true
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
   //  document.getElementById('signinSubmit').disabled = true;
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
        message: nextProps.message,
        isloading: false
      });
    } else {
      this.setState({
        isloading: false
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
    let validatorText = '';
    let disableSigninSubmit =  true;
    if (e.target.name === 'email') {
      validationStatus = validateEmail(e.target.value);
    } else if (e.target.name === 'password') {
      validationStatus = validatePassword(e.target.value);
    }
    // get validControls
    const validControls = this.state.validControls;
    const validationStateName = `${e.target.name}Validator`;
    // set state when input is valid
    if (validationStatus === true) {
      // check if control was valid
      if (!validControls.hasOwnProperty(e.target.name)) {
        validControls[e.target.name] = e.target.name;
      }
    } else {
      // remove control from list of validControls
      if (validControls.hasOwnProperty(e.target.name)) {
        delete validControls[e.target.name];
      }
      // show error message
      validatorText = validationStatus;
    }

    // enable button when every control is valid
    if (Object.keys(validControls).length === 2) {
      disableSigninSubmit = false;
    } else {
      disableSigninSubmit = true;
    }
    // set state
    this.setState({
      [e.target.name]: e.target.value,
      validControls,
      disableSigninSubmit,
      [validationStateName]: validatorText
    });
  }

  /**
   * signin user
   * @param {*} event
   * @returns {null} -
   */
  onSave(event) {
    event.preventDefault();
     // create request payload from state
    const user = {
      email: this.state.email,
      password: this.state.password
    };
    // show preloader
    this.setState({
      isloading: true
    });
    this.props.siginin(user);
  }

   /**
   * @returns {object} - html doc
   * @memberof Auth
   */
  render() {
    return (
      <div>
        {(this.state.isloading)
            ?
              <div className="authprogress">
                <div className="indeterminate" />
              </div>
            :
            ''
          }
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
            <div className="validatorContainer">
              <span id="emailValidator">
               {this.state.emailValidator}
              </span>
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
            <div className="validatorContainer">
              <span id="passwordValidator">
               {this.state.passwordValidator}
              </span>
            </div>
          </div>
          <div className="input-field col s12" >
            <button
              className="btn waves-effect waves-light right"
              type="submit"
              id="signinSubmit"
              onClick={this.onSave}
              name="action"
              disabled={this.state.disableSigninSubmit}
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
    messageFrom: state.message.from,
    dateSent: state.message.dateSent
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
  messageFrom: PropTypes.string,
  dateSent: PropTypes.number
};

Login.defaultProps = {
  message: '',
  messageFrom: '',
  dateSent: 0
};
// Use connect to put them together
export default connect(mapStateToProps, mapDispatchToProps)(Login);


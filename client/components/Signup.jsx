import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import toaster from 'toastr';
import { signup } from '../actions/signup';
import { getRoles } from '../actions/roles';
import {
  validateName,
  validateEmail,
  validatePassword,
  validateRoleId
} from '../helpers/validator';


/**
 * @class Signup
 * @extends {React.Component}
 */
export class Signup extends React.Component {

  /**
   * Creates an instance of Signup.
   * @param {any} props -
   * @memberof Signup
   */
  constructor(props) {
    super(props);
    this.state = {
      lname: '',
      fname: '',
      mname: '',
      email: '',
      password: '',
      roleId: '',
      validControls: {},
      isloading: false,
      disableSignupSubmit: true
    };
    this.onChange = this.onChange.bind(this);
    this.onSave = this.onSave.bind(this);
    this.matchPassword = this.matchPassword.bind(this);
  }


  /**
   * @returns {null} -
   * @memberof Signup
   */
  componentWillMount() {
    this.props.getRoles();
    this.setState({
      isloading: false
    });
  }

  /**
  * @param {any} nextProps -
  * @memberof Signup
  * @returns {null} -
  */
  componentWillReceiveProps(nextProps) {
    const { messageFrom } = nextProps;
    if (messageFrom === 'signup' || messageFrom === 'getRoles') {
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
   * @param {*} e -
   *  @returns {null} -
   */
  onChange(e) {
    // validate input
    let validationStatus;
    let ValidatonPrefix = 'Validator';
    const controlName = e.target.name;
    const controlValue = e.target.value;
    const jquerySelector = `#${controlName}`;
    let validatorText = '';
    let disableSignupSubmit =  true;

    if (controlName === 'fname' || controlName === 'lname') {
      validationStatus = validateName(controlValue);
    } else if (controlName === 'mname') {
      if (controlValue === '') {
        validationStatus = true
      } else {
        validationStatus = validateName(controlValue);
      }
    }else if (controlName === 'email') {
      validationStatus = validateEmail(controlValue);
      ValidatonPrefix = `${ValidatonPrefix}signup`;
    } else if (controlName === 'password') {
      validationStatus = validatePassword(controlValue);
      ValidatonPrefix = `${ValidatonPrefix}signup`;
    } else if (controlName === 'roleId') {
      validationStatus = validateRoleId(controlValue);
    }
    // get validControls
    const validControls = this.state.validControls;
    const validationStateName = `${e.target.name}${ValidatonPrefix}`;
    // set state when input is valid
    if (validationStatus === true) {
      // check if control was valid
      if (!validControls.hasOwnProperty(controlName)) {
        validControls[e.target.name] =controlName;
      }

    } else {
      // remove control from list of validControls
      if (!validControls.hasOwnProperty(controlName)) {
        delete validControls[controlName];
      }
      // set validation message
      validatorText = validationStatus;
    }
    // enable button when every control is valid
    if (Object.keys(validControls).length === 6 && this.matchPassword()) {
      disableSignupSubmit = false;
    }

    // set state
    this.setState({
      [controlName]: controlValue,
      validControls,
      disableSignupSubmit,
      [validationStateName]: validatorText
    });
  }

  /**
   *  @returns {null} -
   * @param {*} event -
   */
  onSave(event) {
    event.preventDefault();
    // create request payload from state
    const user = {
      fname: this.state.fname,
      lname: this.state.lname,
      mname: this.state.mname,
      email: this.state.email,
      password: this.state.password,
      roleId: this.state.roleId
    };
    // show preloader
    this.setState({
      isloading: true
    });
    this.props.signUp(user);
  }

  /**
   * check if password and comfirm password match
   * @memberof Signup
   *  @returns {null} -
   */
  matchPassword() {
    const comfirmpassword = this.comfirmpassword.value;
    // if password and comfirm password match, set label to matched
    let match;
    let disableSignupSubmit = true
    let validatorText = '';
    if (comfirmpassword === this.state.password) {
      match = true;
      /**
       * enable submit button when every input is valid
       * get validControls
       */
      const validControls = this.state.validControls;
      // enable button when every control is valid
      if (Object.keys(validControls).length === 6) {
        disableSignupSubmit = false;
      }
    } else {
      validatorText = 'Password does not match';
      match = false;
      // disable submit button
      disableSignupSubmit = true;
    }
    // set state
    this.setState({
      disableSignupSubmit,
      comfirmpasswordValidator: validatorText
    });
    return match;
  }


  /**
   * @returns {object} - html DOM
   * @memberof Signup
   */
  render() {
    return (
      <div className="body row" id="signup">
        {(this.state.isloading)
            ?
              <div className="progress">
                <div className="indeterminate" />
              </div>
            :
            ''
          }
        <form className="col s12" id="frmSignup">
          <br />
          <div className="row">
            <p className="errorMessage" id="errorMessageSignup">
              {this.state.message}
            </p>
            <div className="input-field col l4 m6 s12">
              <i className="material-icons prefix">account_circle</i>
              <input
                placeholder="First Name"
                name="fname"
                type="text"
                id="fname"
                className="validate"
                value={this.state.fname}
                onChange={this.onChange}
              />
              <label htmlFor="first_name">First Name</label>
              <div className="validatorContainer">
                <span id="fnameValidator" >
                  {this.state.fnameValidator}
                </span>
              </div>
            </div>
            <div className="input-field col l4 m6 s12">
              <i className="material-icons prefix">account_circle</i>
              <input
                placeholder="Middle Name"
                name="mname"
                id="mname"
                type="text"
                className="validate"
                value={this.state.mname}
                onChange={this.onChange}
              />
              <label htmlFor="middle_name">Middle Name</label>
              <div className="validatorContainer">
                <span id="mnameValidator" >
                  {this.state.mnameValidator}
                </span>
              </div>
            </div>
            <div className="input-field col l4 m6 s12">
              <i className="material-icons prefix">account_circle</i>
              <input
                name="lname"
                id="lname"
                placeholder="Last Name"
                type="text"
                className="validate"
                value={this.state.lname}
                onChange={this.onChange}
              />
              <label htmlFor="last_name">Last Name</label>
              <div className="validatorContainer">
                <span id="lnameValidator" >
                  {this.state.lnameValidator}
                </span>
              </div>
            </div>
          </div>
          <div className="row">

            <div className="input-field col  l4 m6 s12">
              <i className="material-icons prefix">email</i>
              <input
                placeholder="Email"
                name="email"
                type="email"
                id="emailsignup"
                className="validate"
                value={this.state.email}
                onChange={this.onChange}
              />
              <label htmlFor="email" >Email</label>
              <div className="validatorContainer">
                <span id="emailValidatorsignup">
                   {this.state.emailValidatorsignup}
                </span>
              </div>
            </div>
            <div className="input-field col  l4 m6 s12">
              <i className="material-icons prefix">lock</i>
              <input
                placeholder="Password"
                name="password"
                id="passwordsignup"
                type="password"
                className="validate"
                value={this.state.password}
                onChange={this.onChange}
              />
              <label htmlFor="password">Password</label>
              <div className="validatorContainer">
                <span id="passwordValidatorsignup">
                  {this.state.passwordValidatorsignup}
                </span>
              </div>
            </div>
            <div className="input-field col  l4 m6 s12">
              <i className="material-icons prefix">lock</i>
              <input
                placeholder="Comfirm Password"
                name="comfirmpassword"
                id="comfirmpassword"
                type="password"
                className="validate"
                onChange={this.matchPassword}
                ref={(input) => { this.comfirmpassword = input; }}
                required=""
                aria-required="true"
              />
              <label htmlFor="comfirmpassword">
                comfirm password
                </label>
              <div className="validatorContainer">
                <span id="comfirmpasswordValidator">
                  {this.state.comfirmpasswordValidator}
                </span>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="input-field col  l4 m6 s12">
              {
                <select
                  className="browser-default"
                  name="roleId"
                  id="roleId"
                  value={this.state.roleId}
                  onChange={this.onChange}
                  required=""
                  aria-required="true"
                >
                  <option value="" disabled >Choose your group</option>
                  {this.props.roles.map(role => (
                    <option
                      key={role.id}
                      value={role.id}
                      title={role.description}
                    >
                      {role.title}
                    </option>
                  ))}
                </select>
              }
              <div className="validatorContainer">
                <span id="roleIdValidator" >
                  {this.state.roleIdValidator}
                </span>
              </div>
            </div>
            <div className="input-field col l8 m6 s12" >
              <button
                className="btn waves-effect waves-light right"
                type="submit"
                name="action"
                id="signupSubmit"
                onClick={this.onSave}
                disabled={this.state.disableSignupSubmit}
              >
                Submit <i className="material-icons right">send</i>
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}



// Maps actions to props
const mapDispatchToProps = dispatch => ({
  signUp: user => dispatch(signup(user)),
  getRoles: () => dispatch(getRoles())
});

// Maps state from store to props
const mapStateToProps = state => ({
  roles: state.roles,
  message: state.message.info,
  messageFrom: state.message.from,
  dateSent: state.message.dateSent
});

Signup.propTypes = {
  getRoles: PropTypes.func.isRequired,
  signUp: PropTypes.func.isRequired,
  roles: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string,
    })
  ),
  message: PropTypes.string,
  messageFrom: PropTypes.string,
  dateSent: PropTypes.number
};

Signup.defaultProps = {
  message: '',
  messageFrom: '',
  roles: [],
  dateSent: 0
};
// Use connect to put them together
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(
  Signup));

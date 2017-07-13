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
      isloading: false
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
   * @returns {null} -
   * @memberof Signup
   */
  componentDidMount() {
    document.getElementById('signupSubmit').disabled = true;
  }
  /**
  * @param {any} nextProps -
  * @memberof Signup
  * @returns {null} -
  */
  componentWillReceiveProps(nextProps) {
    if (nextProps.messageFrom === 'signup') {
      toaster.info(nextProps.message);
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
    if (e.target.name === 'fname' || e.target.name === 'lname'
      || e.target.name === 'mname') {
      validationStatus = validateName(e.target.value);
    } else if (e.target.name === 'email') {
      validationStatus = validateEmail(e.target.value);
      ValidatonPrefix = `${ValidatonPrefix}signup`;
    } else if (e.target.name === 'password') {
      validationStatus = validatePassword(e.target.value);
      ValidatonPrefix = `${ValidatonPrefix}signup`;
    } else if (e.target.name === 'roleId') {
      validationStatus = validateRoleId(e.target.value);
    }
    // get validControls
    const validControls = this.state.validControls;
    const validationLabelId = `${e.target.name}${ValidatonPrefix}`;
    const validationLabel = document.getElementById(validationLabelId);
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
      if (!validControls.hasOwnProperty(e.target.name)) {
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
    if (Object.keys(validControls).length === 6 && this.matchPassword()) {
      document.getElementById('signupSubmit').disabled = false;
    } else {
      document.getElementById('signupSubmit').disabled = true;
    }
  }

  /**
   *  @returns {null} -
   * @param {*} event -
   */
  onSave(event) {
    event.preventDefault();
    const user = this.state;
    // delete validControls and message from the user object
    delete user.validControls;
    delete user.message;
    delete user.isloading;
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
    let matchStatus;
    let fontColor = '#a1887f';
    let match;
    if (comfirmpassword === this.state.password) {
      matchStatus = 'Right password';
      match = true;
      // enable submit button when every input is valid
      // get validControls
      const validControls = this.state.validControls;
      // enable button when every control is valid
      if (Object.keys(validControls).length === 6) {
        document.getElementById('signupSubmit').disabled = false;
      }
    } else {
      // document.getElementById('signupSubmit').disabled = true;
      matchStatus = 'Password does not match';
      fontColor = '#ff0000';
      match = false;
      // disable submit button
      document.getElementById('signupSubmit').disabled = true;
    }

    //  set the result of the comparism
    const matchStatusTextBox = document.getElementById('comfirmPasswordStatus');
    matchStatusTextBox.textContent = matchStatus;
    matchStatusTextBox.style.color = fontColor;
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
              {this.props.message}
            </p>
            <div className="input-field col l4 m6 s12">
              <i className="material-icons prefix">account_circle</i>
              <input
                placeholder="First Name"
                name="fname"
                type="text"
                id="fname"
                value={this.state.fname}
                onChange={this.onChange}
                className="validate"
              />
              <label htmlFor="first_name">First Name</label>
              <div className="comfirmPasswordStatus">
                <span id="fnameValidator" />
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
              <div className="comfirmPasswordStatus">
                <span id="mnameValidator" />
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
              <div className="comfirmPasswordStatus">
                <span id="lnameValidator" />
              </div>
            </div>
          </div>
          <div className="row">
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
              <div className="comfirmPasswordStatus">
                <span id="passwordValidatorsignup" />
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
              <label
                htmlFor="comfirmpassword"
              >
                comfirm password
                </label>
              <div className="comfirmPasswordStatus">
                <span id="comfirmPasswordStatus" />
              </div>

            </div>
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
              <div className="comfirmPasswordStatus">
                <span id="emailValidatorsignup" />
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
              <div className="comfirmPasswordStatus">
                <span id="roleIdValidator" />
              </div>
            </div>
            <div className="input-field col l8 m6 s12" >
              <button
                className="btn waves-effect waves-light right"
                type="submit"
                name="action"
                id="signupSubmit"
                onClick={this.onSave}
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
  messageFrom: state.message.from
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
  messageFrom: PropTypes.string
};

Signup.defaultProps = {
  message: '',
  messageFrom: '',
  roles: []
};
// Use connect to put them together
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(
  Signup));

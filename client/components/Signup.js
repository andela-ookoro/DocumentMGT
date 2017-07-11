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
      validControls: {}
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
  }
  /**
   * @returns {null} -
   * @memberof Signup
   */
  componentDidMount() {
    // document.getElementById('btnSubmit').disabled = true;
  }
  /**
  * @param {any} nextProps -
  * @memberof Signup
  * @returns {null} -
  */
  componentWillReceiveProps(nextProps) {
    if (nextProps.messageFrom === 'signup') {
      toaster.info(nextProps.message);
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
    if (e.target.name === 'fname' || e.target.name === 'lname'
      || e.target.name === 'mname') {
      validationStatus = validateName(e.target.value);
    } else if (e.target.name === 'email') {
      validationStatus = validateEmail(e.target.value);
    } else if (e.target.name === 'password') {
      validationStatus = validatePassword(e.target.value);
    } else if (e.target.name === 'roleId') {
      console.log('rorle', e.target.value);
      validationStatus = validateRoleId(e.target.value);
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
      document.getElementById('btnSubmit').disabled = false;
    } else {
      document.getElementById('btnSubmit').disabled = true;
    }
  }

  /**
   *  @returns {null} -
   * @param {*} event -
   */
  onSave(event) {
    event.preventDefault();
    const user = this.state;
    // delete validControls from the user object
    delete user.validControls;
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
        document.getElementById('btnSubmit').disabled = false;
      }
    } else {
      // document.getElementById('btnSubmit').disabled = true;
      matchStatus = 'Password does not match';
      fontColor = '#ff0000';
      match = false;
      // disable submit button
      document.getElementById('btnSubmit').disabled = true;
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
    // materailze form validation
   /**
    $(document).ready(() => {
      $('form').validate({
        rules: {
          fname: {
            required: true,
            minlength: 2
          },
          lname: {
            required: true,
            minlength: 2
          },
          email: {
            required: true,
            email: true
          },
          password: {
            required: true,
            minlength: 8
          },
          confirm_password: {
            required: true,
            minlength: 8,
            equalTo: '#password'
          },
          roleId: {
            required: true,
          }
        },
        // For custom messages
        messages: {
          fname: {
            required: 'Please enter your first name.',
            minlength: 'You sure you\'re named with one letter?'
          },
          lname: {
            required: 'Please enter your last name.',
            minlength: 'You sure you\'re named with one letter?'
          },
          email: {
            required: 'Please enter your email address.',
            email: 'Please enter a valid email address.'
          },
          password: {
            required: 'Please enter a password.',
            minlength: 'Password must be atleast 8 characters.'
          },
          confirm_pass: {
            required: 'Please confirm your password.',
            minlength: 'Password must be atleast 8 characters.',
            equalTo: 'Password does not match.'
          },
          roleID: {
            required: 'Please select  your role.',
          }
        }
      });
    });
    */
    return (
      <div className="body row" id="signup">
        <form className="col s12" id="frmSignup">
          <br />
          <div className="row">
            <p className="errorMessage"> {this.props.message} </p>
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
                id="password"
                type="password"
                className="validate"
                value={this.state.password}
                onChange={this.onChange}
              />
              <label htmlFor="password">Password</label>
              <div className="comfirmPasswordStatus">
                <span id="passwordValidator" />
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
                className="validate"
                value={this.state.email}
                onChange={this.onChange}
              />
              <label htmlFor="email" >Email</label>
              <div className="comfirmPasswordStatus">
                <span id="emailValidator" />
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
                id="btnSubmit"
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

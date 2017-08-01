import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import toaster from 'toastr';
import updateProfile from '../actions/updateProfile';
import getUser from '../actions/getUser';
import {
  validateName,
  validateEmail,
  validatePassword
} from '../helpers/validator';

/**
 * @class Signup
 * @extends {React.Component}
 */
export class Profile extends React.Component {

  /**
   * Creates an instance of Signup.
   * @param {any} props -
   * @memberof Profile
   */
  constructor(props) {
    super(props);
    this.state = {
      lname: '',
      fname: '',
      mname: '',
      email: '',
      password: '',
      curPassword: '',
      message: '',
      showPassword: false,
      userid: 0,
      validControls: {},
      isloading: false,
      disableBtnUpdateProfile: true,
      disableBtnSubmit: true
    };
    this.onChange = this.onChange.bind(this);
    this.updateProfile = this.updateProfile.bind(this);
    this.matchPassword = this.matchPassword.bind(this);
    this.updatePassword = this.updatePassword.bind(this);
    this.updateProfile = this.updateProfile.bind(this);
    this.editPassword = this.editPassword.bind(this);
  }


  /**
   * @returns {null} -
   * @memberof Profile
   */
  componentWillMount() {
    // get user info from localstorage
    const user = JSON.parse(localStorage.getItem('userInfo'));
    if (user) {
      this.props.getUser(user.id);
      this.setState({
        isloading: true
      });
    } else {
      this.setState({
        isloading: false,
        message: 'Unable to retrieve your profile, please signout and login.',
      });
    }
  }

  /**
  * @param {any} nextProps -
  * @memberof profile
  * @returns {null} -
  */
  componentWillReceiveProps(nextProps) {
    // get user profile
    if (nextProps.email) {
      this.setState({
        fname: nextProps.fname,
        lname: nextProps.lname,
        mname: nextProps.mname,
        email: nextProps.email,
        validControls: {
          fname: nextProps.fname,
          lname: nextProps.lname,
          mname: nextProps.mname,
          email: nextProps.email
        },
        isloading: false,
        message: 'Update your profile and provide your  password.',
        updatePassword: false,
      });
    }
    const messageFrom = nextProps.messageFrom;
    if (messageFrom === 'profile' || messageFrom === 'getUser') {
      const message = nextProps.message;
      toaster.info(message);
      this.setState({
        isloading: false,
        message
      });
    }
  }

  /**
   * set the value of the control to the respective state node
   * @param {*} e -
   *  @returns {null} -
   */
  onChange(e) {
    // get validControls
    const validControls = this.state.validControls;
    // validate input
    let validationStatus;
    const controlName = e.target.name;
    const controlValue = e.target.value;
    const updatePassword = this.state.showPassword;
    let disableBtnUpdateProfile = true;
    let disableBtnSubmit = true;
    let validatorText = '';

    if (controlName === 'fname' || controlName === 'lname') {
      validationStatus = validateName(controlValue);
    } else if (controlName === 'mname') {
      if (controlValue === '') {
        validationStatus = true;
      } else {
        validationStatus = validateName(controlValue);
      }
    } else if (controlName === 'email') {
      validationStatus = validateEmail(controlValue);
    }
    // check if user does not want to update her password
    if (updatePassword) {
      if (controlName === 'curPassword') {
        validationStatus = validatePassword(controlValue);
      } else if (controlName === 'password') {
        // if the user clears the password field
        if (controlValue === '') {
          validationStatus = true;
        } else {
          validationStatus = validatePassword(controlValue);
        }
      }
    } else {
      // add password and curpassword to validControls dummy data
      validControls.password = ' ';
      validControls.curPassword = ' ';
    }

    // add control to list of valid control
    if (validationStatus === true) {
      // check if control was valid
      if (!validControls.hasOwnProperty(controlName)) {
        validControls[controlName] = controlValue;
      }
    } else {
      // remove control from list of validControls
      if (validControls.hasOwnProperty(controlName)) {
        delete validControls[controlName];
      }
      // show error message
      validatorText = validationStatus;
    }

    // enable button when every control is valid
    if (Object.keys(validControls).length === 6) {
      // if update password was checked
      if (updatePassword) {
        if (this.matchPassword()) {
          disableBtnSubmit = false;
        } else {
          disableBtnSubmit = true;
        }
      } else {
        disableBtnUpdateProfile = false;
      }
    } else if (updatePassword) {
      disableBtnSubmit = true;
    } else {
      disableBtnUpdateProfile = true;
    }

    // set state
    this.setState({
      [controlName]: controlValue,
      validControls,
      disableBtnUpdateProfile,
      disableBtnSubmit,
      [`${controlName}Validator`]: validatorText
    });
  }

  /**
   * @summary - update user profile
   *  @returns {null} -
   * @param {*} event -
   */
  updateProfile(event) {
    event.preventDefault();
    // create request payload from state
    const user = JSON.parse(localStorage.getItem('userInfo'));
    const userid = user.id;
    const userProfile = {
      fname: this.state.fname,
      lname: this.state.lname,
      mname: this.state.mname,
      email: this.state.email
    };
    // show preloader
    this.setState({
      isloading: true
    });
    this.props.updateProfile(userid, userProfile);
  }

  /**
   * @summary update user passwword
   *  @returns {null} -
   * @param {*} event -
   */
  updatePassword(event) {
    event.preventDefault();
    // create request payload from state
    const user = JSON.parse(localStorage.getItem('userInfo'));
    const userid = user.id;
    const userProfile = {
      fname: this.state.fname,
      lname: this.state.lname,
      mname: this.state.mname,
      email: this.state.email,
      password: this.state.password,
      curPassword: this.state.curPassword
    };
    // show preloader
    this.setState({
      isloading: true
    });
    this.props.updateProfile(userid, userProfile);
  }

  /**
   * check if password and comfirm password match
   * @memberof Profile
   *  @returns {null} -
   */
  matchPassword() {
    const comfirmpassword = this.comfirmpassword.value;
    let disableBtnSubmit = true;
    // if password and comfirm password match, set label to matched
    let match;
    let validatorText = '';
    if (comfirmpassword === this.state.password) {
      match = true;
      // get validControls
      const validControls = this.state.validControls;
      if (Object.keys(validControls).length === 6) {
        disableBtnSubmit = false;
      }
    } else {
      match = false;
      validatorText = 'Password does not match';
      // disable submit button
      disableBtnSubmit = true;
    }
    // set state
    this.setState({
      disableBtnSubmit,
      comfirmpasswordValidator: validatorText
    });
    return match;
  }


  /**
   * set update password state
   * @memberof Profile
   * @return {null} -
   */
  editPassword() {
    const showPassword = this.showPassword.checked;
    this.setState({
      showPassword
    });
  }


  /**
   * @returns {object} - html DOM
   * @memberof Profile
   */
  render() {
    const username =
    `${this.props.fname} ${this.props.mname} ${this.props.lname}`;
    return (
      <div className="container">
        <div className="body row" >
          <div className="col s12">
            <div className="userInfo row" >
              <h6 className="col l4 s12">
                  Name: {username}
              </h6>
              <h6 className="col l4 s12">
                  Email: {this.props.email}
              </h6>
              <h6 className="col l4 s12">
                  Group: {this.props.title}
              </h6>
            </div>
          </div>
          {(this.state.isloading)
            ?
              <div className="progress">
                <div className="indeterminate" />
              </div>
            :
            ''
          }
          <form className="col s12">
            <h6 id="message"> {this.state.message} </h6>
            <div className="row">
              <div className="col l6 m12 s12">
                <div className="row">
                  <div className="input-field col s12">
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
                    <label htmlFor="fname">First Name</label>
                    <div className="validatorContainer">
                      <span id="fnameValidator">
                        {this.state.fnameValidator}
                      </span>
                    </div>
                  </div>

                  <div className="input-field col s12">
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
                    <label htmlFor="mname">Middle Name</label>
                    <div className="validatorContainer">
                      <span id="mnameValidator">
                        {this.state.mnameValidator}
                      </span>
                    </div>
                  </div>

                  <div className="input-field col s12">
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
                    <label htmlFor="lname">Last Name</label>
                    <div className="validatorContainer">
                      <span id="lnameValidator" >
                        {this.state.lnameValidator}
                      </span>
                    </div>
                  </div>

                  <div className="input-field col s12">
                    <i className="material-icons prefix">email</i>
                    <input
                      placeholder="Email"
                      name="email"
                      type="email"
                      id="email"
                      className="validate"
                      value={this.state.email}
                      onChange={this.onChange}
                    />
                    <label htmlFor="email">Email</label>
                    <div className="validatorContainer">
                      <span id="emailValidator">
                        {this.state.emailValidator}
                      </span>

                    </div>
                  </div>

                  {(this.state.showPassword)
                    ?
                    ''
                    :
                    <div className="input-field col s12" >
                      <button
                        className="btn waves-effect waves-light right"
                        type="submit"
                        name="action"
                        id="btnUpdateProfile"
                        onClick={this.updateProfile}
                        disabled={this.state.disableBtnUpdateProfile}
                      >
                          Submit <i className="material-icons right">send</i>
                      </button>
                    </div>
                  }
                </div>
              </div>

              <div className="col l6 m12 s12">
                <div className="row">
                  <div className="switch col s12">
                    <h6>Edit your password </h6>
                    <label>
                      Off
                      <input
                        type="checkbox"
                        onChange={this.editPassword}
                        id="updatePassword"
                        ref={(input) => { this.showPassword = input; }}
                      />
                      <span className="lever" />
                      On
                    </label>
                  </div>
                  {(this.state.showPassword)
                  ?
                    <div>
                      <div className="input-field col s12">
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
                        <div className="validatorContainer">
                          <span id="passwordValidator">
                            {this.state.passwordValidator}
                          </span>
                        </div>
                      </div>

                      <div className="input-field col s12">
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
                          <span>
                            {this.state.comfirmpasswordValidator}
                          </span>
                        </div>
                      </div>

                      <div className="input-field col s12">
                        <i className="material-icons prefix">lock</i>
                        <input
                          placeholder="old Password"
                          name="curPassword"
                          id="curPassword"
                          type="password"
                          className="validate"
                          value={this.state.curPassword}
                          onChange={this.onChange}
                        />
                        <label htmlFor="curPassword">Authorize Password</label>
                        <div className="validatorContainer">
                          <span id="curPasswordValidator">
                            {this.state.curPasswordValidator}
                          </span>
                        </div>
                      </div>

                      <div className="input-field col l8 m6 s12" >
                        <button
                          className="btn waves-effect waves-light right"
                          type="submit"
                          name="action"
                          id="btnSubmit"
                          onClick={this.updatePassword}
                          disabled={this.state.disableBtnSubmit}
                        >
                        Submit <i className="material-icons right">send</i>
                        </button>
                      </div>
                    </div>
                  :
                  ''
                }
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

// Maps actions to props
const mapDispatchToProps = dispatch => ({
  updateProfile: (userId, userProfile) =>
    dispatch(updateProfile(userId, userProfile)),
  getUser: userID => dispatch(getUser(userID)),
});

// Maps state from store to props
const mapStateToProps = state => ({
  message: state.message.info,
  messageFrom: state.message.from,
  title: state.user.title,
  fname: state.user.fname,
  mname: state.user.mname,
  lname: state.user.lname,
  email: state.user.email
});

Profile.propTypes = {
  updateProfile: PropTypes.func.isRequired,
  getUser: PropTypes.func.isRequired,
  message: PropTypes.string,
  messageFrom: PropTypes.string,
  title: PropTypes.string,
  fname: PropTypes.string,
  mname: PropTypes.string,
  lname: PropTypes.string,
  email: PropTypes.string
};

Profile.defaultProps = {
  message: '',
  messageFrom: '',
  title: '',
  fname: '',
  mname: '',
  lname: '',
  email: ''
};
// Use connect to put them together
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(
  Profile));

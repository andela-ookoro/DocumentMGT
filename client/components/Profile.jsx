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
      curPassword: '',
      message: '',
      userid: 0,
      validControls: {},
      isloading: false
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
   * @memberof Signup
   */
  componentWillMount() {
    // if user has not signin, redirect to the login page
    if (!localStorage.getItem('jwt')) {
      window.location = '/#/';
    } else {
      // get user info from localstorage
      const user = JSON.parse(localStorage.getItem('userInfo'));
      const userID = user.id;
      if (userID) {
        this.props.getUser(userID);
        this.setState({
          isloading: true
        });
      }
    }
  }

  /**
   * @returns {null} -
   * @memberof profile
   */
  componentDidMount() {
    document.getElementById('btnUpdateProfile').disabled = true;
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
    if (nextProps.messageFrom === 'profile') {
      const message = nextProps.message;
      const formeValidControls = this.state.validControls;
      toaster.info(message);
      this.setState({
        isloading: false,
        message,
        validControls: formeValidControls
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
    const jquerySelector = `#${controlName}`;
    let enableButton = false;
    const updatePassword = this.state.updatePassword;

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

    // get validControls
    const validationLabel = document.getElementById(`${controlName}Validator`);
    // set state when input is valid
    if (validationStatus === true) {
      // check if control was valid
      if (!validControls.hasOwnProperty(controlName)) {
        validControls[controlName] = controlValue;
      }
      // remove error message
      validationLabel.textContent = '';
    } else {
      // remove control from list of validControls
      if (validControls.hasOwnProperty(controlName)) {
        delete validControls[controlName];
      }
      // show error message
      validationLabel.textContent = validationStatus;
      validationLabel.style.color = '#BD2F10';
    }
    // set state
    this.setState({
      [controlName]: controlValue,
      validControls
    });
    // enable button when every control is valid
    if (Object.keys(validControls).length === 6) {
      // if update password was checked
      if (updatePassword) {
        if (this.matchPassword()) {
          enableButton = false;
        } else {
          enableButton = true;
        }
        document.getElementById('btnSubmit').disabled = enableButton;
      } else {
          document.getElementById('btnUpdateProfile').disabled = false;
      }
    } else {
      // if update password was checked
      if (updatePassword) {
        document.getElementById('btnSubmit').disabled = true;
      } else {
        document.getElementById('btnUpdateProfile').disabled = false;
      }
    }
  }
  
  /**
   * @summary 
   *  @returns {null} -
   * @param {*} event -
   */
  updateProfile(event) {
    event.preventDefault();
    // create request payload from state
     const user = JSON.parse(localStorage.getItem('userInfo'));
     console.log(user, 'user')
    const userid = user.id;
    const userProfile = {
      fname: this.state.fname,
      lname: this.state.lname,
      mname: this.state.mname,
      email: this.state.email
    };
    console.log(userProfile, userid)
    // show preloader
    this.setState({
      isloading: true
    });
    this.props.updateProfile(userid, userProfile);
  }

  /**
   * @summary 
   *  @returns {null} -
   * @param {*} event -
   */
  updatePassword(event) {
    event.preventDefault();
    // create request payload from state
    const user = JSON.parse(localStorage.getItem('userInfo'));
    const userid = this.user.id;
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
      match = true;
      matchStatus = 'Right password';
      // get validControls
      const validControls = this.state.validControls;
      if (Object.keys(validControls).length === 6) {
        document.getElementById('btnSubmit').disabled = false;
      }
    } else {
      match = false;
      matchStatus = 'Password does not match';
      fontColor = '#ff0000';
      // disable submit button
      document.getElementById('btnSubmit').disabled = true;
    }
    //  set the result of the comparism
    const matchStatusTextBox = document
    .getElementById('comfirmpasswordValidator');
    matchStatusTextBox.textContent = matchStatus;
    matchStatusTextBox.style.color = fontColor;
    return match;
  }


  /**
   * set update password state
   * @memberof Profile
   */
  editPassword() {
    const updatePassword = document.getElementById('updatePassword').checked;
    this.setState({
      updatePassword
    })
  }


  /**
   * @returns {object} - html DOM
   * @memberof Signup
   */
  render() {
    const username= `${this.props.fname} ${this.props.mname} ${this.props.lname}`
    return (
      <div className="container">
        <div className="body row" >
          <div className="col s12">
             <div className=" userInfo row" >
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
                    <label htmlFor="first_name">First Name</label>
                    <div className="validatorContainer">
                      <span id="fnameValidator" />
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
                    <label htmlFor="middle_name">Middle Name</label>
                    <div className="validatorContainer">
                      <span id="mnameValidator" />
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
                    <label htmlFor="last_name">Last Name</label>
                    <div className="validatorContainer">
                      <span id="lnameValidator" />
                    </div>
                  </div>

                  <div className="input-field col s12">
                    <i className="material-icons prefix">email</i>
                    <input
                      placeholder="Email"
                      name="email"
                      type="email"
                      className="validate"
                      value={this.state.email}
                      onChange={this.onChange}
                    />
                    <label htmlFor="email">Email</label>
                    <div className="validatorContainer">
                      <span id="emailValidator" />
                    </div>
                  </div>

                  {(this.state.updatePassword) 
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
                        />
                      <span className="lever"></span>
                      On
                    </label>
                  </div>
                {(this.state.updatePassword) 
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
                        <span id="passwordValidator" />
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
                      <label htmlFor="comfirmpassword">comfirm password</label>
                      <div className="validatorContainer">
                        <span
                          id="comfirmpasswordValidator"
                          ref={(input) => { this.validatorContainer = input; }}
                        />
                      </div>
                    </div>

                    <div className="input-field col s12">
                      <i className="material-icons prefix">lock</i>
                      <input
                        placeholder="Authorize Password"
                        name="curPassword"
                        id="curPassword"
                        type="password"
                        className="validate"
                        value={this.state.curPassword}
                        onChange={this.onChange}
                      />
                      <label htmlFor="curPassword">Authorize Password</label>
                      <div className="validatorContainer">
                        <span id="curPasswordValidator" />
                      </div>
                    </div>

                    <div className="input-field col l8 m6 s12" >
                      <button
                        className="btn waves-effect waves-light right"
                        type="submit"
                        name="action"
                        id="btnSubmit"
                        onClick={this.updatePassword}
                        disabled
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
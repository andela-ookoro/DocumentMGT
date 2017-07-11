import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import toaster from 'toastr';
import updateProfile from '../actions/updateProfile';
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
      userid: 0,
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
    // if user has not signin, redirect to the login page
    if (!localStorage.getItem('jwt')) {
      window.location = '/#/';
    } else {
      // get user info from localstorage
      const user = JSON.parse(localStorage.getItem('userInfo'));

      const userNames = user.name.split(/(\s+)/)
        .filter(e => e.trim().length > 0);
      this.setState({
        fname: userNames[0],
        mname: userNames[1],
        lname: userNames[2],
        email: user.email,
        userid: user.id
      });
    }
  }
  /**
   * @returns {null} -
   * @memberof Signup
   */
  componentDidMount() {
    document.getElementById('btnSubmit').disabled = true;
  }
  /**
  * @param {any} nextProps -
  * @memberof Signup
  * @returns {null} -
  */
  componentWillReceiveProps(nextProps) {
    if (nextProps.messageFrom === 'profile') {
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
    } else if (e.target.name === 'password'
      || e.target.name === 'curPassword') {
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
    this.props.updateProfile(user);
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
      <div className="container">
        <div className="body row" >
          <form className="col s12">
            <h6>
             Update your profile and provide your  password.
            </h6>
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
                  <span id="fnameValidator" />
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
                  <span id="fnameValidator" />
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
                  <span id="fnameValidator" />
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
                <label htmlFor="comfirmpassword">comfirm password</label>
                <div className="comfirmPasswordStatus">
                  <span
                    id="comfirmPasswordStatus"
                    ref={(input) => { this.comfirmPasswordStatus = input; }}
                  />
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
                <label htmlFor="email">Email</label>
                <div className="comfirmPasswordStatus">
                  <span id="fnameValidator" />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="input-field col  l4 m6 s12">
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
                <div className="comfirmPasswordStatus">
                  <span id="fnameValidator" />
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
      </div>
    );
  }
}



// Maps actions to props
const mapDispatchToProps = dispatch => ({
  updateProfile: user => dispatch(updateProfile(user)),
});

// Maps state from store to props
const mapStateToProps = state => ({
  message: state.message.info,
  messageFrom: state.message.from
});

Profile.propTypes = {
  updateProfile: PropTypes.func.isRequired,
  message: PropTypes.string,
  messageFrom: PropTypes.string
};

Profile.defaultProps = {
  message: '',
  messageFrom: ''
};
// Use connect to put them together
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(
  Profile));

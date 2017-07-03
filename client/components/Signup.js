import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { signup } from '../actions/signup';
import { getRoles } from '../actions/roles';

/**
 * @class Signup
 * @extends {React.Component}
 */
class Signup extends React.Component {

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
      roleId: ''
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


  // /**
  //  *  @returns {null} -
  //  * @param {any} nextProps -
  //  * @memberof Signup
  //  */
  // componentWillReceiveProps(nextProps) {
  //   if (nextProps.roles.length > 0) {
  //     console.log('nextProps.roles.length', nextProps.roles.length);
  //   }
  // }

  /**
   * set the value of the control to the respective state node
   * @param {*} e -
   *  @returns {null} -
   */
  onChange(e) {
    // avoid control 'comfirm password' from setting state
    if (e.target.name) {
      this.setState({
        [e.target.name]: e.target.value
      });
    }
  }

  /**
   *  @returns {null} -
   * @param {*} event -
   */
  onSave(event) {
    event.preventDefault();
    this.props.signUp(this.state);
  }

  /**
   * check if password and comfirm password match
   * @memberof Signup
   *  @returns {null} -
   */
  matchPassword() {
    const comfirmpassword = this.comfirmpassword.value;
    // if password and comfirm password match, set label to matched
    if (comfirmpassword === this.state.password) {
      this.comfirmPasswordStatus.text = 'Right password';
    } else {
      this.comfirmPasswordStatus.text = 'Wrong password';
    }
  }


  /**
   * @returns {object} - html DOM
   * @memberof Signup
   */
  render() {
    return (
      <div className="body row" id="signup">
        <form className="col s12">
          <br />
          <div className="row">
            <p>  {this.props.signupMessage} </p>
            <div className="input-field col l4 m6 s12">
              <i className="material-icons prefix">account_circle</i>
              <input
                placeholder="First Name"
                name="fname"
                type="text"
                value={this.state.fname}
                onChange={this.onChange}
                className="validate"
                required
              />
              <label htmlFor="first_name">First Name</label>
            </div>
            <div className="input-field col l4 m6 s12">
              <i className="material-icons prefix">account_circle</i>
              <input
                placeholder="Middle Name"
                name="mname"
                type="text"
                className="validate"
                value={this.state.mname}
                onChange={this.onChange}
              />
              <label htmlFor="middle_name">Middle Name</label>
            </div>
            <div className="input-field col l4 m6 s12">
              <i className="material-icons prefix">account_circle</i>
              <input
                name="lname"
                placeholder="Last Name"
                type="text"
                className="validate"
                value={this.state.lname}
                onChange={this.onChange}
              />
              <label htmlFor="last_name">Last Name</label>
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
              />
              <label
                ref={(input) => { this.comfirmPasswordStatus = input; }}
                htmlFor="comfirmpassword"
              >
               Comfirm Password
             </label>
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
              <label htmlFor="email" data-error="wrong" data-success="right">
              Email
              </label>
            </div>
          </div>
          <div className="row">
            <div className="input-field col  l4 m6 s12">
              {
                <select
                  className="browser-default"
                  name="roleId"
                  value={this.state.roleId}
                  onChange={this.onChange}
                >
                  <option value="" disabled >Choose your group</option>
                  {this.props.roles.map(role =>
                    <option
                      key={role.id}
                      value={role.id}
                      title={role.description}
                    >
                      {role.title}
                    </option>
                  )}
                </select>
              }
            </div>
            <div className="input-field col l4 m6 s12" >
              <button
                className="btn waves-effect waves-light right"
                type="submit"
                name="action"
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
const mapDispatchToProps = (dispatch) => {
  return {
    signUp: user => dispatch(signup(user)),
    getRoles: () => dispatch(getRoles())
  };
};
// Maps state from store to props
const mapStateToProps = (state) => {
  return {
    // You can now say this.props.books
    roles: state.roles,
    signupMessage: state.signupMessage
  };
};

Signup.propTypes = {
  getRoles: PropTypes.func.isRequired,
  signUp: PropTypes.func.isRequired,
  roles: React.PropTypes.arrayOf(React.PropTypes.shape({
    id: React.PropTypes.number.isRequired,
    description: React.PropTypes.string.isRequired,
  }
  )),
  signupMessage: PropTypes.string
};

Signup.defaultProps = {
  signupMessage: '',
  roles: []
};
// Use connect to put them together
export default connect(mapStateToProps, mapDispatchToProps)(Signup);

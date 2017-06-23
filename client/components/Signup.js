import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as signupActions from '../actions/signupActions';
import * as roleActions  from '../actions/rolesActions';
import Login from './Login';

class Signup extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      lname: '',
      fname: '',
      mname: '',
      email: '',
      password: '',
      roleId: '',
    };
    this.onChange = this.onChange.bind(this);
    this.onSave = this.onSave.bind(this);
   
  }

  componentWillMount() {
     this.props.getRoles();
  }
  /**
   * set the value of the control to the respective state node
   * @param {*} e 
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
   * 
   * @param {*} event 
   */
  onSave(event) {
    event.preventDefault();
    this.props.signupUser(this.state);
  }

  render(){
    return(
      <div className="container">
      <div className="welcomeDiv">
        <img src="/logo.png" id="logoImg"/>
        <span className="logoName"> Doc Hub </span>
        welcome .....
      </div>
       <div className="row">
        <div className="col s12">
          <ul className="tabs">
            <li className="tab col s3"><a className="active" href="#signin">Sign in</a></li>
            <li className="tab col s3"><a  href="#signup">Create a account</a></li>
          </ul>
        </div>
        <div className="body row" id="signup">
          <form className="col s12">
            <br />
            <div className="row">
              <p>  {this.props.signupMessage}  </p>
              <div className="input-field col l4 m6 s12">
                <i className="material-icons prefix">account_circle</i>
                <input
                  placeholder="First Name" name="fname" type="text"
                  value={this.state.fname} onChange={this.onChange}
                  className="validate" required
                />
                <label htmlFor="first_name">First Name</label>
              </div>
              <div className="input-field col l4 m6 s12">
                <i className="material-icons prefix">account_circle</i>
                <input 
                   placeholder="Middle Name" name="mname" type="text"
                   className="validate" value={this.state.mname}
                   onChange={this.onChange}
                />
                <label htmlFor="middle_name">Middle Name</label>
              </div>
              <div className="input-field col l4 m6 s12">
                <i className="material-icons prefix">account_circle</i>
                <input
                  name="lname" placeholder="Last Name" type="text"
                  className="validate" value={this.state.lname}
                  onChange={this.onChange}
                 />
                <label htmlFor="last_name">Last Name</label>
              </div>
            </div>
            <div className="row">
              <div className="input-field col  l4 m6 s12">
                <i className="material-icons prefix">lock</i>
                <input
                  placeholder="Password" name="password" id="password"
                  type="password" className="validate" 
                  value={this.state.password} onChange={this.onChange}
                />
                <label htmlFor="password">Password</label>
              </div>
              <div className="input-field col  l4 m6 s12">
                <i className="material-icons prefix">email</i>
                <input
                  placeholder="Email" name="email" type="email"
                  className="validate" value={this.state.email}
                  onChange={this.onChange}
                />
                <label htmlFor="email" data-error="wrong" data-success="right">Email</label>
              </div>
               <div className="input-field col  l4 m6 s12">
                 {
                   <select
                  className="browser-default" name="roleId"
                  value={this.state.roleId} onChange={this.onChange}
                 >
                  <option value="" disabled >Choose your group</option>
                    {this.props.roles.map(role => 
                      <option
                        key={role.id} value={role.id} title={role.description}
                        >
                        {role.title}
                      </option>
                    )}
                   </select>
                 }
              </div>
            </div>
            <div className="row">
              <div className="input-field col s12" >
                 <button
                  className="btn waves-effect waves-light right" type="submit"
                  name="action" onClick={this.onSave} 
                 >
                   Submit <i className="material-icons right">send</i>
                  </button>
              </div>
            </div>
            </form>
          </div>
        
            <div className="body row" id="signin">
              <Login />
           </div>
      </div>
    </div>
    )
  }
}

// Maps state from store to props
// const mapStateToProps = ({ roles, signupMessage }) => ({ roles, signupMessage });

// Maps actions to props
const mapDispatchToProps = (dispatch) => {
  return {
    signUp: credentials => signupActions.signupUser(credentials),
    getRoles: () => roleActions.getRoles()
  }
};
// Maps state from store to props
const mapStateToProps = (state, ownProps) => {
  return {
    // You can now say this.props.books
    roles: state.roles,
    signupMessage: state.signupMessage
  }
};



// Use connect to put them together
export default connect(mapStateToProps, mapDispatchToProps)(Signup);
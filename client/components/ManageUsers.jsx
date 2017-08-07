import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import toaster from 'toastr';
import _ from 'lodash/array';
import getUsers from '../actions/getUsers';
import blockUser from '../actions/blockUser';
import restoreUser from '../actions/restoreUser';
import { toServertime } from '../helper';


/**
 * @class ManageUsers
 * @extends {React.Component}
 */
export class ManageUsers extends React.Component {

  /**
   * Creates an instance of ManageUsers.
   * @param {any} props -
   * @memberof ManageUsers
   */
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      message: '',
      category: 'active',
      searchHint: '',
      curUserID: 0,
      pageCount: 0,
      isloading: false,
      noFound: ''
    };

    // this.onChange = this.onChange.bind(this);
    this.getUsers = this.getUsers.bind(this);
    this.blockUser = this.blockUser.bind(this);
    this.restoreUser = this.restoreUser.bind(this);
    this.searchUser = this.searchUser.bind(this);
    this.handlePageClick = this.handlePageClick.bind(this);
  }


  /**
   * set the default view to 'active users'
   * @memberof ManageUsers
   *  @returns {null} -
   */
  componentWillMount() {
    this.props.getUsers('active', '', 0, 6);
    this.setState({
      isloading: true
    });
  }

  /**
   * set the default view to 'myDocument'
   * @memberof ManageUsers
   *  @returns {null} -
   */
  componentDidMount() {
    $('ul.tabs').tabs();
  }

  /**
   * @param {any} nextProps -
   * @memberof ManageUsers
   *  @returns {null} -
   */
  componentWillReceiveProps(nextProps) {
    // set state to reflect the props dispatched
    const pageCount = nextProps.pageCount;
    let message = '';
    let newUsers;
    // show error message when error is reported
    if (nextProps.messageFrom === 'getUsers'
      || nextProps.messageFrom === 'blockUser'
      || nextProps.messageFrom === 'restoreUser') {
      message = nextProps.message;
      // show message only when message exists
      if (message.toString().includes('success')) {
        // remove row from table when opertion was successfully
        const curUserId = this.state.curUserID;
        newUsers = _.remove(this.state.users, (user) => {
          return (user.id === parseInt(curUserId, 10));
        });
      }
      toaster.info(nextProps.message);
    }
    this.setState({
      status: nextProps.status,
      users: nextProps.users,
      pageCount,
      noFound: `${pageCount} user${(pageCount<2) ? '' : 's'} found`,
      isloading: false,
      curUserID: 0,
      message,
    });
  }

  /**
   * get the users in a particular category
   * @param {any} tab
   * @memberof ManageUsers
   *  @returns {null} -
   */
  getUsers(tab) {
    const category = tab.target.getAttribute('value');
    this.props.getUsers(category, '', 0, 6);
    // set category for further search such as pagination
    this.setState({
      category,
      searchHint: '',
      isloading: true
    });
  }

  /**
   * block a user
   * @param {object} e - the event source
   * @memberof ManageUsers
   *  @returns {null} -
   */
  blockUser(e) {
    const userID = e.target.id;
    this.props.blockUser(userID);
    this.setState({
      isloading: true,
      curUserID: userID
    });
  }

  /**
   * restore a user
   * @param {object} e - the event source
   * @memberof ManageUsers
   *  @returns {null} -
   */
  restoreUser(e) {
    const userID = e.target.id;
    this.props.restoreUser(userID);
    this.setState({
      isloading: true,
      curUserID: userID
    });
  }

  /**
   * search for users
   * @param {object} e - the event source
   * @memberof ManageUsers
   * @returns {null} -
   */
  searchUser() {
    const searchHint = this.searchHint.value;
    // set state for pagination, to remove category all general search
    this.setState({
      searchHint,
      category: '',
      isloading: true
    });
    // toaster.info(`searching for users with hint ${searchHint}`);
    this.props.getUsers('', searchHint, 0, 6);
  }


  /**
   * handle pagination
   * @memberof ManageUsers
   * @param {int} page - current page
   * @returns {null} -
   */
  handlePageClick(page) {
    const curPage = page.selected;
    const offset = Math.ceil(curPage * 6);
    const searchHint = this.state.searchHint;
    const category = this.state.category;
    this.props.getUsers(category, searchHint, offset, 6);
  }

  /**
   * @returns {object} - html dom
   * @memberof ManageUsers
   */
  render() {
    return (
      <div className="container">
        <div className="body row">
          {(this.state.isloading)
            ?
              <div className="progress">
                <div className="indeterminate" />
              </div>
            :
            ''
          }
          <div className="col s12 m8 l10" id="searchDiv">
            <div className="row">
              <form>
                <div className="col s12 m12 l5 ">
                  {(this.state.message !== '')
                    ?
                      <h6 className="errorMessage">{this.state.message} </h6>
                    :
                      <h6 className="searchCount">{this.state.noFound} </h6>
                  }
                </div>
                <div className="col s9 m8 l5">
                  <input
                    placeholder="Search for users"
                    type="text"
                    name="searchHint"
                    id="searchHint"
                    ref={(input) => { this.searchHint = input; }}
                    onChange={this.searchUser}
                  />
                </div>
                <div className="col s3 m4 l2">
                  <botton className="tooltip">
                    <i
                      className="material-icons"
                      id="btnSearch"
                      onClick={this.searchUser}
                    >
                    search
                    </i>
                    <span
                      className="tooltiptext"
                      style={{ left: '105%', top: '-5px' }}
                    >
                      Search for users
                   </span>
                  </botton>
                </div>
              </form>
            </div>
          </div>
          <div className="col s12">
            <ul className="tabs">
              <li className="tab col s3">
                <a
                  className="active"
                  href="#adminDashboard"
                  value="active"
                  id="active"
                  onClick={this.getUsers}
                >
                  Active Users
                </a>
              </li>
              <li className="tab col s3">
                <a
                  href="#adminDashboard"
                  value="disabled"
                  id="disabled"
                  onClick={this.getUsers}
                >
                  Blocked Users
                </a>
              </li>
              <li className="tab col s3">
                <a
                  href="#adminDashboard"
                  value="inactive"
                  id="inactive"
                  onClick={this.getUsers}
                >
                  Deleted Users
                </a>
              </li>
            </ul>
          </div>

          <div id="adminDashboard" >
            {(this.state.users.length > 0) ?
              <div>
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Document count</th>
                      <th> Registered since </th>
                      <th>Status</th>
                      <th />
                    </tr>
                  </thead>

                  <tbody id="tblUsers">
                    {this.state.users.map(user => (
                      <tr key={user.id} id={`row${user.id}`}>
                        <td id={`name${user.id}`}>{user.name}</td>
                        <td id={`email${user.id}`}>{user.email}</td>
                        <td id={`role${user.id}`}>{user.role}</td>
                        <td id={`docCount${user.id}`}>
                          {user.doccount}
                        </td>
                        <td> {toServertime(user.createdAt)} </td>
                        <td id={`status${user.id}`}>
                          {user.status}
                        </td>
                        <td>
                          {(user.status === 'active')
                            ?
                              <botton className="tooltip">
                                <i
                                  className="admin-Action material-icons"
                                  id={user.id}
                                  onDoubleClick={this.blockUser}
                                >
                                  lock_outline
                                  </i>
                                <span className="tooltiptext">
                                  Double click to block user
                                </span>
                              </botton>
                            :
                            ''
                        }
                        {(user.status === 'disabled')
                            ?
                              <botton className="tooltip">
                                <i
                                  className="admin-Action material-icons"
                                  id={user.id}
                                  onDoubleClick={this.restoreUser}
                                >
                                  lock_open
                                  </i>
                                <span className="tooltiptext">
                                  double click to restore user
                                </span>
                              </botton>
                            :
                            ''
                        }
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <ReactPaginate
                  previousLabel={'previous'}
                  nextLabel={'next'}
                  breakLabel={<a href="">...</a>}
                  breakClassName={'break-me'}
                  pageCount={this.state.pageCount / 6}
                  marginPagesDisplayed={2}
                  pageRangeDisplayed={5}
                  onPageChange={this.handlePageClick}
                  containerClassName={'pagination'}
                  subContainerClassName={'pages pagination'}
                  activeClassName={'active'}
                />
              </div>
              :
              <div className="no-record">
                <br />
                <h4> No user found, try more options above &uarr;. </h4>
              </div>
            }
          </div>
        </div>
      </div>
    );
  }
}

// Maps state from store to props
const mapStateToProps = state => (
  {
    status: state.Users.status,
    users: state.Users.users,
    pageCount: state.Users.pageCount,
    message: state.message.info,
    messageFrom: state.message.from
  }
);

// Maps actions to props
const mapDispatchToProps = dispatch => (
  {
    getUsers: (category, hint, offset, limit) => {
      dispatch(getUsers(category, hint, offset, limit));
    },
    blockUser: userID => dispatch(blockUser(userID)),
    restoreUser: userID => dispatch(restoreUser(userID))
  }
);

ManageUsers.propTypes = {
  getUsers: PropTypes.func.isRequired,
  blockUser: PropTypes.func.isRequired,
  restoreUser: PropTypes.func.isRequired,
  users: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      role: PropTypes.string.isRequired,
      createdAt: PropTypes.string.isRequired,
      doccount: PropTypes.string.isRequired
    })
  ),
  status: PropTypes.string,
  pageCount: PropTypes.number,
  message: PropTypes.string,
  messageFrom: PropTypes.string
};

ManageUsers.defaultProps = {
  status: '',
  pageCount: 0,
  message: '',
  messageFrom: '',
  users: []
};

// Use connect to put them together
export default connect(mapStateToProps,
mapDispatchToProps)(withRouter(ManageUsers));

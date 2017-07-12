import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import toaster from 'toastr';
import getDocuments from '../actions/getDocuments';
import { toServertime } from '../helper';
import deleteDocument from '../actions/deleteDocument';

/**
 * @class Documents
 * @extends {React.Component}
 */
export class Documents extends React.Component {

  /**
   * Creates an instance of Documents.
   * @param {any} props -
   * @memberof Documents
   */
  constructor(props) {
    super(props);
    this.state = {
      documents: [],
      message: '',
      category: 'myDocument',
      searchHint: '',
      pageCount: 0
    };

    // this.onChange = this.onChange.bind(this);
    this.getDocuments = this.getDocuments.bind(this);
    // this.setDocuments = this.setDocuments.bind(this);
    this.deleteDocument = this.deleteDocument.bind(this);
    this.searchDocument = this.searchDocument.bind(this);
    this.handlePageClick = this.handlePageClick.bind(this);
  }


  /**
   * set the default view to 'myDocument'
   * @memberof Documents
   *  @returns {null} -
   */
  componentWillMount() {
    this.props.getDocuments('myDocument', '', 0, 6);
  }


  /**
   * @param {any} nextProps -
   * @memberof Documents
   *  @returns {null} -
   */
  componentWillReceiveProps(nextProps) {
    // set state to reflect the props dispatched
    this.setState({
      status: nextProps.status,
      documents: nextProps.documents,
      pageCount: nextProps.pageCount
    });

    // show error message when error is reported
    if (nextProps.messageFrom === 'getDocuments') {
      toaster.info(nextProps.message);
      this.setState({
        message: nextProps.message
      });
    } else if (nextProps.messageFrom === 'deleteDocument') {
      toaster.info(nextProps.message);
      this.setState({
        message: nextProps.message
      });
    } else {
      // reset message state
      this.setState({
        message: ''
      });
    }
  }

  /**
   * get the documents in a particular category
   * @param {any} tab
   * @memberof Documents
   *  @returns {null} -
   */
  getDocuments(tab) {
    const category = tab.target.getAttribute('value');
    this.props.getDocuments(category, '', 0, 6);
    // set category for further search such as pagination
    this.setState({
      category,
      searchHint: ''
    });
  }

  /**
   * delete a document
   * @param {object} e - the event source
   * @memberof Documents
   *  @returns {null} -
   */
  deleteDocument(e) {
    const documentID = e.target.id;
    this.props.deleteDocument(documentID);
  }

  /**
   * search for document
   * @param {object} e - the event source
   * @memberof Documents
   * @returns {null} -
   */
  searchDocument() {
    const searchHint = this.searchHint.value;
    // set state for pagination, to remove category all general search
    this.setState({
      searchHint,
      category: ''
    });
    toaster.info(`searching for documents with hint ${searchHint}`);
    this.props.getDocuments('', searchHint, 0, 6);
  }


  /**
   * handle pagination
   * @memberof Documents
   * @param {int} page - current page
   * @returns {null} -
   */
  handlePageClick(page) {
    const curPage = page.selected;
    const offset = Math.ceil(curPage * 6);
    const searchHint = this.state.searchHint;
    const category = this.state.category;
    this.props.getDocuments(category, searchHint, offset, 6);
  }


  /**
   * @returns {object} - html dom
   * @memberof Documents
   */
  render() {
    // get user info from local storage
    const user = JSON.parse(localStorage.getItem('userInfo'));
    return (
      <div className="container">
        <div className="body row">
          <div className="col s12 m8 l6" id="searchDiv">
            <div className="row">
              <form>
                <p className="errorMessage col s12 m12 l3 ">
                  {this.state.message} </p>
                <div className="col s9 m8 l7">
                  <input
                    placeholder="Search for documents"
                    type="text"
                    name="searchHint"
                    id="searchHint"
                    ref={(input) => { this.searchHint = input; }}
                    onChange={this.searchDocument}
                  />
                </div>
                <div className="col s3 m4 l2">
                  <botton className="tooltip">
                    <i
                      className="material-icons"
                      id="btnSearch"
                      onClick={this.searchDocument}
                    >
                    search
                    </i>
                    <span
                      className="tooltiptext"
                      style={{ left: '105%', top: '-5px' }}
                    >
                      Search for documents
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
                  href="#documentDashboard"
                  value="myDocument"
                  id="myDocument"
                  onClick={this.getDocuments}
                >
                  My Documents
                </a>
              </li>
              <li className="tab col s3">
                <a
                  href="#documentDashboard"
                  value="private"
                  id="private"
                  onClick={this.getDocuments}
                >
                  Private Documents
                </a>
              </li>
              <li className="tab col s3">
                <a
                  href="#documentDashboard"
                  value="public"
                  id="public"
                  onClick={this.getDocuments}
                >
                  Public Documents
                </a>
              </li>
              <li className="tab col s3">
                <a
                  href="#documentDashboard"
                  value="role"
                  id="role"
                  onClick={this.getDocuments}
                >
                  Group Documents
                </a>
              </li>
            </ul>
          </div>

          <div id="documentDashboard" >
            {(this.state.documents.length > 0) ?
              <div>
                <table>
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Author</th>
                      <th>Date Created</th>
                      <th>Accessibilty</th>
                      <th />
                    </tr>
                  </thead>

                  <tbody>
                    {this.state.documents.map(document => (
                      <tr key={document.id} id={`doc${document.id}`}>
                        <td id={`title${document.id}`}>{document.title}</td>
                        <td id={`author${document.id}`}>{document.author}</td>
                        <td id={`createdAt${document.id}`}>
                          {toServertime(document.createdAt)}
                        </td>
                        <td >{document.accessRight}</td>
                        {(user.id === document.owner)
                          ?
                            <td>
                              <a
                                className="tooltip"
                                href={`#/document/${document.id}/${document
                                  .title
                                  .toString()
                                  .replace(new RegExp(' ', 'g'), '_')}`}
                              >
                                <i className=" material-icons">description</i>
                                <span className="tooltiptext">
                                  View document
                               </span>
                              </a>
                              <a
                                className="tooltip"
                                href={`#/createDocument/${document
                                  .id}/${document
                                  .title.toString()
                                  .replace(new RegExp(' ', 'g'), '_')}/edit`}
                              >
                                <i className=" material-icons">mode_edit</i>
                                <span className="tooltiptext">
                                  Edit document
                                </span>
                              </a>
                              <botton className="tooltip">
                                <i
                                  className="material-icons"
                                  id={document.id}
                                  onClick={this.deleteDocument}
                                >
                                  delete
                                  </i>
                                <span className="tooltiptext">
                                  Delete document
                                </span>
                              </botton>
                            </td>
                          :
                            <td>
                              <a
                                className="tooltip"
                                href={`#/document/${document.id}/${document
                                  .title
                                  .toString()
                                  .replace(new RegExp(' ', 'g'), '_')}`}
                              >
                                <i className=" material-icons">description</i>
                                <span className="tooltiptext">
                                  View document
                                </span>
                              </a>
                            </td>
                        }
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
              <div className="info">
                <br />
                <h4> No document found, try more options &uarr;. </h4>
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
    status: state.Documents.status,
    documents: state.Documents.documents,
    pageCount: state.Documents.pageCount,
    message: state.message.info,
    messageFrom: state.message.from
  }
);

// Maps actions to props
const mapDispatchToProps = dispatch => (
  {
    getDocuments: (accessRight, title, offset, limit) => {
      dispatch(getDocuments(accessRight, title, offset, limit));
    },
    deleteDocument: documentID => dispatch(deleteDocument(documentID))
  }
);

Documents.propTypes = {
  getDocuments: PropTypes.func.isRequired,
  deleteDocument: PropTypes.func.isRequired,
  documents: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      body: PropTypes.string,
      author: PropTypes.string,
      accessRight: PropTypes.string,
      owner: PropTypes.number,
      createdAt: PropTypes.string
    })
  ),
  status: PropTypes.string,
  pageCount: PropTypes.number,
  message: PropTypes.string,
  messageFrom: PropTypes.string


};

Documents.defaultProps = {
  status: '',
  pageCount: 0,
  message: '',
  messageFrom: '',
  documents: []
};

// Use connect to put them together
export default connect(mapStateToProps,
mapDispatchToProps)(withRouter(Documents));

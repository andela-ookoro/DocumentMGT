import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import toaster from 'toastr';
import _ from 'lodash/array';
import getDocuments from '../actions/getDocuments';
import deleteDocument from '../actions/deleteDocument';
import sendMessage from '../actions/message';
import DocumentList from './DocumentList';

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
      searchText: '',
      pageCount: 0,
      isloading: false,
      selectedDocumentID: 0
    };

    this.getDocuments = this.getDocuments.bind(this);
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
    this.setState({
      isloading: true
    });
  }

  /**
   * set the default view to 'myDocument'
   * @memberof Documents
   *  @returns {null} -
   */
  componentDidMount() {
    $('ul.tabs').tabs();
  }

  /**
   * @param {any} nextProps -
   * @memberof Documents
   *  @returns {null} -
   */
  componentWillReceiveProps(nextProps) {
    let message = '';
    const sender = nextProps.messageFrom;
    let pageCount = nextProps.pageCount;
    // show error message when error is reported
    if (sender === 'getDocuments' || sender === 'deleteDocument') {
      message = nextProps.message;
      if (sender === 'deleteDocument') {
        // remove document from table
        if (message.toString().includes('success')) {
          // remove row from table when opertion was successfully
          const selectedDocumentID = this.state.selectedDocumentID;
          _.remove(this.state.documents, (document) => {
            return (document.id === parseInt(selectedDocumentID, 10));
          });
          pageCount -= 1;
        }
      }

      // show message only when message exists
      if (message !== '' &&
       (sender === 'getDocuments' || sender === 'deleteDocument')) {
        toaster.info(message);
      }
    }
    // set state to reflect the props dispatched
    this.setState({
      message,
      isloading: false,
      noFound: `${pageCount} document${(pageCount < 2) ? '' : 's'} found`,
      selectedDocumentID: 0,
      status: nextProps.status,
      pageCount,
      documents: nextProps.documents,
    });
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
      searchText: '',
      isloading: true
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
    this.setState({
      isloading: true,
      selectedDocumentID: documentID
    });
  }

  /**
   * search for document
   * @param {object} e - the event source
   * @memberof Documents
   * @returns {null} -
   */
  searchDocument() {
    const searchText = $('#searchText').val();
    // set state for pagination, remove category for  general search
    this.setState({
      searchText,
      category: '',
      isloading: true
    });
    // toaster.info(`searching for documents with hint ${searchText}`);
    this.props.getDocuments('', searchText, 0, 6);
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
    const searchText = this.state.searchText;
    const category = this.state.category;
    this.props.getDocuments(category, searchText, offset, 6);
  }


  /**
   * @returns {object} - html dom
   * @memberof Documents
   */
  render() {
    // const user = JSON.parse(localStorage.getItem('userInfo'));
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
                      <h6 className="errorMessage" id="message">
                        {this.state.message}
                      </h6>
                    :
                      <h6 className="searchCount">{this.state.noFound} </h6>
                  }
                </div>
                <div className="col s9 m8 l5">
                  <input
                    placeholder="Search for documents"
                    type="text"
                    name="searchText"
                    id="searchText"
                    ref={(input) => { this.searchText = input; }}
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
            {(this.state.documents.length > 0)
              ?
                <div>
                  <table id="tbDocuments">
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
                        <DocumentList
                          id={document.id}
                          key={document.id}
                          title={document.title}
                          author={document.author}
                          accessRight={document.accessRight}
                          owner={document.owner}
                          createdAt={document.createdAt}
                          deleteDocument={this.deleteDocument}
                        />
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
                  <h4 id="noDoc" className="no-record">
                    No document found, try more options above &uarr;.
                  </h4>
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
    getDocuments: (accessRight, title, offset, limit) =>
      dispatch(getDocuments(accessRight, title, offset, limit)),
    deleteDocument: documentID => dispatch(deleteDocument(documentID)),
    sendMessage: () => dispatch(sendMessage())
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

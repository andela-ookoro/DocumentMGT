import React from "react";
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import getDocuments from '../actions/getDocuments'; 
import { toServertime } from '../helper';
import deleteDocument from '../actions/deleteDocument';


class Documents extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      documents: [],
      message: '',
      category: 'myDocument',
      searchHint: '',
      pageCount: 0
    };
    
    this.onChange = this.onChange.bind(this);
    this.getDocuments = this.getDocuments.bind(this);
    // this.setDocuments = this.setDocuments.bind(this);
    this.deleteDocument = this.deleteDocument.bind(this);
    this.searchDocument =  this.searchDocument.bind(this);
  }


  /**
   * set the default view to 'myDocument'
   * @memberof Documents
   */
  componentWillMount() {
   this.props.getDocuments('myDocument', '', 0, 6);
  }

  componentWillReceiveProps(nextProps) {
    // set state to reflect the props dispatched
    this.setState({
      status: nextProps.status,
      documents: nextProps.documents,
      pageCount: nextProps.pageCount
    });

    // show error message when error is reported
    if (nextProps.status !== 'success' || nextProps.deleteStatus !== 'success') {
      this.setState({
        message: nextProps.message
      });
      Materialize.toast(nextProps.message, 3000, 'rounded');
    }
    if (nextProps.deleteStatus === 'success') {
      this.setState({
        message: 'Document has been deleted successfully'
      });
      Materialize.toast('Document has been deleted successfully', 3000,'rounded');
    }
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
   * get the documents in a particular category
   * @param {any} tab 
   * @memberof Documents
   */
  getDocuments(tab) {
    let category = tab.target.getAttribute('value');
    if (category) {
      this.props.getDocuments(category, '', 0, 6);
      // set category for further search such as pagination
      this.setState({
        category,
        searchHint: ''
      });
    }
  }

  /**
   * delete a document 
   * @param {object} e - the event source
   * @memberof Documents
   */
  deleteDocument(e) {
    const documentID = e.target.id;
    this.props.deleteDocument(documentID);
  };

  /**
   * search for document 
   * @param {object} e - the event source
   * @memberof Documents
   */
  searchDocument(e) {
    const searchHint = this.searchHint.value;
    // set state for pagination, to remove category all general search
    this.setState({
      searchHint,
      category: ''
    })
    Materialize.toast(`search for documents with hint ${searchHint}`, 3000, 'rounded');
    this.props.getDocuments('', searchHint, 0, 6);
  }


  /**
   * handle pagination
   * @memberof Documents
   */
  handlePageClick = (page) => {
    const curPage = page.selected;
    const offset = Math.ceil(curPage * 7);
    const searchHint = this.state.searchHint;
    const category = this.state.category
    this.props.getDocuments(this.state.category, searchHint, offset, 6);
  };

  render() {
    // get user info from local storage
    const user = JSON.parse(localStorage.getItem('userInfo'));

    return (
      <div className="container">
        <div className="body row">
          <div className="col s12 m8 l6" id="searchDiv">
            <div className="row">
              <form>
                <div className="col s9 m8 l10">
                  <input
                    placeholder="Search for documents" type="text"
                    name="searchHint" 
                    ref={(input) => { this.searchHint = input; }}
                    onChange={this.searchDocument}
                    />
                </div>
                <div className="col s3 m4 l2">
                  <botton className="tooltip"> 
                    <i
                    className="material-icons"
                    id={document.id}
                    onClick={this.searchDocument}
                    >
                    search
                    </i>
                  <span
                    className="tooltiptext"
                    style={{ left: '105%', top: '-5px'}}
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
                  onClick={this.getDocuments}
                >
                  My Documents
                </a>
              </li>
              <li className="tab col s3">
                <a
                  href="#documentDashboard"
                  value="private"
                  onClick={this.getDocuments}
                >
                  Private Documents
                </a>
              </li>
              <li className="tab col s3">
                <a
                  href="#documentDashboard"
                  value="public"
                  onClick={this.getDocuments}
                >
                  Public Documents
                </a>
              </li>
              <li className="tab col s3">
                <a
                  href="#documentDashboard"
                  value="role"
                  onClick={this.getDocuments}
                >
                  Group Documents
                </a>
              </li>
              <li className="tab col s1"><a href="#fake">Test 4</a></li>
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
                        <th></th>
                    </tr>
                  </thead>

                  <tbody>
                    {this.state.documents.map(document => 
                      <tr key={document.id} id={`doc${document.id}`}>
                        <td>{document.title}</td>
                        <td>{document.author}</td>
                        <td>{toServertime(document.createdAt)}</td>
                        <td>{document.accessRight}</td>
                        {(user.id === document.owner)
                          ?
                          <td>
                            <a
                              className="tooltip"
                              href={`#/document/${document.id}/${document.title
                                .toString()
                                .replace(new RegExp(' ', 'g'), '_')}`}> 
                              <i className=" material-icons">description</i>
                              <span className="tooltiptext">View document</span>
                            </a>
                            <a 
                              className="tooltip"
                              href={`#/createDocument/${document.id}/${document
                                .title.toString()
                                .replace(new RegExp(' ', 'g'), '_')}/edit`}
                              > 
                              <i className=" material-icons">mode_edit</i> 
                              <span className="tooltiptext">Edit document</span>
                            </a>
                            <botton className="tooltip"> 
                               <i
                                className="material-icons"
                                id={document.id}
                                onClick={this.deleteDocument}
                                >
                                delete
                                </i>
                              <span className="tooltiptext">Delete document</span>
                            </botton>
                          </td>
                          :
                          <td>
                            <a
                              className="tooltip"
                              href={`#/document/${document.id}/${document.title
                                .toString()
                                .replace(new RegExp(' ', 'g'), '_')}`}> 
                              <i className=" material-icons">description</i>
                              <span className="tooltiptext">View document</span>
                            </a>
                          </td>
                        }
                      </tr>
                    )}
                  </tbody>
                </table>
                <ReactPaginate previousLabel={"previous"}
                  nextLabel={"next"}
                  breakLabel={<a href="">...</a>}
                  breakClassName={"break-me"}
                  pageCount={this.state.pageCount/6}
                  marginPagesDisplayed={2}
                  pageRangeDisplayed={5}
                  onPageChange={this.handlePageClick}
                  containerClassName={"pagination"}
                  subContainerClassName={"pages pagination"}
                  activeClassName={"active"} />
              </div>
              :
              <div className="info">
                <br />  
                <h4> No document found, try more options &uarr;. </h4>
              </div>
            }
          </div>
          <div id="fake" className="col s12"></div>
        </div>
      </div>
    );
  }
}

// Maps state from store to props
const mapStateToProps = state => {
  return {
    status: state.Documents.status,
    documents: state.Documents.documents,
    pageCount: state.Documents.pageCount,
    message: state.Documents.message || state.deleteDocument.message,
    deleteStatus: state.deleteDocument.status
  };
};

// Maps actions to props
const mapDispatchToProps = dispatch => {
  return {
    getDocuments: (accessRight, title, offset, limit) => {
      dispatch(getDocuments(accessRight, title, offset, limit));
    },
    deleteDocument: documentID => dispatch(deleteDocument(documentID))
  };
};

// Use connect to put them together
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Documents));

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Parser from 'html-react-parser';
import toaster from 'toastr';
import getDocument from '../actions/getDocument';


/**
 * display document
 * @class Document
 * @extends {React.Component}
 */
export class Document extends React.Component {

  /**
   * Creates an instance of Document.
   * @param {any} props -
   * @memberof Document
   */
  constructor(props) {
    super(props);
    this.state = {
      document: {},
      message: '',
      isloading: false
    };
    this.downloadDoc = this.downloadDoc.bind(this);
  }


  /**
   * @returns {null} -
   * @memberof Document
   */
  componentWillMount() {
    const documentID = this.props.match.params.documentId;
    if (documentID) {
      this.props.getDocument(documentID);
      this.setState({
        isloading: true,
      });
    }
  }

  /**
   * - runs when component recieve new props
   * @param {any} nextProps
   * @memberof CreateDocument
   * @returns {null} - null
   */
  componentWillReceiveProps(nextProps) {
    if (nextProps.messageFrom === 'getDocument') {
      toaster.info(nextProps.message);
      this.setState({
        message: nextProps.message,
        isloading: false
      });
    }
    if (nextProps.document !== {}) {
      this.setState({
        document: nextProps.document,
        isloading: false
      });
    }
  }

  /**
   * signin user
   * @param {*} event
   * @returns {null} -
   */
  downloadDoc(event) {
    event.preventDefault();
    window.exportDoc(this.state.document.title, this.state.document.body);
  }
  /**
   * @returns  {null} - null
   * @memberof Document
   */
  render() {
    let body = '';
    if (this.state.document.body) {
      body = this.state.document.body.toString();
    }
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
          <p id="message"> {this.state.message} </p>
          {(body === '')
              ?
                <h5 id="docNotFound">
                  No document found, please select a document
                  <a href="#/dashboard"> here! .</a>
                </h5>
              :
                <div>
                  <div className="input-field col s12" id="doc-heading">
                    <h5 id="author" className="username">
                      Author <br />
                      {this.state.document.author}
                    </h5>
                    <h6 id="title" >
                      {this.state.document.title}
                    </h6>
                    <hr />
                  </div>
                  <div
                    id="documentBody"
                    className="document-body input-field col s12"
                  >
                    {Parser(body)}
                  </div>
                  <button
                    className="btn waves-effect waves-light right"
                    type="submit"
                    id="btnDownload"
                    onClick={this.downloadDoc}
                  >
                    Download Document
                  </button>
                  <br />
                </div>
           }
        </div>
      </div>
    );
  }
}

// Maps state from store to props
const mapStateToProps = state => (
  {
    document: state.document.document,
    message: state.message.info,
    messageFrom: state.message.from
  }
);

// Maps actions to props
const mapDispatchToProps = dispatch => (
  {
    getDocument: documentID => dispatch(getDocument(documentID))
  }
);

Document.propTypes = {
  getDocument: PropTypes.func.isRequired,
  document: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    body: PropTypes.string,
    author: PropTypes.string,
    accessRight: PropTypes.string,
    owner: PropTypes.number,
    createdAt: PropTypes.string
  }),
  match: PropTypes.shape({
    params: PropTypes.shape({
      documentId: PropTypes.any
    })
  }),
  message: PropTypes.string,
  messageFrom: PropTypes.string
};

Document.defaultProps = {
  document: {},
  message: '',
  messageFrom: '',
  match: {}
};

// Use connect to put them together
export default connect(mapStateToProps, mapDispatchToProps)(Document);

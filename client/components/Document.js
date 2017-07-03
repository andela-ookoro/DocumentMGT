import React from 'react';
import { connect } from 'react-redux';
import Parser from 'html-react-parser';
import getDocument from '../actions/getDocument';


/**
 * display document
 * @class Document
 * @extends {React.Component}
 */
class Document extends React.Component {

  /**
   * Creates an instance of Document.
   * @param {any} props -
   * @memberof Document
   */
  constructor(props) {
    super(props);
    this.state = {
      document: {},
      message: ''
    };
  }


  /**
   * @returns {null} -
   * @memberof Document
   */
  componentWillMount() {
    const documentID = this.props.match.params.documentId;
    if (documentID) {
      this.props.getDocument(documentID);
    }
  }

  /**
   * - runs when component recieve new props
   * @param {any} nextProps
   * @memberof CreateDocument
   * @returns {null} - null
   */
  componentWillReceiveProps(nextProps) {
    if (nextProps.status === 'success') {
      this.setState({
        document: nextProps.document
      });
    } else {
      this.setState({
        message: nextProps.message
      });
      Materialize.toast(nextProps.message, 3000, 'rounded');
    }
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
          <p> {this.state.message} </p>
          {(body === '')
              ?
                <h5>
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
                  <div className="document-body input-field col s12" >
                    {Parser(body)}
                  </div>
                </div>
           }
        </div>
      </div>
    );
  }
}

// Maps state from store to props
const mapStateToProps = (state) => {
  return {
    document: state.document.document,
    status: state.document.status,
  };
};

// Maps actions to props
const mapDispatchToProps = (dispatch) => {
  return {
    getDocument: documentID => dispatch(getDocument(documentID))
  };
};

// Use connect to put them together
export default connect(mapStateToProps, mapDispatchToProps)(Document);

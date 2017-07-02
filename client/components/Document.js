import React from 'react';
import { connect } from 'react-redux';
import tinymce from 'tinymce';
import { isEmpty } from 'lodash';
import getDocument from '../actions/getDocument';
import Parser from 'html-react-parser';
import { initiateEditor } from '../helper';

class Document extends React.Component{
  constructor(props){
    super(props);
     this.state = {
      document: {},
      message: ''
    };
  }
  componentWillMount() {
    const documentID = this.props.match.params.documentId;
    if (documentID) {
      this.props.getDocument(documentID);
    }
    return ;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.status === 'success') {
      this.setState({
        document: nextProps.document
      });
    } else {
      this.setState({
        message: nextProps.message
      })
      Materialize.toast(nextProps.message, 3000, 'rounded');
    }
  }


  render(){
    let body = '';
    if (this.state.document.body) {
      body = this.state.document.body.toString();
    }  

    return(
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
                <div className="input-field col s12" className="document-body">
                    {Parser(body)}
                </div>
              </div>
           }
          </div>
        </div>
    )
  }
}

// Maps state from store to props
const mapStateToProps = (state) => {
  return {
    document: state.document.document,
    status: state.document.status,
  }
};

// Maps actions to props
const mapDispatchToProps = (dispatch) => {
  return {
    getDocument: documentID => dispatch(getDocument(documentID))
  }
};

// Use connect to put them together
export default connect(mapStateToProps, mapDispatchToProps)(Document);
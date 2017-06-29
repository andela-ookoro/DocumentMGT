import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import tinymce from 'tinymce';
import Parser from 'html-react-parser';
import { upsertDocument } from '../actions/createDocument';
import getDocument from '../actions/getDocument';

class CreateDocument extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      message: '',
      title: '',
      curDocument: {},
      body: '',
      docId: 0
    }
    this.saveDocument = this.saveDocument.bind(this);
    this.onChange = this.onChange.bind(this);
    this.setDocument = this.setDocument.bind(this);
  }

  componentWillMount() {
    const documentID = this.props.match.params.documentId;
    if (documentID) {
      this.setDocument(getDocument(documentID));
    }
  }

  /**
   * set state to documents or error message
   * @param {object} response - promise from the api called
   * @memberof Documents
   */
  setDocument(apiResponse) {
    // get server response and set state
    apiResponse
    .then(response => {
      if (response.message) {
        this.setState({
          message: response.message
        })
        Materialize.toast(response.message, 3000, 'rounded');
      } else {
        const curDocument = response.document.data.data;
        this.setState({
          title: curDocument.title,
          body: curDocument.body.toString(),
          curDocument,
          docId: curDocument.id
        });

        // find the selected access right
        const accessRights = document.getElementsByName("accessRight");
        const accessRight = curDocument.accessRight;

        for(var i = 0; i < accessRights.length; i++) {
          if(accessRights[i].id === accessRight) {
            accessRights[i].checked = true;
          }
        }
      }
    })
    .catch(err => {
      console.log('err', err)
    })
  }

  /**
   * create a document object and send a request to create the document
   * @param {*} e the submit button
   */
  saveDocument(e) {
    e.preventDefault();
    // get the  text editor content
    const body =tinyMCE.get('content').getContent();
    // find the selected acess right
    const accessRights = document.getElementsByName("accessRight");
    let accessRight;

    for(let i = 0; i < accessRights.length; i++) {
      console.log(accessRights[i].id, accessRights[i].checked);
      if(accessRights[i].checked) {
        accessRight = accessRights[i].id;
        break;
      }
    }

    // create error message
    let message;
    if (body === '') {
      message = "Please insert the content of the document";
    }  
    if (!accessRight) {
      message += `${(message) ? ' and ' : 'Please'} 
        select an access mode`; 
    }
    if(message) {
      this.setState({
        message
      });
    } else {
      /**
       * build api request data
       * create user info from localStorage
       */
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const document = {
        title: this.state.title,
        body,
        owner: userInfo.id,
        accessRight: accessRight,
        role: userInfo.role
      };
      console.log(document);
      //call upsertDocument action 
     upsertDocument(document, this.state.docId)
     .then(response => {
       if(response.status === 'success') {
        message = 'Document has been saved successfully';
        // reset  state
        this.setState({
          message,
          title: '',
          curDocument: {},
          body: ''
        });
        tinymce.get('content').setContent('');
      } else{
        message = response.message;
        this.setState({
          message
        });
      }
     })
     .catch(err => {
       console.log('err', err);
     });
    }
    if (message) {
      Materialize.toast(message, 3000, 'rounded')
    }
  }

  /**
   * set the value of the control to the respective state node
   * @param {*} e 
   */
  onChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

 

  render(){
    const body = this.state.body;
     $(document).ready(() => {
      tinymce.init({
        selector: '#content',
        height : 300,
        width: '100%',
        browser_spellcheck: true,
      });
      tinymce.get('content').on('init', (e) => {
        e.target.setContent(body);
      });
    });
    return(
    <div className="container">
        <div className="body row">
          <p id="message"> {this.state.message} </p>
          <form className="col s12" name="createDoc">
            <br />
            <div className="input-field col s12">
              <input
                placeholder="Title" id="title" type="text" name="title"
                className="validate" value={this.state.title}
                onChange={this.onChange} autoFocus required/>
              <label htmlFor="title">Title</label>
            </div>
            <div className="input-field col s12">
                <textarea
                placeholder="Body" id="content" type="text" name="body"
                className="materialize-textarea"
              >
              </textarea>
            </div>
            <div className="input-field col l2 s12 m12">
              Access Mode &nbsp;
              <i className="material-icons prefix">lock</i>
            </div>
            <div className="input-field col l2 s4">
              <input name="accessRight" type="radio" id="private" />
                <label htmlFor="private">Private</label>
            </div>
            <div className="input-field col l2 s4">
              <input name="accessRight" type="radio" id="public" />
                <label htmlFor="public">Public</label>
            </div>
            <div className="input-field col l2 s4">
              <input name="accessRight" type="radio" id="role" />
                <label htmlFor="role">Role</label>
            </div>
            <div className="input-field col s12" >
              <button
                className="btn waves-effect waves-light right" type="submit"
                name="action" onClick={this.saveDocument}>
                  {(body === '') ? 'Submit' : 'Update' } 
                  <i className="material-icons right">send</i>
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }
}

// Maps state from store to props
const mapStateToProps = (state, ownProps) => {
  return {
    // createDocStatus: state.createDocStatus
  }
};

// Maps actions to props
// const mapDispatchToProps = (dispatch) => {
//   return {
//   createDocument: document => createDocument(document)
//   }
// };

// Use connect to put them together
export default withRouter(connect(mapStateToProps, null)(CreateDocument));
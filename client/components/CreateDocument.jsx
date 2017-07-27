import React from 'react';
import PropTypes from 'prop-types';
const io = require('socket.io-client');
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import toaster from 'toastr';
import upsertDocument from '../actions/createDocument';
import getDocument from '../actions/getDocument';

// create 
// const socket = io();
/**
 * react component that displays a document
 * @class CreateDocument
 * @extends {React.Component}
 */
export class CreateDocument extends React.Component {

  /**
   * Creates an instance of CreateDocument.
   * @param {any} props
   * @memberof CreateDocument
   */
  constructor(props) {
    super(props);
    this.state = {
      message: '',
      title: '',
      curDocument: {},
      body: '',
      docId: 0,
      editor: null,
      isloading: false
    };
    this.saveDocument = this.saveDocument.bind(this);
    this.onChange = this.onChange.bind(this);
    this.broadcastUpdate = this.broadcastUpdate.bind(this);
    this.updateCodeFromSockets = this.updateCodeFromSockets.bind(this);
    // attach socket event
    // socket.on('receive code', (payload) => {   
    //   this.updateCodeFromSockets(payload);
    // });
  }


  /**
   * @returns {null} - null
   * @memberof CreateDocument
   */
  componentWillMount() {
    const documentID = this.props.match.params.documentId;
    if (documentID) {
      this.props.getDocument(documentID);
      // show progress bar
      this.setState({
        isloading: true,
      });
      // join room 
      //socket.emit('room', {room: documentID});
    }
  }

   /**
   * @returns {null} - null
   * @memberof CreateDocument
   */
  componentDidMount() {
    tinymce.init({
      selector: '#content',
      plugins: 'autolink link image lists' +
                ' print preview textcolor table emoticons codesample',
      toolbar: 'undo redo | bold italic | ' +
      'fontsizeselect fontselect | ' +
      'alignleft aligncenter alignright | forecolor backcolor' +
      '| table | numlist bullist | emoticons | codesample | code',
      table_toolbar: 'tableprops tabledelete ' +
      '| tableinsertrowbefore ' +
      'tableinsertrowafter tabledeleterow | tableinsertcolbefore ' +
      'tableinsertcolafter tabledeletecol',
      fontsize_formats: '8pt 10pt 12pt 14pt 18pt 24pt 36pt',
      height: 300,
      width: '100%',
      browser_spellcheck: true,
      setup: (editor) => {
        this.setState({
          isloading: false,
          editor
        });
        setTimeout(() => {
          editor.setContent(this.state.body);
           // for socket event
           editor.on('change', function(e) {
             const docBody = editor.getContent();
             this.broadcastUpdate(docBody);
            console.log('the event object ', e);
            console.log('the editor object ', editor);
            console.log('the content ', editor.getContent());
          });
        }, 1000);
      }
    });
  }

  /**
   * - runs when component recieve new props
   * @param {any} nextProps
   * @memberof CreateDocument
   * @returns {null} - null
   */
  componentWillReceiveProps(nextProps) {
    // show the document for update
    if (nextProps.document.body) {
      const curDocument = nextProps.document;
      this.setState({
        title: curDocument.title,
        body: curDocument.body.toString(),
        curDocument,
        docId: curDocument.id,
        isloading: false
      });
      // find the selected access right
      const accessRights = document.getElementsByName('accessRight');
      const accessRight = curDocument.accessRight;

      for (let i = 0; i < accessRights.length; i += 1) {
        if (accessRights[i].id === accessRight) {
          accessRights[i].checked = true;
        }
      }
      // join room with document id
      //socket.emit('room', {room: curDocument.id});
    }

    if (nextProps.messageFrom === 'upsertDocument') {
      let message = nextProps.message.toString();
      let title = this.state.title;
      // reset editor when action is successful
      if (message.includes('success')) {
        title = ''
        tinymce.get('content').setContent('');
      }
      toaster.info(message);
      this.setState({
        message,
        isloading: false,
        title
      });
    }
  }

  /**
   * @memberof CreateDocument
   * @returns {null} - null
   */
  componentWillUnmount() {
    tinymce.remove(this.state.editor);
    // remove user from existing socket room
    // socket.emit('leave room', {
    //   room: this.state.docId
    // })
  }


  /**
   * respond to socket broadcast 
   * @param {any} payload 
   * @memberof CreateDocument
   */
  updateCodeFromSockets(payload) {
    console.log('this is new oh', payload);
   // this.setState({code: payload.newCode})
  }

  /**
   * send update to other users viewing this page
   * @param {any} docBody 
   * @memberof CreateDocument
   */
  broadcastUpdate(docBody) {
    // socket.emit('coding event', {
    //   room: this.state.docId,
    //   newDocBody: docBody
    // });
  }
  /**
   * set the value of the control to the respective state node
   * @param {*} e
   * @returns {null} - null
   */
  onChange(e) {
    // for role
    let value = e.target.value;
    if ( e.target.name === 'accessRight') {
      value = e.target.id;
    }
    this.setState({
      [e.target.name]: value
    });
  }


  /**
   * create a document object and send a request to create the document
   * @param {*} e the submit button
   * @returns {null} - null
   */
  saveDocument(e) {
    e.preventDefault();
    const title = this.state.title;
    // get the  text editor content
    const body = tinyMCE.get('content').getContent();
    // find the selected acess right
    const accessRight = this.state.accessRight;

    // create error message
    let message;
    // check minimal number of character for title
    if (!/^.{3,}$/.test(title)) {
      message = 'Please write the title ';
    }
    if (body.length < 10) {
      message = `${(message) ? `${message} and` : 'Please'} write the body `;
    }
    if (!accessRight) {
      message = `${(message) ? `${message} and` : 'Please'} select an access mode`;
    }

    if (message) {
      message = `${message} of the document.`;
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
        title,
        body,
        accessRight,
        role: userInfo.role,
        owner: userInfo.id
      };
      // call upsertDocument action
      this.props.upsertDocument(document, this.state.docId);
    }
  }

  /**
   * @returns {object} - html DOM
   * @memberof CreateDocument
   */
  render() {
    return (
      <div className="container">
        <div className="body row">
          <p id="message"> {this.state.message} </p>
          {(this.state.isloading)
            ?
              <div className="progress">
                <div className="indeterminate" />
              </div>
            :
            ''
          }
          <form className="col s12" name="createDoc">
            <br />
            <div className="input-field col s12">
              <input
                placeholder="Title"
                id="title"
                type="text"
                name="title"
                className="validate"
                onChange={this.onChange}
                value={this.state.title}
                ref={(input) => { this.title = input; }}
                required
              />
              <label htmlFor="title">Title</label>
            </div>
            <div className="input-field col s12">
              <textarea
                placeholder="Body"
                id="content"
                type="text"
                name="body"
                onChange={this.onChange}
                className="materialize-textarea"
              />
            </div>
            <div className="input-field col l2 s12 m12">
              Access Mode &nbsp;
              <i className="material-icons prefix">lock</i>
            </div>
            <div className="input-field col l2 s4">
              <input
                name="accessRight"
                type="radio"
                id="private"
                onChange={this.onChange}
              />
              <label htmlFor="private">Private</label>
            </div>
            <div className="input-field col l2 s4">
              <input
                name="accessRight"
                type="radio"
                id="public"
                onChange={this.onChange}
              />
              <label htmlFor="public" id="publicLabel">Public</label>
            </div>
            <div className="input-field col l2 s4">
              <input
                name="accessRight"
                type="radio"
                id="role"
                onChange={this.onChange}
              />
              <label htmlFor="role">Role</label>
            </div>
            <div className="input-field col s12" >
              <button
                className="btn waves-effect waves-light right"
                type="submit"
                name="action"
                id="btnsubmit"
                onClick={this.saveDocument}
              >
                {(this.state.body === '') ? 'Submit' : 'Update' }
                <i className="material-icons right" id="submitLabel">send</i>
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

// Maps state from store to props
const mapStateToProps = state => (
  {
    message: state.message.info,
    messageFrom: state.message.from,
    document: state.document.document
  }
);

// Maps actions to props
const mapDispatchToProps = dispatch => (
  {
    upsertDocument: (document, docId) =>
     dispatch(upsertDocument(document, docId)),
    getDocument: (documentID) => dispatch(getDocument(documentID))
  }
);

CreateDocument.propTypes = {
  upsertDocument: PropTypes.func.isRequired,
  getDocument: PropTypes.func.isRequired,
  messageFrom: PropTypes.string,
  message: PropTypes.string,
  match: PropTypes.shape({
    params: PropTypes.shape({
      documentId: PropTypes.any
    })
  }),
  document: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    body: PropTypes.string,
    author: PropTypes.string,
    accessRight: PropTypes.string,
    owner: PropTypes.number,
    createdAt: PropTypes.string
  }),
};

CreateDocument.defaultProps = {
  message: '',
  messageFrom: '',
  document: {},
  match: {}
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(
  CreateDocument));

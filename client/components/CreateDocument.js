import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import tinymce from 'tinymce';
import { upsertDocument } from '../actions/createDocument';
import getDocument from '../actions/getDocument';


/**
 * react component that displays a document
 * @class CreateDocument
 * @extends {React.Component}
 */
class CreateDocument extends React.Component {

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
      docId: 0
    };
    this.saveDocument = this.saveDocument.bind(this);
    this.onChange = this.onChange.bind(this);
    this.setDocument = this.setDocument.bind(this);
  }


  /**
   * @returns {null} - null
   * @memberof CreateDocument
   */
  componentWillMount() {
    const documentID = this.props.match.params.documentId;
    if (documentID) {
      this.setDocument(getDocument(documentID));
    }
  }


  /**
   * - runs when component recieve new props
   * @param {any} nextProps
   * @memberof CreateDocument
   * @returns {null} - null
   */
  componentWillReceiveProps(nextProps) {
    console.log(nextProps);
    if (nextProps.createDocStatus) {
      let message;
      if (nextProps.createDocStatus === 'success') {
        message = 'Document has been saved successfully';
      } else {
        message = nextProps.errorMessage
      }
      this.setState({
        message
      });
      Materialize.toast(message, 3000, 'rounded');
    }
  }

  /**
   * set state to documents or error message
   * @param {object} apiResponse - promise from the api called
   * @memberof Documents
   * @returns {null} - null
   */
  setDocument(apiResponse) {
    // get server response and set state
    apiResponse
    .then(response => {
      if (response.message) {
        this.setState({
          message: response.message
        });
        Materialize.toast(response.message, 3000, 'rounded');
      } else {
        const curDocument = response.document.data.data;
        this.setState({
          title: curDocument.title,
          body: curDocument.body.toString(),
          curDocument,
          docId: curDocument.id
        });

        // set the title
        this.title.value = this.state.title;
        // find the selected access right
        const accessRights = document.getElementsByName('accessRight');
        const accessRight = curDocument.accessRight;

        for (let i = 0; i < accessRights.length; i += 1) {
          if (accessRights[i].id === accessRight) {
            accessRights[i].checked = true;
          }
        }
      }
    });
  }

  /**
   * set the value of the control to the respective state node
   * @param {*} e
   * @returns {null} - null
   */
  onChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  /**
   * create a document object and send a request to create the document
   * @param {*} e the submit button
   * @returns {null} - null
   */
  saveDocument(e) {
    e.preventDefault();
    // get the  text editor content
    const body = tinyMCE.get('content').getContent();
    // find the selected acess right
    const accessRights = document.getElementsByName('accessRight');
    let accessRight;

    for (let i = 0; i < accessRights.length; i += 1) {
      if (accessRights[i].checked) {
        accessRight = accessRights[i].id;
        break;
      }
    }

    // create error message
    let message;
    if (body === '') {
      message = 'Please insert the content of the document';
    }
    if (!accessRight) {
      message += `${(message) ? ' and ' : 'Please'} select an access mode`;
    }
    if (message) {
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
        title: this.title.value,
        body,
        owner: userInfo.id,
        accessRight,
        role: userInfo.role
      };
      // call upsertDocument action
     this.props.upsertDocument(document, this.state.docId);
    //   .then(response => {
    //     message = 'Document has been saved successfully';
    //     // reset  state
    //     this.setState({
    //       message,
    //       title: '',
    //       curDocument: {},
    //       body: ''
    //     });
    //     if (message) {
    //       Materialize.toast(message, 3000, 'rounded')
    //     }
    //   },
    //   (error) => {
    //     message = error.data.message;
    //     this.setState({
    //       message
    //     });
    //     if (message) {
    //       Materialize.toast(message, 3000, 'rounded')
    //     }
    //  })
    }
  }


  /**
   * @returns {object} - html DOM
   * @memberof CreateDocument
   */
  render() {
    const body = this.state.body;
    let message;
    $(document).ready(() => {
      tinymce.init({
        selector: '#content',
        height: 300,
        width: '100%',
        browser_spellcheck: true,
      });
      tinymce.get('content').on('init', (e) => {
        e.target.setContent(body);
      });
    });
    if (this.props.createDocStatus === 'successs') {
      message = 'Document has been saved successfully';
      tinymce.get('content').setContent('');
    }

    return (
      <div className="container">
        <div className="body row">
          <p id="message"> {this.state.message} </p>
          <form className="col s12" name="createDoc">
            <br />
            <div className="input-field col s12">
              <input
                placeholder="Title"
                id="title"
                type="text"
                name="title"
                className="validate"
                ref={(input) => { this.title = input; }}
                autoFocus
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
                className="materialize-textarea"
              />
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
                className="btn waves-effect waves-light right"
                type="submit"
                name="action"
                onClick={this.saveDocument}
              >
                {(body === '') ? 'Submit' : 'Update' }
                <i className="material-icons right">send</i>
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

// Maps state from store to props
const mapStateToProps = (state) => {
  return {
    createDocStatus: state.createDocStatus.status,
    errorMessage: state.createDocStatus.message
  };
};

// Maps actions to props
const mapDispatchToProps = (dispatch) => {
  return {
    upsertDocument: (document, docId) =>
     dispatch(upsertDocument(document, docId))
  };
};

// Use connect to put them together
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(CreateDocument));
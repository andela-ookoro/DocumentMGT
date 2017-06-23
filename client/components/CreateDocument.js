import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import tinymce from 'tinymce';
import { createDocument } from '../actions/createDocument';

class CreateDocument extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      message: '',
      title: '',
    }
    this.saveDocument = this.saveDocument.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  componentWillMount() {
     tinymce.init({
      selector: '#body',
      height : 300
    });
  }
  

  saveDocument(e) {
    e.preventDefault();
    // get content of the text editor
    const body =tinyMCE.get('body').getContent();
    // find the selected acess right
    const accessRights = document.getElementsByName("accessMode");
    let accessRight;

    for(var i = 0; i < accessRights.length; i++) {
      if(accessRights[i].checked)
          accessRight = accessRights[i].id;
    }

    // create error message
    let message;
    if (body === '') {
      message = "Please insert the content of the document";
    }  
    if (!accessRight) {
      console.log('came here ')
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
      // call createDocument action 
     createDocument(document)
     .then(response => {
       console.log('repsonse', response);
       if(response.status === 'success') {
        message = 'Document has been saved successfully';
      } else{
        message = response.message;
      }
      this.setState({
        message
      });
     })
     .catch(err => {
       console.log('err', err);
     });
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
    return(
        <div className="container">

      <script>
      </script>
        <div className="body row">
          <p> {this.state.message} </p>
          <form className="col s12" name="createDoc">
            <br />
            <div className="row">
              <div className="input-field col s12">
                <i className="material-icons prefix">subject</i>
                <input
                  placeholder="Title" id="title" type="text" name="title"
                  className="validate" value={this.state.title}
                  onChange={this.onChange} required/>
                <label htmlFor="title">Title</label>
              </div>
            </div>
            <div className="row">
              <div className="input-field col s12">
                <i className="material-icons prefix">view_headline</i>
                 <textarea
                  placeholder="Body" id="body" type="text" name="body"
                  className="materialize-textarea"
                >
                </textarea>
                <label htmlFor="body">Body</label>
              </div>
            </div>
            <div className="row">
              <div className="input-field col l2 s12 m12">
                Access Mode &nbsp;
                <i className="material-icons prefix">lock</i>
              </div>
              <div className="input-field col l2 s4">
                <input name="accessMode" type="radio" id="private" />
                 <label htmlFor="private">Private</label>
              </div>
              <div className="input-field col l2 s4">
                <input name="accessMode" type="radio" id="public" />
                 <label htmlFor="public">Public</label>
              </div>
              <div className="input-field col l2 s4">
                <input name="accessMode" type="radio" id="role" />
                 <label htmlFor="role">Role</label>
              </div>
            </div>
            <div className="row">
              <div className="input-field col s12" >
                 <button
                  className="btn waves-effect waves-light right" type="submit"
                  name="action" onClick={this.saveDocument}>
                   Submit <i className="material-icons right">send</i>
              </button>
              </div>
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
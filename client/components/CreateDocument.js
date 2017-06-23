import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'

class CreateDocument extends React.Component{
  constructor(props){
    super(props);
  }

  // submitBook(input){
  //   this.props.createBook(input);
  // }

  render(){
    return(
        <div className="container">
        <div className="body row">
          <form className="col s12">
            <br />
            <div className="row">
              <div className="input-field col s12">
                <i className="material-icons prefix">subject</i>
                <input placeholder="Title" id="title" type="text" className="validate" />
                <label htmlFor="title">Title</label>
              </div>
            </div>
            <div className="row">
              <div className="input-field col s12">
                <i className="material-icons prefix">toc</i>
                <textarea placeholder="Synopsis" id="synopsis" type="text" className="materialize-textarea"></textarea>
                <label htmlFor="synopsis">Synopsis</label>
              </div>
            </div>
            <div className="row">
              <div className="input-field col s12">
                <i className="material-icons prefix">view_headline</i>
                 <textarea placeholder="Body" id="body" type="text" className="materialize-textarea"></textarea>
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
                 <button className="btn waves-effect waves-light right" type="submit" name="action">
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
    // You can now say this.props.books
    // books: state.pens
  }
};

// Maps actions to props
const mapDispatchToProps = (dispatch) => {
  return {
  // You can now say this.props.createBook
  // createBook: book => dispatch(bookActions.createBook(book))
  }
};

// Use connect to put them together
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CreateDocument));
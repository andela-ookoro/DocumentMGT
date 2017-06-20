import React from 'react';
import { connect } from 'react-redux';
// import * as bookActions from '../actions/bookActions';

class Document extends React.Component{
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
          <div className="col s12">
             <div className="card blue-grey darken-1">
              <div className="card-content white-text">
                <span className="card-title">Card Title</span>
                <p id="document-body">
                  Dear Sir,
In furtherance to our commitment to deliver an outstanding product, we wish to send a report of the project requirements and our progress on meeting your demand. The website is now online and can be accessed by visiting https://gimli-staging-cfh.herokuapp.com, the project code base can be accessed by visiting https://github.com/andela/gimli-cfh (staging branch is the development branch). Every credential used in this project would be delivered on demand.
After our first meeting  on the 11th of May, 2017; we had the following requirements :
Project should display a congratulatory message after if user wins the game.
Project should provide a tour of how game the game is played.
Project should provide a chat window so that users can chat during game sessions, chat should support usage of emojis and unicode characters.
Project should provide an option for an anonymous player to play the game and also donate.
Project should provide a follow up on donations, that is; display notifications.
Project user interface should possess blue and mild orange colours  for landing page and gaming pages.
Project should display name of user signed into the app.
Project should produce sound and animations during game sessions.
Users should receive a JWT on successful signup/signin.
Re-Design UI for user authentication screen.
Re-Design UI for the actual gaming screen.
Users should see a landing page with effective UI/UX.
Users should be able to send invites to at most 11 people other than themselves.
CZARs should be able to draw cards by clicking.
Users should be able to create/start a new game.
Registered users should be able to view a a "game log" of past games.
Registered users should be able to invite other users to connect as "friends".
Cards should be categorised by region.
After our first Demo on the 7th of June, 2017, we were able to deliver the following requirements :
Users should receive a JWT on successful signup/signin.
Re-Design UI for user authentication screen.
Re-Design UI for the actual gaming screen.
Users should see a landing page with effective UI/UX.
Users should be able to send invites to at most 11 people other than themselves 
After our last Demo on the 15th of June, 2017; we were able to deliver the following requirements :
Create Graphic for Question Cards.
CZARs should be able to draw cards by clicking.
Users should be quickly and effectively onboarded onto the app.
Display error message if a 13th user tries to join a game .
Fix UI responsiveness on small screens.
Users should be able to create/start a new game.
Users should be able to use emojis in the chat window.
Fix UI responsiveness for gaming screen .
Display username on navigation bar for logged in users.
Registered users should be able to take on boarding tour at any point in time.
Presently, we have delivered the following requirements, which can be accessed on the project website https://gimli-staging-cfh.herokuapp.com for acceptance.
Users should be able to chat with the group while they are in a game (see Appendix: Figure 1).
Registered users should be able to view a "game log" of past games (see Appendix: Figure 2).
Cards should be categorised by region (see Appendix: Figure 3).
Registered users should be able to invite other users to connect as "friends" (see Appendix: Figure 4).
Unfortunately, we could not deliver the underlisted requirement:
Project should produce sound and animations during game sessions.
Working on this project has been an awesome experience, we wish to work with you in the nearest future. 
 
Best regards,
Team Gimli
16th of June , 2017.

                </p>
              </div>
              <div className="card-action">
                <a href="#">This is a link</a>
                <a href="#">This is a link</a>
              </div>
            </div>
          </div>
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
export default connect(mapStateToProps, mapDispatchToProps)(Document);
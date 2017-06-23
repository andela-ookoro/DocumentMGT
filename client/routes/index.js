import React from 'react';
import { HashRouter, Switch, Route } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { Provider } from 'react-redux';
import App from '../components/Layout';
import Login from '../components/Login';
import Signup from '../components/Signup';
import Documents from '../components/Documents';
import Document from '../components/Document';
import CreateDocument from '../components/CreateDocument'
import configureStore from '../store/configureStore';

const requireAuth = () => {
  console.log('came here');
  if (localStorage.getItem('jwt')) {
    console.log(' window.location = /#/signup');
    window.location = '/#/signup'
  }
};

// function requireAuth(nextState, replace) {  
//   if (!localStorage.jwt) {
//     replace({
//       pathname: '/#/signup',
//       state: { nextPathname: nextState.location.pathname }
//     })
//   }
// }

const store = configureStore();
const history = createBrowserHistory();

const routes = () => (
  <Provider store={store}>
   <HashRouter history={history}>
     <Switch>
      <Route exact path='/' component={Signup}/>
      <App  onEnter={requireAuth}>
        <Route path='/dashboard' component={Documents} />
        <Route path='/document' component={Document} />
        <Route path='/createDocument' component={CreateDocument} />
      </App>
     </Switch>
   </HashRouter >
</Provider>
); 

export default routes;


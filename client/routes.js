import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { Provider } from 'react-redux';
import App from './components/Layout';
import Login from './components/Login';
import Signup from './components/Signup';
import Documents from './components/Documents';
import Document from './components/Document';
import CreateDocument from './components/CreateDocument'
import configureStore from './store/configureStore';


const store = configureStore();
const history = createBrowserHistory();

const routes = () => (
  <Provider store={store}>
   <BrowserRouter >
     <Switch>
      <Route exact path='/' component={App}/>
      <App>
        <Route path='/login' component={Login}/>
        <Route path='/signup' component={Signup} />
        <Route path='/documents' component={Documents} />
        <Route path='/document' component={Document} />
        <Route path='/createDocument' component={CreateDocument} />
      </App>
     </Switch>
   </BrowserRouter >
</Provider>
); 

export default routes;


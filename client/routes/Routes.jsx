import React from 'react';
import { HashRouter, Switch, Route } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { Provider } from 'react-redux';
import App from '../components/Layout';
import Auth from '../components/Auth';
import Documents from '../components/Documents';
import Document from '../components/Document';
import PageNotFound from '../components/PageNotFound';
import CreateDocument from '../components/CreateDocument';
import Profile from '../components/Profile';
import manageUsers from '../components/ManageUsers';
import configureStore from '../store/configureStore';
import { requireAuth, isAdmin } from '../helper';

const store = configureStore();
const history = createBrowserHistory();

const Routes = () => (
  <Provider store={store}>
    <HashRouter history={history}>
      <Switch>
        <Route exact path="/" component={Auth} />
        <Route exact path="/notfound" component={PageNotFound} />
        <App onEnter={requireAuth}>
          <Route exact path="/dashboard" component={Documents} />
          <Route path="/document/:documentId" component={Document} />
          <Route exact path="/document" component={Document} />
          <Route
            path="/createDocument/:documentId"
            component={CreateDocument}
          />
          <Route exact path="/createDocument" component={CreateDocument} />
          <Route exact path="/profile" component={Profile} />
          <Route
            path="/manageUsers"
            render={() => (
              isAdmin() ? (<Route component={manageUsers} />)
              : (<Route component={PageNotFound} />)
            )}
          />
        </App>
        <Route component={PageNotFound} />
      </Switch>
    </HashRouter>
  </Provider>
);

export default Routes;


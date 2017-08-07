import React from 'react';
import { HashRouter, Switch, Route } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { Provider } from 'react-redux';
import App from '../components/Layout';
import Auth from '../components/auth';
import Documents from '../components/Documents';
import Document from '../components/Document';
import pageNotFound from '../components/pageNotFound';
import CreateDocument from '../components/CreateDocument';
import Profile from '../components/Profile';
import manageUsers from '../components/ManageUsers';
import configureStore from '../store/configureStore';
import { requireAuth, isAdmin } from '../helper';

const store = configureStore();
const history = createBrowserHistory();

const routes = () => (
  <Provider store={store}>
    <HashRouter history={history}>
      <Switch>
        <Route exact path="/" component={Auth} />
        <Route exact path="/notfound" component={pageNotFound} />
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
              isAdmin() ? ( <Route  component={manageUsers} />)
              : (<Route component={pageNotFound} />)
            )}
            />
        </App>
        <Route component={pageNotFound} />
      </Switch>
    </HashRouter>
  </Provider>
);

export default routes;


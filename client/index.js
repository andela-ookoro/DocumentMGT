import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import routes from  './routes/index';

ReactDOM.render(routes(), document.getElementById('app'));
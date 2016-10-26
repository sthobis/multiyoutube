import React from 'react';
import { Router, Route } from 'react-router';
import Home from './components/Home'
import App from './components/App';

const Routes = (props) => (
  <Router {...props}>
    <Route path="/multiyoutube" component={Home} />
    <Route path="/multiyoutube/*" component={App} />
  </Router>
);

export default Routes;
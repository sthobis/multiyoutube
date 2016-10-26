import React from 'react';
import { Router, Route } from 'react-router';
import Home from './components/Home'
import App from './components/App';

const Routes = (props) => (
  <Router {...props}>
    <Route path="/" component={Home} />
    <Route path="*" component={App} />
  </Router>
);

export default Routes;
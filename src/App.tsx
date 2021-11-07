import React from 'react';
import logo from './logo.svg';
import './App.css';
import Example from './Example';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  useHistory,
} from 'react-router-dom';

function App() {
  return (
    <Router>
      <Switch>
        <Route path='/' exact component={Example} />
      
      </Switch>
    </Router>
  );
}

export default App;

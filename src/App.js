import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';
import './App.css';

import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { cyan, red } from '@material-ui/core/colors';
import { Container } from '@material-ui/core';
import NavBar from './components/NavBar';
import Login from './components/Login';

import UserContext from './context/UserContext';
import KeywordsProvider from './context/KeywordsContext';
import KeywordTimelineAnalysis from './components/Keywords/KeywordTimelineAnalysis';

const theme = createMuiTheme({
  palette: {
    primary: cyan,
    secondary: red,
  },
});

function App() {
  ///// User Context /////
  const [user, setUser] = useState(sessionStorage.getItem('user') || null);

  ///// MainFunction /////
  return (
    <Router>
      <UserContext.Provider value={{ user, setUser }}>
        <KeywordsProvider>
          <ThemeProvider theme={theme}>
            <NavBar />
            <Container className='App' maxWidth='xl'>
              {user === null ? <Redirect to='/app' /> : ''}
              <Switch>
                <Route path='/app/keyword-timeline-analysis'>
                  <KeywordTimelineAnalysis />
                </Route>
                <Route exact path='/app'>
                  <Login />
                </Route>
                <Route path='/*'>
                  <Redirect to='/app' />
                </Route>
              </Switch>
            </Container>
          </ThemeProvider>
        </KeywordsProvider>
      </UserContext.Provider>
      <footer>
        <a href='https://mediaonemarketing.com.sg/'>Mediaone Business Group</a>
      </footer>
    </Router>
  );
}

export default App;

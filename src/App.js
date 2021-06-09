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

/**
 * import React, { useState } from "react";
import {
    BrowserRouter as Router,
    Route,
    Switch,
    Redirect,
} from "react-router-dom";
import "./App.css";
import UserInput from "./components/Keywords/UserInput";
import MainFunction from "./components/Keywords/MainFunction"; // MainFunction page after submitting the form.

import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { cyan, red } from "@material-ui/core/colors";
import { Container } from "@material-ui/core";
import NavBar from "./components/NavBar";
import Login from "./components/Login";

import UserContext from "./context/UserContext";

const theme = createMuiTheme({
    palette: {
        primary: cyan,
        secondary: red,
    },
});

function App() {
    ///// User Context /////
    const [user, setUser] = useState(sessionStorage.getItem("user") || null);

    ///// User Input /////
    const [submitted, setSubmitted] = useState(false); // Keeps track on whether the form is submitted. On submit, render the results page.
    const [URL, setURL] = useState(""); // URL to check.
    const [chosenLocation, setChosenLocation] = useState({
        mangools: 2702,
        sem: "sg",
    }); // Data to pass to children as props based on selected country. Default Singapore's location data.
    const [formattedKeywords, setFormattedKeywords] = useState([]); // Formats the keywords and stores into an array.

    ///// MainFunction /////
    return (
        <Router>
            <UserContext.Provider value={{ user, setUser }}>
                <ThemeProvider theme={theme}>
                    <NavBar />
                    <Container className='App' maxWidth='xl'>
                        {user === null ? <Redirect to='/app' /> : ""}
                        <Switch>
                            <Route path='/app/keyword-timeline-analysis'>
                                {submitted ? ( // Renders results after submission.
                                    <MainFunction
                                        url={URL}
                                        keywords={formattedKeywords}
                                        location={chosenLocation}
                                        setFormattedKeywords={
                                            setFormattedKeywords
                                        }
                                    />
                                ) : (
                                    <UserInput
                                        setSubmitted={setSubmitted}
                                        setChosenLocation={setChosenLocation}
                                        setFormattedKeywords={
                                            setFormattedKeywords
                                        }
                                        URL={URL}
                                        setURL={setURL}
                                    />
                                )}
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
            </UserContext.Provider>
            <footer>
                <a href='https://mediaonemarketing.com.sg/'>
                    Mediaone Business Group
                </a>
            </footer>
        </Router>
    );
}

export default App;

 */

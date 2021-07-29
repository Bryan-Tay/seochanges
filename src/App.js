import React from "react";
import theme from "./theme";
import Login from "./routes/login";
import AuthProvider, { useAuth } from "./hooks/useAuth";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { Container, ThemeProvider } from "@material-ui/core";
import NavBar from "./components/NavBar";
import KeywordTimelineAnalysis from "./routes/keyword-timeline-analysis";
import HomePage from "./routes/homepage";
import KeywordsProvider from "./hooks/useKeywords";

import "./App.css";

const MainContainer = () => {
  const { user } = useAuth();

  if (!user) {
    return <Login />;
  }

  return (
    <Router>
      <NavBar />
      <Container maxWidth="xl">
        <Switch>
          <Route exact path="/app">
            <HomePage />
          </Route>
          <Route exact path="/app/keyword-timeline-analysis">
            <KeywordTimelineAnalysis />
          </Route>
          <Route path="/*">
            <Redirect to="/app" />
          </Route>
        </Switch>
      </Container>
    </Router>
  );
};

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <KeywordsProvider>
          <MainContainer />
        </KeywordsProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;

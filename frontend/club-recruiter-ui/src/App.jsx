import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import CandidateApply from './pages/CandidateApply';
import EventRouter from './routers/EventRouter';
import Home from './pages/Home';
import Login from './pages/Login';
import MemberDashboard from './pages/MemberDashboard';
import NoRoute from './pages/errors/NoRoute';

const theme = createTheme({
  palette: {
    primary: {
      main: '#FCDDEC',
      light: '#FEF8F8',
      contrastText: '#EF5DA8',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <div>
        <Router>
          <Switch>
            <Route exact path="/login">
              <Login />
            </Route>
            <Route exact path="/">
              <Home />
            </Route>
            <Route path="/apply">
              <CandidateApply />
            </Route>
            <Route path="/dashboard">
              {/* Will integrate protected routes once Firebase App is created. */}
              { /* <ProtectedRoute component={MemberDashboard} /> */}
              <MemberDashboard />
            </Route>
            <Route path="/event">
              { /* <ProtectedRoute component={EventRouter} /> */}
              <EventRouter />
            </Route>
            <Route path="/createEvent">
              {/* <ProtectedRoute component={EventRouter} /> */}
            </Route>
            <Route path="*">
              <NoRoute />
            </Route>
          </Switch>
        </Router>
      </div>
    </ThemeProvider>
  );
}

export default App;

import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import EventRouter from './routers/EventRouter';
import Home from './pages/Home';
import Login from './pages/Login';
import MemberDashboard from './pages/MemberDashboard';
import NoRoute from './pages/errors/NoRoute';
import CreateEvent from './pages/CreateEvent';
import ProtectedRoute from './components/ProtectedRoute';
import ApplyRouter from './routers/ApplyRouter';

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
              <ApplyRouter />
            </Route>
            <Route path="/dashboard">
              <ProtectedRoute>
                <MemberDashboard />
              </ProtectedRoute>
            </Route>
            <Route path="/event">
              <ProtectedRoute>
                <EventRouter />
              </ProtectedRoute>
            </Route>
            <Route path="/createEvent">
              <ProtectedRoute>
                <CreateEvent />
              </ProtectedRoute>
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

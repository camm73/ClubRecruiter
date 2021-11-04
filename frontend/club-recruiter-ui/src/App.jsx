import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';

// import ProtectedRoute from './components/ProtectedRoute';
import CandidateApply from './pages/CandidateApply';
import EventRouter from './routers/EventRouter';
import Home from './pages/Home';
import Login from './pages/Login';
import MemberDashboard from './pages/MemberDashboard';
import NoRoute from './pages/errors/NoRoute';

function App() {
  return (
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
  );
}

export default App;

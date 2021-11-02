import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import CandidateApply from './pages/CandidateApply';
import EventOverview from './pages/EventOverview';
import Home from './pages/Home';
import MemberDashboard from './pages/MemberDashboard';

function App() {
  return (
    <div>
      <Router>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/apply">
            <CandidateApply />
          </Route>
          <Route path="/dashboard">
            <MemberDashboard />
          </Route>
          <Route path="/event">
            <EventOverview/>
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;

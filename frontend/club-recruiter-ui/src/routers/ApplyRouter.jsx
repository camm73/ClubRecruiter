import React from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import NoRoute from '../pages/errors/NoRoute';

import CandidateApply from '../pages/CandidateApply';

const ApplyRouter = () => {
  const match = useRouteMatch();

  return (
    <>
      <Switch>
        <Route path={`${match.path}/:candidateCode`}>
          {/* Candidate application page for specific event */}
          <CandidateApply />
        </Route>
        <Route path={match.path}>
          {/* TODO: Route to 404 page or error page */}
          <NoRoute />
        </Route>
      </Switch>
    </>
  );
};

export default ApplyRouter;

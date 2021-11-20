import React from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import NoRoute from '../pages/errors/NoRoute';

import EventOverview from '../pages/EventOverview';

const EventRouter = () => {
  const match = useRouteMatch();

  return (
    <>
      <Switch>
        <Route path={`${match.path}/:candidateCode`}>
          {/* Event overview page for a specific event */}
          <EventOverview />
        </Route>
        <Route path={match.path}>
          {/* TODO: Route to 404 page or error page */}
          <NoRoute />
        </Route>
      </Switch>
    </>
  );
};

export default EventRouter;

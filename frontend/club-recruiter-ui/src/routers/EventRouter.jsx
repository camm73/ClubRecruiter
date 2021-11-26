import React from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import NoRoute from '../pages/errors/NoRoute';
import EmailPage from '../pages/EmailPage';

import EventOverview from '../pages/EventOverview';

const EventRouter = () => {
  const match = useRouteMatch();

  return (
    <>
      <Switch>
        <Route path={`${match.path}/:eventID/email`}>
          <EmailPage />
        </Route>
        <Route path={`${match.path}/:eventID`}>
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

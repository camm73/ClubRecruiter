import { useParams } from 'react-router-dom';
import React from 'react';

const EventOverview = () => {
  const { eventCode } = useParams();

  return (
    <div>
      <h1>
        EVENT OVERVIEW PAGE:
        {eventCode}
      </h1>
    </div>
  );
};

export default EventOverview;

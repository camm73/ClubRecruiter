import { useParams } from "react-router-dom";

const EventOverview = () => {
    let { eventCode } = useParams();

    return (
      <div>
          <h1>EVENT OVERVIEW PAGE: {eventCode}</h1>
      </div>
    );
}

export default EventOverview;

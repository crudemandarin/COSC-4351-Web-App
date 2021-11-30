import React from "react";
import Countdown from "react-countdown";
import { Navigate } from "react-router-dom";

const renderer = ({ minutes, seconds, completed }) => {
  if (completed) {
    localStorage.removeItem("pendingReservation");
    return <Navigate to="/" />;
  } else {
    return (
      <span>
        {minutes}:{seconds}
      </span>
    );
  }
};

const PendingTimer = (props) => {
  return (
    <div>
      <Countdown date={Date.now() + props.time - 1000} renderer={renderer} />
    </div>
  );
};

export default PendingTimer;

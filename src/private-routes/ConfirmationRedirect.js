import React from "react";
import { Route, Navigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

const ConfirmationRedirect = ({ children }) => {
  const { currentUser } = React.useContext(AuthContext);

  return localStorage.getItem("pendingReservation") ? (
    children
  ) : (
    <Navigate to="/" />
  );
};

export default ConfirmationRedirect;

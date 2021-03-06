import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing/Landing";
import Confirmation from "./pages/Confirmation/Confirmation";
import Login from "./components/LogIn";
import Signup from "./components/SignUp";
import Profile from "./components/Profile";
import Reservations from "./components/Reservations";
import PrivateRoute from "./private-routes/PrivateRoute";

import "./styles/styles.css";
import ConfirmationRedirect from "./private-routes/ConfirmationRedirect";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route
          path="/confirmation"
          element={
            <ConfirmationRedirect>
              <Confirmation />
            </ConfirmationRedirect>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />

        <Route
          path="/reservations"
          element={
            <PrivateRoute>
              <Reservations />
            </PrivateRoute>
          }
        />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

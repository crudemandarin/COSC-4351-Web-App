import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const PrivateRoute = ({ children }) => {

    const { currentUser } = React.useContext(AuthContext);

    return localStorage.getItem("token") ? (
                    children
                ) : (
                    <Navigate to='/login' />
                )
           
    
}

export default PrivateRoute;
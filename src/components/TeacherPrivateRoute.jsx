import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const TeacherPrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div>Loading...</div>; // Optionally show loading state

  if (!user) {
    return <Navigate to="/teacher/login" />; // Redirect to login if not authenticated
  }

  return children; // Render the protected route if authenticated
};

export default TeacherPrivateRoute;
import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ role, children }) => {
  const { user, token, loading } = useContext(AuthContext);

  if (loading) return <div>Loading...</div>; // Add loading state if needed
  if (!user || !token || user.role !== role) {
    // Redirect to login if not authenticated or role mismatch
    return <Navigate to={`/${role}/login`} />;
  }

  return children;
};

export default ProtectedRoute;

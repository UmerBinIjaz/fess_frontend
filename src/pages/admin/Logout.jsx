import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Logout = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    logout();

    // localStorage.removeItem('token');
    // localStorage.removeItem('userId');
    navigate('/admin/login'); // Redirect to login page
  }, [logout, navigate]);
  

  return <div>Logging out...</div>;
};

export default Logout;

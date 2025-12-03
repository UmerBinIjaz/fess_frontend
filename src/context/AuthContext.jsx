// import React, { createContext, useState, useEffect } from 'react';
// import axios from 'axios';

// // Create the context
// export const AuthContext = createContext();

// // AuthProvider component
// const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null); // Store user details (e.g., name, email)
//   const [token, setToken] = useState(null); // Store JWT token
//   const [loading, setLoading] = useState(true); // Loading state for checking auth status

//   // Logout function
//   const logout = () => {
//     setUser(null);
//     setToken(null);
//     sessionStorage.removeItem('user');
//     sessionStorage.removeItem('token');
//   };

//   // Load user from sessionStorage if it exists
//   useEffect(() => {
//     const storedUser = JSON.parse(sessionStorage.getItem('user'));
//     const storedToken = sessionStorage.getItem('token');

//     if (storedUser && storedToken) {
//       setUser(storedUser);
//       setToken(storedToken);
//     }
//     setLoading(false); // Finished checking auth
//   }, []);

//   // Login function that sets the user based on role
//   const login = async (role, email, password) => {
//     const loginUrl = `https://fess-backend-6787.onrender.com/api/${role}/login`;

//     try {
//       const response = await axios.post(loginUrl, { email, password });
//       const { token, [role]: userData } = response.data;

//       // Update context
//       setUser({ ...userData, role }); // Include role
//       setToken(token);

//       // Save user and token in sessionStorage
//       sessionStorage.setItem('user', JSON.stringify({ ...userData, role }));
//       sessionStorage.setItem('token', token);

//       return true; // Successful login
//     } catch (error) {
//       console.error('Login error', error);
//       return false; // Failed login
//     }
//   };

//   return (
//     <AuthContext.Provider value={{ user, token, login, logout, loading }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export default AuthProvider;




import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create the context
export const AuthContext = createContext();

// AuthProvider component
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Store user details (e.g., name, email)
  const [token, setToken] = useState(null); // Store JWT token
  const [loading, setLoading] = useState(true); // Loading state for checking auth status

  // Logout function
  const logout = () => {
    setUser(null);
    setToken(null);
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('token');
  };

  // Load user from sessionStorage if it exists
  useEffect(() => {
    const storedUser = JSON.parse(sessionStorage.getItem('user'));
    const storedToken = sessionStorage.getItem('token');

    if (storedUser && storedToken) {
      setUser(storedUser);
      setToken(storedToken);
    }
    setLoading(false); // Finished checking auth
  }, []);

  // Login function that sets the user based on role
  const login = async (role, identifier, password) => {
    const loginUrl = `https://fess-backend-6787.onrender.com/api/${role}/login`;

    try {
      // Determine the login payload based on role
      const payload =
        role === 'student'
          ? { reg: identifier, password } // For students, use registration number
          : { email: identifier, password }; // For teachers/admins, use email
  
      const response = await axios.post(loginUrl, payload);
      const { token, [role]: userData } = response.data;
  

      // Update context
      setUser({ ...userData, role }); // Include role
      setToken(token);

      // Save user and token in sessionStorage
      sessionStorage.setItem('user', JSON.stringify({ ...userData, role }));
      sessionStorage.setItem('token', token);

      return true; // Successful login
    } catch (error) {
      console.error('Login error', error);
      return false; // Failed login
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../../context/AuthContext";
import { useDarkMode } from "../../context/DarkModeContext";
import { Moon, Sun, Menu, X } from "lucide-react"; // Icons


const Login = () => {
  const { darkMode, setDarkMode } = useDarkMode();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(null);

  const { login, user } = useContext(AuthContext); // Extract user from AuthContext
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');
  
    const success = await login('teacher', email, password); // Replace with dynamic role if needed
  
    if (success) {
      const role = user?.role; // Use the user object from context
      if (role === 'teacher') {
        navigate('/teacher/'); // Redirect to teacher dashboard
      } 
      setIsSuccess(true);
    } else {
      setMessage('Invalid email or password');
      setIsSuccess(false);
    }
  };

  return (
    <div className={`min-h-screen bg-gray-100 flex flex-col justify-center sm:py-12 ${darkMode ? "bg-dallas-cowboys-blue" : "bg-white"}`}>
      <button
          onClick={() => setDarkMode(!darkMode)}
          className="fixed bottom-4 right-4 p-3 rounded-full bg-gray-200 dark:bg-gray-800 shadow-lg transition"
        >
        {darkMode ? <Sun className="w-6 h-6 text-white" /> : <Moon className="w-6 h-6 text-gray-900" />}
      </button>      
      <div className="p-10 xs:p-0 mx-auto md:w-full md:max-w-md">
        <h1 className="font-bold text-center text-2xl mb-5"> Logo</h1>
        <div className={`shadow w-full rounded-lg divide-y divide-gray-200 ${darkMode ? "bg-college-navy" : "bg-white"}`} >
          <form onSubmit={handleLogin} className="px-5 py-7">
            <label className={`font-semibold text-sm pb-1 block ${darkMode ? "text-white" : "text-gray-700"}`}>E-mail</label>
            <input 
              type="text" 
              className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full" 
              value={email}
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
            <label className={`font-semibold text-sm pb-1 block ${darkMode ? "text-white" : "text-gray-700"}`}>Password</label>
            <input 
              type="password" 
              className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full" 
              value={password}
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
            <button 
              type="submit" 
              className="transition duration-200 bg-blue-500 hover:bg-blue-600 focus:bg-blue-700 focus:shadow-sm focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 text-white w-full py-2.5 rounded-lg text-sm shadow-sm hover:shadow-md font-semibold text-center inline-block"
            >
              <span className="inline-block mr-2">Login</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4 inline-block">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </form>

          {message && (
              <div
                className={`text-center mt-4 text-sm px-4 py-2 rounded ${
                  isSuccess ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                }`}
              >
                {message}
              </div>
            )}

          <div className="py-5">
            <div className="grid grid-cols-2 gap-1">
              <div className="text-center sm:text-left whitespace-nowrap">
                <button className="transition duration-200 mx-5 px-5 py-4 cursor-pointer font-normal text-sm rounded-lg text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-200 focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 ring-inset">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4 inline-block align-text-top">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                  </svg>
                  <a href="/teacher/forgot-password/"><span className="inline-block ml-1">Forgot Password</span></a>
                </button>
              </div>
            </div>
          </div>

          <div className="py-5 text-center">
            <span className={`text-sm ${darkMode ? "text-white" : "text-gray-700"}`}>
              Don't have an account?{' '}
              <a href="/teacher/register" className={`${darkMode ? "text-white hover:text-gray-400" : "text-blue-500 hover:text-blue-700"}`}>
                Register
              </a>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

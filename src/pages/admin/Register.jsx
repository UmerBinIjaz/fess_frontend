import React, { useState } from 'react';
// import React, { useState, useContext } from 'react';
import { useDarkMode } from "../../context/DarkModeContext";
import { Moon, Sun, Menu, X } from "lucide-react"; // Icons


const Register = () => {
  const { darkMode, setDarkMode } = useDarkMode();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(''); // Message for success or error feedback
  const [isSuccess, setIsSuccess] = useState(null); // Track if message is success or error

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage(''); // Reset message

    try {
      const response = await fetch('https://fess-backend-6787.onrender.com/api/admin/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(data.message); // Success message
        setIsSuccess(true); // Mark as success
      } else {
        setMessage(data.error); // Error message
        setIsSuccess(false); // Mark as error
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
      setIsSuccess(false); // Mark as error
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
        <h1 className="font-bold text-center text-2xl mb-5">Logo</h1>
        <div className={`shadow w-full rounded-lg divide-y divide-gray-200 ${darkMode ? "bg-college-navy" : "bg-white"}`} >
          <form onSubmit={handleRegister} className="px-5 py-7">
            <label className={`font-semibold text-sm pb-1 block ${darkMode ? "text-white" : "text-gray-700"}`}>Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
              required
            />

            <label className={`font-semibold text-sm pb-1 block ${darkMode ? "text-white" : "text-gray-700"}`}>E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
              required
            />

            <label className={`font-semibold text-sm pb-1 block ${darkMode ? "text-white" : "text-gray-700"}`}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
              required
            />

            <button
              type="submit"
              className="transition duration-200 bg-blue-500 hover:bg-blue-600 focus:bg-blue-700 focus:shadow-sm focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 text-white w-full py-2.5 rounded-lg text-sm shadow-sm hover:shadow-md font-semibold text-center inline-block"
            >
              <span className="inline-block mr-2">Register Your Account</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4 inline-block">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </form>

          {/* Display Success/Error Message */}
          {message && (
            <div
              className={`text-center mt-4 text-sm px-4 py-2 rounded ${
                isSuccess ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
              }`}
            >
              {message}
            </div>
          )}
          
          <div className="py-5 text-center">
            <span className="text-sm text-gray-500">
              Already have an account?{' '}
              <a href="/admin/login" className="text-blue-500 hover:text-blue-700">
                Login
              </a>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

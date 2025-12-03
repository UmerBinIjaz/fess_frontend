import React, { useState } from 'react';
import axios from 'axios';
import { useDarkMode } from "../../context/DarkModeContext";
import { Moon, Sun, Menu, X } from "lucide-react"; // Icons


const ForgotPassword = () => {
  const { darkMode, setDarkMode } = useDarkMode();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(null);

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setMessage(''); // Reset message

    try {
      const response = await axios.post('https://fess-backend-6787.onrender.com/api/admin/forgot-password', { email });
      setMessage(response.data.message);
      setIsSuccess(true);
    } catch (error) {
      // Check if error.response exists
      if (error.response) {
        setMessage(error.response.data.error || 'Something went wrong');
      } else {
        setMessage('Network error. Please try again later.');
      }
      setIsSuccess(false);
    }
  };

  return (
    <div className={`min-h-screen bg-gray-100 flex flex-col justify-center sm:py-12 ${darkMode ? "bg-college-navy" : "bg-white"}`}>
      <button
          onClick={() => setDarkMode(!darkMode)}
          className="fixed bottom-4 right-4 p-3 rounded-full bg-gray-200 dark:bg-gray-800 shadow-lg transition"
        >
        {darkMode ? <Sun className="w-6 h-6 text-white" /> : <Moon className="w-6 h-6 text-gray-900" />}
      </button>    
      <div className="p-10 xs:p-0 mx-auto md:w-full md:max-w-md">
        <h1 className="font-bold text-center text-2xl mb-5">Forgot Password</h1>
        <div className={`shadow w-full rounded-lg divide-y divide-gray-200 ${darkMode ? "bg-college-navy" : "bg-white"}`}>
          <form onSubmit={handleForgotPassword} className="px-5 py-7">
            <label className={`font-semibold text-sm pb-1 block ${darkMode ? "text-white" : "text-gray-700"}`}>E-mail</label>
            <input 
              type="email" 
              className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full" 
              value={email}
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
            <button 
              type="submit" 
              className="transition duration-200 bg-blue-500 hover:bg-blue-600 focus:bg-blue-700 focus:shadow-sm focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 text-white w-full py-2.5 rounded-lg text-sm shadow-sm hover:shadow-md font-semibold text-center inline-block"
            >
              Send Reset Link
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
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

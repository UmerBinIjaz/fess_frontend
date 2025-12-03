import React, {useState, useEffect, useContext} from 'react'
import { AuthContext } from '../../context/AuthContext'
import axios from 'axios';
import { useDarkMode } from "../../context/DarkModeContext";
import { DarkMode } from "@mui/icons-material";


const Profile = () => {

  const {user, token} = useContext(AuthContext);
  const { darkMode, setDarkMode } = useDarkMode();
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(null); 
  const [error, setError] = useState('');



  return (
    <>
      <div className={`max-w-7xl mx-auto p-6 ${darkMode ? "bg-college-navy" : "bg-white text-gray-900"}`}>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4'>
          <div className='flex justify-start'>
            <h3 className='m-0 font-medium text-base text-blue-500'> My Profile</h3>
          </div>
        </div>
        {/* <div className='flex justify-end'>
          <a href='/student/edit-profile' className='text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5'>Edit Profile</a>
        </div> */}
        <h3 className={`m-0 font-medium text-black text-center ${darkMode ? "text-white" : "text-gray-700"}`}>Personal Information</h3>
        <h6 className={`m-0 font-medium mt-5 mb-5 ${darkMode ? "text-white" : "text-gray-700"}`}>Name: {user.name}</h6>
        {/* <h6 className={`m-0 font-medium mt-5 mb-5 ${darkMode ? "text-white" : "text-gray-700"}`}>Email: {user.email}</h6> */}
        <h6 className={`m-0 font-medium mt-5 mb-5 ${darkMode ? "text-white" : "text-gray-700"}`}>Reg No: {user.reg}</h6>
        <h6 className={`m-0 font-medium mt-5 mb-5 ${darkMode ? "text-white" : "text-gray-700"}`}>Class Section: {user.class_section}</h6>
      </div>
    </>
  )
}

export default Profile
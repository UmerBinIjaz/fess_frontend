import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { useDarkMode } from "../../context/DarkModeContext";

const Dashboard = () => {
  const { user, token } = useContext(AuthContext);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [performance, setPerformance] = useState([]);
  const { darkMode, setDarkMode } = useDarkMode();

  // useEffect(() => {
  //   totalStudents.forEach(() => {
  //     setStudents(prev => prev + 1);
  //   });
  // }, [totalStudents]);
   
  return (
    <div>
      <main className="h-full overflow-y-auto">
        <div className="container  mx-auto grid">
          <div className={`flex items-center p-4 bg-white rounded-lg shadow-xs ${darkMode ? "bg-college-navy text-white" : "bg-white text-gray-900"}`}>
            Welcome back, <span className='text-lg font-bold text-blue-500 ml-2'>{user?.name}!</span>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Dashboard
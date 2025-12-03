import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { useDarkMode } from "../../context/DarkModeContext";
import { DarkMode } from "@mui/icons-material";
// import "./dashboard.css";

const Dashboard = () => {
  const { user, token } = useContext(AuthContext);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const { darkMode, setDarkMode } = useDarkMode();  
  const [students, setStudents] = useState([]);
  const [candidates, setCandidates] = useState([]);
  
  useEffect(() => {
    const fetchStudents = async () => {
      if (user && token) {
        try {
          const response = await axios.post(
            `https://fess-backend-6787.onrender.com/api/admin/students/`,
            { adminId: user.id },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setStudents(response.data); // Ensure correct data format
        } catch (err) {
          console.error('Error fetching students:', err.response?.data?.error || err.message);
        }
      }
    };

    fetchStudents();
  }, [user, token]);
  


  
  useEffect(() => {
const fetchCandidates = async () => {
  if (user && token) {
    try {
      const response = await axios.get(
        `https://fess-backend-6787.onrender.com/api/admin/candidates`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCandidates(response.data);
    } catch (err) {
      console.error('Error fetching Candidates:', err.response?.data?.error || err.message);
    }
  }
};


    fetchCandidates();
  }, [user, token]);

  
  // useEffect(() => {
  //   totalStudents.forEach(() => {
  //     setStudents(prev => prev + 1);
  //   });
  // }, [totalStudents]);
   
  return (
    <div>
      <main className={`h-full overflow-y-auto `}>
        <div className={`container  mx-auto grid`}>
          {/* <!-- Cards --> */}
          <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
            {/* <!-- Card --> */}
            <div className={`flex items-center p-4 bg-white rounded-lg shadow-xs ${darkMode ? "bg-college-navy text-white" : "bg-white text-gray-900"}`}>
              <div className="p-3 mr-4 text-orange-500 bg-orange-100 rounded-full">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"></path>
                </svg>
              </div>
              <div>
                <p className={`mb-2 text-sm font-medium  ${darkMode ? "text-white": "text-gray-600"}`}>
                  Students
                </p>
{/*                 
                {totalStudents.map((data) => (
                  Students = Students + 1;  
                ))} */}
                <p className={`text-lg font-semibold  ${darkMode ? "text-white": "text-gray-600"}`}>
                {students.length}
                </p>
              </div>
            </div>


            <div className={`flex items-center p-4 bg-white rounded-lg shadow-xs ${darkMode ? "bg-college-navy text-white" : "bg-white text-gray-900"}`}>
              <div className="p-3 mr-4 text-orange-500 bg-orange-100 rounded-full ">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"></path>
                </svg>
              </div>
              <div>
                <p className={`mb-2 text-sm font-medium  ${darkMode ? "text-white": "text-gray-600"}`}>
                  Candidates
                </p>
{/*                 
                {totalStudents.map((data) => (
                  Students = Students + 1;  
                ))} */}
                <p className={`text-lg font-semibold  ${darkMode ? "text-white": "text-gray-600"}`}>
                {candidates.length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Dashboard
import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { useDarkMode } from "../../context/DarkModeContext";

const Dashboard = () => {
  const { user, token } = useContext(AuthContext);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [files, setFiles] = useState([]);
  const [performance, setPerformance] = useState([]);
  const { darkMode, setDarkMode } = useDarkMode();

  useEffect(() => {
    const fetchStudents = async () => {
      if (user && token) {
        try {
          const response = await axios.post(
            `http://localhost:5000/api/teacher/students/`,
            { teacherId: user.id },
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
    const fetchCourses = async () => {
      if (user && token) {
        try {
          const response = await axios.post(
            `http://localhost:5000/api/teacher/fetch-courses/`,
            { teacherId: user.id },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setCourses(response.data); // Ensure correct data format
        } catch (err) {
          console.error('Error fetching students:', err.response?.data?.error || err.message);
        }
      }
    };

    fetchCourses();
  }, [user, token]);



  useEffect(() => {
    const fetchFiles = async () => {
      if (user && token) {
        try {
          const response = await axios.post(
            `http://localhost:5000/api/teacher/files/`,
            { teacherId: user.id },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setFiles(response.data); // Ensure correct data format
        } catch (err) {
          console.error('Error fetching students:', err.response?.data?.error || err.message);
        }
      }
    };

    fetchFiles();
  }, [user, token]);



  useEffect(() => {
    const fetchPerformance = async () => {
      if (user && token) {
        try {
          const response = await axios.post(
            'http://localhost:5000/api/teacher/performance/',
            { teacherId: user.id },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          // console.log('Performance API Response:', response.data); // Debugging log
          setPerformance(response.data); 
        } catch (err) {
          console.error('Error fetching performance:', err.response?.data?.error || err.message);
        }
      }
    };
  
    fetchPerformance();
  }, [user, token]);
  
  // useEffect(() => {
  //   totalStudents.forEach(() => {
  //     setStudents(prev => prev + 1);
  //   });
  // }, [totalStudents]);
   
  return (
    <div>
      <main className="h-full overflow-y-auto">
        <div className="container  mx-auto grid">
          {/* <!-- Cards --> */}
          <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
            {/* <!-- Card --> */}
            <div className={`flex items-center p-4 bg-white rounded-lg shadow-xs ${darkMode ? "bg-college-navy text-white" : "bg-white text-gray-900"}`}>
              <div className="p-3 mr-4 text-orange-500 bg-orange-100 rounded-full ">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"></path>
                </svg>
              </div>
              <div>
                <p className={`mb-2 text-sm font-medium  ${darkMode ? "text-white": "text-gray-600"}`}>
                  My Students
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
            {/* <!-- Card --> */}
            <div className={`flex items-center p-4 bg-white rounded-lg shadow-xs ${darkMode ? "bg-college-navy text-white" : "bg-white text-gray-900"}`}>
              <div className="p-3 mr-4 text-green-500 bg-green-100 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="currentColor" viewBox="0 0 50 50">
                <path d="M 10.5 5 C 8.0324991 5 6 7.0324991 6 9.5 L 6 31.5 C 6 33.967501 8.0324991 36 10.5 36 L 15.994141 36 L 15.994141 33 L 10.5 33 C 9.6535009 33 9 32.346499 9 31.5 L 9 31 L 16 31 L 16 28 L 9 28 L 9 9.5 C 9 8.6535009 9.6535009 8 10.5 8 L 25.5 8 C 26.346499 8 27 8.6535009 27 9.5 L 27 10 L 30 10 L 30 9.5 C 30 7.0324991 27.967501 5 25.5 5 L 10.5 5 z M 22.5 12 C 20.032499 12 18 14.032499 18 16.5 L 18 36.253906 A 1.50015 1.50015 0 0 0 18 36.740234 L 18 38.5 C 18 40.967501 20.032499 43 22.5 43 L 40.5 43 A 1.50015 1.50015 0 1 0 40.5 40 L 22.5 40 C 21.653501 40 21 39.346499 21 38.5 L 21 38 L 40.5 38 A 1.50015 1.50015 0 0 0 42 36.5 L 42 16.5 C 42 14.032499 39.967501 12 37.5 12 L 22.5 12 z M 13.5 13 C 12.671 13 12 13.671 12 14.5 C 12 15.329 12.671 16 13.5 16 L 16.025391 16 C 16.110391 14.901 16.46625 13.879 17.03125 13 L 13.5 13 z M 22.5 15 L 37.5 15 C 38.346499 15 39 15.653501 39 16.5 L 39 35 L 21 35 L 21 16.5 C 21 15.653501 21.653501 15 22.5 15 z M 25.5 20 A 1.50015 1.50015 0 1 0 25.5 23 L 34.5 23 A 1.50015 1.50015 0 1 0 34.5 20 L 25.5 20 z"></path>
              </svg>
              </div>
              <div>
                <p className={`mb-2 text-sm font-medium  ${darkMode ? "text-white": "text-gray-600"}`}>
                    My Courses
                </p>
                <p className={`text-lg font-semibold  ${darkMode ? "text-white": "text-gray-600"}`}>
                {courses.length}
                </p>
              </div>
            </div>
            {/* <!-- Card --> */}
            <div className={`flex items-center p-4 bg-white rounded-lg shadow-xs ${darkMode ? "bg-college-navy text-white" : "bg-white text-gray-900"}`}>
                <div className="p-3 mr-4 text-teal-500 bg-teal-100 rounded-full">
                    {/* <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clip-rule="evenodd"></path>
                    </svg> */}
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="currentColor" viewBox="0 0 50 50">
                      <path fill-rule="evenodd"  clip-rule="evenodd" d="M 13.5 4 C 10.480226 4 8 6.4802259 8 9.5 L 8 36 L 8 37.5 L 8 38.5 C 8 41.519774 10.480226 44 13.5 44 L 39.5 44 A 1.50015 1.50015 0 1 0 39.5 41 L 13.5 41 C 12.273237 41 11.277238 40.152347 11.050781 39 L 39.5 39 A 1.50015 1.50015 0 0 0 41 37.5 L 41 9.5 C 41 6.4802259 38.519774 4 35.5 4 L 13.5 4 z M 13.5 7 L 35.5 7 C 36.898226 7 38 8.1017741 38 9.5 L 38 36 L 11 36 L 11 9.5 C 11 8.1017741 12.101774 7 13.5 7 z M 16.5 16 A 1.50015 1.50015 0 1 0 16.5 19 L 32.5 19 A 1.50015 1.50015 0 1 0 32.5 16 L 16.5 16 z M 16.5 23 A 1.50015 1.50015 0 1 0 16.5 26 L 29.5 26 A 1.50015 1.50015 0 1 0 29.5 23 L 16.5 23 z"></path>
                    </svg>                        
                  </div>
              <div>
                <p className={`mb-2 text-sm font-medium  ${darkMode ? "text-white": "text-gray-600"}`}>
                  My Files
                </p>
                <p className={`text-lg font-semibold  ${darkMode ? "text-white": "text-gray-600"}`}>
                  {files.length}
                </p>
              </div>
            </div>
            {/* <!-- Card --> */}
            <div className={`flex items-center p-4 bg-white rounded-lg shadow-xs ${darkMode ? "bg-college-navy text-white" : "bg-white text-gray-900"}`}>
             
              <div className="p-3 mr-4 text-blue-500 bg-blue-100 rounded-full ">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 50 50">
                <path d="M 8.5 8 C 6.0324991 8 4 10.032499 4 12.5 L 4 35.5 C 4 37.967501 6.0324991 40 8.5 40 L 39.5 40 C 41.967501 40 44 37.967501 44 35.5 L 44 12.5 C 44 10.032499 41.967501 8 39.5 8 L 8.5 8 z M 8.5 11 L 39.5 11 C 40.346499 11 41 11.653501 41 12.5 L 41 35.5 C 41 36.346499 40.346499 37 39.5 37 L 8.5 37 C 7.6535009 37 7 36.346499 7 35.5 L 7 12.5 C 7 11.653501 7.6535009 11 8.5 11 z M 36.470703 12.986328 A 1.50015 1.50015 0 0 0 35.439453 13.439453 L 32.5 16.378906 L 31.560547 15.439453 A 1.50015 1.50015 0 1 0 29.439453 17.560547 L 31.439453 19.560547 A 1.50015 1.50015 0 0 0 33.560547 19.560547 L 37.560547 15.560547 A 1.50015 1.50015 0 0 0 36.470703 12.986328 z M 11.5 15 A 1.50015 1.50015 0 1 0 11.5 18 L 24.5 18 A 1.50015 1.50015 0 1 0 24.5 15 L 11.5 15 z M 36.470703 19.986328 A 1.50015 1.50015 0 0 0 35.439453 20.439453 L 32.5 23.378906 L 31.560547 22.439453 A 1.50015 1.50015 0 1 0 29.439453 24.560547 L 31.439453 26.560547 A 1.50015 1.50015 0 0 0 33.560547 26.560547 L 37.560547 22.560547 A 1.50015 1.50015 0 0 0 36.470703 19.986328 z M 11.5 22.5 A 1.50015 1.50015 0 1 0 11.5 25.5 L 24.5 25.5 A 1.50015 1.50015 0 1 0 24.5 22.5 L 11.5 22.5 z M 36.470703 26.986328 A 1.50015 1.50015 0 0 0 35.439453 27.439453 L 32.5 30.378906 L 31.560547 29.439453 A 1.50015 1.50015 0 1 0 29.439453 31.560547 L 31.439453 33.560547 A 1.50015 1.50015 0 0 0 33.560547 33.560547 L 37.560547 29.560547 A 1.50015 1.50015 0 0 0 36.470703 26.986328 z M 11.5 30 A 1.50015 1.50015 0 1 0 11.5 33 L 24.5 33 A 1.50015 1.50015 0 1 0 24.5 30 L 11.5 30 z"></path>
                </svg>
              </div>
              <div>
                <p className={`mb-2 text-sm font-medium  ${darkMode ? "text-white": "text-gray-600"}`}>
                 My Teaching Assesment
                </p>
                {/* <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                  {performance !== null ? `${performance}%` : 'Loading...'}
                </p> */}

                {performance.map((data) => (
                <p className={`text-lg font-semibold  ${darkMode ? "text-white": "text-gray-600"}`}>
                  {parseFloat(data.performance_percentage).toFixed(1)} %
                </p>
                ))}

              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Dashboard
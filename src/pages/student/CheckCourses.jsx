import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext'; // Import AuthContext
import { useDarkMode } from "../../context/DarkModeContext";

const CheckCourses = () => {
  const { user, token } = useContext(AuthContext); // Get user and token from AuthContext
  const { darkMode, setDarkMode } = useDarkMode();  
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(null); // Track if message is success or error

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      if (user && token) {
        try {
          const response = await axios.post(
            `https://fess-backend-6787.onrender.com/api/student/courses`,
            { studentId: user.id }, // Pass studentId in the body
            {
              headers: {
                Authorization: `Bearer ${token}`, // Pass token in headers
              },
            }
          );
          if (response.data && response.data.length === 0) {
            setMessage('No Courses Enrolled Yet');
            setIsSuccess(false); // Set to error state
          } else {
            setEnrolledCourses(response.data);
            setMessage(''); // Clear any previous messages
            setIsSuccess(true); // Set to success state if courses are found
          }
        } catch (error) {
          console.error('Error fetching enrolled courses:', error);
          // setMessage('Failed to fetch enrolled courses.');
          setIsSuccess(false);
        }
      }
    };

    fetchEnrolledCourses();
  }, [user, token]);

  const getRandomDarkColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 3; i++) {
      const darkValue = Math.floor(Math.random() * 8);
      color += letters[darkValue] + letters[darkValue];
    }
    return color;
  };

  const formatCourseName = (name) => {
    const parts = name.split(' ');
    const code = parts[0];
    const shift = parts.slice(-1)[0];
    const titleWords = parts.slice(1, -1);
    const abbreviation = titleWords
      .map((word) => word[0].toUpperCase())
      .join('');
    return `${code} ${abbreviation} ${shift}`;
  };

  return (
    <div className={`flex-1 p-5 rounded-md `}>
      <h2 className={`text-lg font-semibold my-5 ${darkMode ? "text-white" : "text-blue-500"}`}>Enrolled Courses</h2>

      {message && (
        <div
          className={`text-center my-4 text-sm px-4 py-2 rounded ${
            isSuccess ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
          }`}
        >
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
        {enrolledCourses.length > 0 ? (
          enrolledCourses.map((course) => (
            <div
              key={course.id}
              className={` shadow-md rounded-md p-4 hover:shadow-lg transition-shadow ${darkMode ? "bg-college-navy text-white" : "bg-white text-gray-900"}`}
            >
              <div
                className="w-16 h-16 flex items-center justify-center rounded-md mx-auto"
                style={{ backgroundColor: getRandomDarkColor() }}
              >
                <span className="text-white text-xl font-bold">
                  {course.name
                    .split(' ')
                    .slice(1, -1)
                    .map((word) => word[0].toUpperCase())
                    .join('')}
                </span>
              </div>
              <h3 className="mt-2 text-sm font-semibold text-center">
                <Link
                  to={`/student/course/${course.id}/check-files/`}
                  className="text-lg font-semibold text-center"
                >
                  {/* {formatCourseName(course.name)} */}
                  {course.name}
                </Link>
              </h3>
              <p className="text-sm text-center mt-2">
                Class Code: {course.class_code}
              </p>
              <p className="text-sm text-center mt-2">
                Instructor: {course.teacher_name}
              </p>
            </div>
          ))
        ) : (
          // <p className="text-center text-gray-600">No Courses Enrolled Yet</p>
          <div className="py-2 px-4 error text-sm text-center">
              No Course Found
          </div>  
        )}
      </div>
    </div>
  );
};

export default CheckCourses;

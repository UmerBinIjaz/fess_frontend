import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { AuthContext } from '../../context/AuthContext'; // Import AuthContext
import { useDarkMode } from "../../context/DarkModeContext";

const Courses = () => {
  const { user, token } = useContext(AuthContext); // Get user and token from AuthContext
  const { darkMode, setDarkMode } = useDarkMode();
  const [courses, setCourses] = useState([]);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(null); // Track if message is success or error

  useEffect(() => {
    const fetchCourses = async () => {
      if (user && token) { // Check if user and token are available
        try {
          const response = await axios.post(
            `http://localhost:5000/api/teacher/fetch-courses/`,
            { teacherId: user.id }, // Use user.id from AuthContext
            {
              headers: {
                Authorization: `Bearer ${token}`, // Use the token from AuthContext
              },
            }
          );
          setCourses(response.data);
        } catch (error) {
          console.error('Error fetching courses:', error);
        }
      }
    };

    fetchCourses();
  }, [user, token]); // Depend on user and token for re-fetching

  const getRandomDarkColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 3; i++) {
      const darkValue = Math.floor(Math.random() * 8);
      color += letters[darkValue] + letters[darkValue];
    }
    return color;
  };


  // const handleDelete = async (courseId, courseName) => {
  //   try {
  //     const response = await axios.delete(
  //       `http://localhost:5000/api/teacher/courses/${courseId}`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );
  //     if (response.status === 200) {
  //       setMessage(`Course "${courseName}" has been deleted successfully.`);
  //       setCourses(courses.filter(course => course.id !== courseId)); // Update course list
  //       // setTimeout(() => history.push('/teacher/courses'), 2000); // Redirect after 2 seconds
  //     }
  //   } catch (error) {
  //     console.error('Error deleting course:', error);
  //   }
  // };

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
    <div>
      <div className="flex-1 p-5">
        <div className="flex items-center justify-between">
        <h2 className={`text-lg font-semibold my-5 ${darkMode ? "text-white" : "text-blue-500"}`}>Courses</h2>
        </div>
        
        {message && (
          <div
            className={`text-center my-4 text-sm px-4 py-2 rounded ${
              isSuccess ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
            }`}
            style={{ width: '100%' }}
          >
            {message}
          </div>
        )}

        {/* Update grid classes to display 3 cards even on large screens */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
          {courses.map((course) => (
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
              <h3 className={`mt-2 text-sm font-semibold text-center ${darkMode ? "text-white" : "text-gray-900"}`}>
                <Link
                  to={`/teacher/course/${course.id}/take-attendance/`}
                  className="text-lg font-semibold text-center"
                >
                  {/* {formatCourseName(course.name)} */}
                  {course.name}
                </Link>
              </h3>
              <p className={`text-sm text-gray-600 text-center mt-2 ${darkMode ? "text-white" : "text-gray-900"}`}>
                Class Code: {course.class_code}
              </p>
              {/* <div className="flex justify-end mt-3">
                <button
                  onClick={() => handleDelete(course.id, course.name)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FaTrash />
                </button>
              </div> */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Courses;

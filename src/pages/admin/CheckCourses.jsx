import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { AuthContext } from '../../context/AuthContext'; 
import { FaDownload } from 'react-icons/fa';
import { useDarkMode } from "../../context/DarkModeContext";
import { DarkMode } from "@mui/icons-material";

import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';


const CheckCourses = () => {
  const { user, token } = useContext(AuthContext);
  const { darkMode, setDarkMode } = useDarkMode();
  const [courses, setCourses] = useState([]);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(null); // Track success or error
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      if (user && token) {
        try {
          const response = await axios.post(
            `https://fess-backend-6787.onrender.com/api/admin/fetch-courses/`,
            { adminId: user.id },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setCourses(response.data);
        } catch (error) {
          // setMessage('Invalid email or password');
          console.error('Error fetching courses:', error);
        }
      }
    };

    fetchCourses();
  }, [user, token]);

  // const handleDelete = async (courseId, courseName) => {
  //   try {
  //     const response = await axios.delete(
  //       `https://fess-backend-6787.onrender.com/api/admin/courses/${courseId}`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );
  //     if (response.status === 200) {
  //       setMessage(`Course "${courseName}" has been deleted successfully.`);
  //       setCourses(courses.filter(course => course.id !== courseId));
  //     }
  //   } catch (error) {
  //     console.error('Error deleting course:', error);
  //   }
  // };

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


  const exportToExcel = () => {
    if (courses.length === 0) return;

    const worksheet = XLSX.utils.json_to_sheet(
      courses.map((course, index) => ({
        "Sr. No": index + 1,
        "Course Name": course.name,
        "Teacher Name": course.teacherName,
        "Class Code": course.classCode
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Courses');

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(data, 'Courses.xlsx');
  };  

  return (
    <div className={`flex-1 p-5 rounded-md `}>
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
        <div className="flex justify-start">
          <h2 className={`text-lg font-semibold my-5 ${darkMode ? "text-white" : "text-gray-700"}`}>Courses</h2>
          {/* <a href="/admin/create-course" className='text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5'>Create Course</a>           */}
        </div>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5'>
        <div className="flex justify-start">
          <a href="/admin/create-course" className='text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5'>Create Course</a>          
        </div>

        <div className='flex justify-end'>
          <button
            onClick={exportToExcel}
            className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5"
          >
            Export to Excel
          </button>
        </div>
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
            <h3 className="mt-2 text-sm font-semibold text-center">
              <Link
                to={`/admin/course/${course.id}/download-attendance/`}
                className="text-lg font-semibold text-center"
              >

                {course.name}
              </Link>
            </h3>
            <p className="text-sm text-center mt-2">
              Class Code: {course.classCode}
            </p>
            <p className="text-sm text-center mt-2 flex items-center justify-center">
              {course.teacherName ? (
                <span className="">Assigned To: {course.teacherName}</span>
              ) : (
                <span className="text-red-600 flex items-center">
                  <span className="w-2 h-2 bg-red-600 rounded-full mr-2"></span>
                  Not Assigned
                </span>
              )}
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
  );
};


export default CheckCourses
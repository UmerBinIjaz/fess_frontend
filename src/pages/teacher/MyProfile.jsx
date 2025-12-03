import React, {useState, useEffect, useContext} from 'react'
import { AuthContext } from '../../context/AuthContext'
import axios from 'axios';
import { useDarkMode } from "../../context/DarkModeContext";
import { DarkMode } from "@mui/icons-material";

const MyProfile = () => {

  const {user, token} = useContext(AuthContext);
  const { darkMode, setDarkMode } = useDarkMode();
  const [courses, setCourses] = useState([]);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(null); 
  const [error, setError] = useState('');


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

  return (
    <>
      <div className={`max-w-7xl mx-auto p-6 rounded ${darkMode ? "bg-college-navy" : "bg-white text-gray-900"}`}>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4'>
          <div className='flex justify-start'>
            <h3 className={`m-0 font-medium text-base ${darkMode? "text-gray-300" : "text-blue-500"}`}> My Profile</h3>
          </div>
        </div>
        <div className='flex justify-end'>
          <a href='/teacher/edit-profile' className='text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5'>Edit Profile</a>
        </div>
        <h3 className={`m-0 font-medium text-center ${darkMode? "text-white" : "text-black"}`}>Personal Information</h3>
        <h6 className={`m-0 font-medium mt-5 mb-5 ${darkMode? "text-white" : "text-gray-300"}`}>Name: {user.name}</h6>
        <h6 className={`m-0 font-medium mt-5 mb-5 ${darkMode? "text-white" : "text-gray-300"}`}>Email: {user.email}</h6>

        <h3 className={`m-0 font-medium text-black text-center ${darkMode? "text-white" : "text-black"}`}>Courses Teach This Semester</h3>
        {courses.map((course) => (
        <h6 className={`m-0 font-medium mt-5 mb-5 ${darkMode? "text-white" : "text-gray-300"}`}>{course.name}</h6>
        ))}
      </div>
    </>
  )
}

export default MyProfile
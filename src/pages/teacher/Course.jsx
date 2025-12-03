import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link, Outlet } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext'; // Import AuthContext
import axios from 'axios';
import "./course.css";
const Course = () => {
    const { courseId } = useParams(); // Get the courseId from the URL
    const { user, token } = useContext(AuthContext); // Access the logged-in teacher's details
    const [courseName, setCourseName] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch the specific course details
        const fetchCourse = async () => {
          if (user && token) {
            try {
              const response = await axios.post(
                `http://localhost:5000/api/teacher/course/${courseId}`,
                { teacherId: user.id, courseId }, // Send both teacherId and courseId
                {
                  headers: {
                    Authorization: `Bearer ${token}`, // Include token in the headers
                  },
                }
              );
              setCourseName(response.data.name);
            } catch (err) {
              // Handle different error types
              if (err.response?.status === 403) {
                setError('Unauthorized access: You cannot view this course.');
              } else {
                setError(err.response?.data?.error || 'Something went wrong');
              }
            }
          }
        };
    
        fetchCourse();
      }, [courseId, user, token]);

    return (
        <div className="px-4 sm:px-6 lg:px-8">
            {error ? (
                <p className="text-red-500">{error}</p>
            ) : (
                <>
                    {/* <h1 className="text-2xl font-semibold mb-4">{courseName || 'Loading...'}</h1> */}

                    <div>
                        {/* Render nested route content */}
                        <Outlet />
                    </div>
                </>
            )}
        </div>
    );
};

export default Course;

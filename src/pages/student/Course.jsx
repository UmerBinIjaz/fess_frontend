import React, { useEffect, useState, useContext } from 'react';
import { useParams, Outlet } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext'; // Import AuthContext
import axios from 'axios';

const Course = () => {
    const { courseId } = useParams(); // Get the courseId from the URL
    const { user, token } = useContext(AuthContext); // Access logged-in student's details
    const [courseName, setCourseName] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch the specific course details
        const fetchCourse = async () => {
            if (user && token) {
                try {
                    const response = await axios.post(
                        `https://fess-backend-6787.onrender.com/api/student/course/${courseId}`,// Adjust route based on your backend
                        { studentId: user.id, courseId }, // Send both studentId and courseId
                        {
                            headers: {
                                Authorization: `Bearer ${token}`, // Include token in the headers
                            },
                        }
                    );
                    setCourseName(response.data.name); // Update course name from the response
                } catch (err) {
                    // Handle different error types
                    if (err.response?.status === 403) {
                        setError('Unauthorized access: You cannot view this course.');
                    } else if (err.response?.status === 404) {
                        setError('Course not found.');
                    } else {
                        setError(err.response?.data?.error || 'Something went wrong.');
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

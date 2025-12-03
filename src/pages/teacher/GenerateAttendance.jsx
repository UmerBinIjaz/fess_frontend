import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { useDarkMode } from "../../context/DarkModeContext";
import { DarkMode } from "@mui/icons-material";

const GenerateAttendance = () => {
  const { user, token } = useContext(AuthContext);
  const { darkMode, setDarkMode } = useDarkMode();
  const { courseId } = useParams();
  const [selectedCourse, setSelectedCourse] = useState(null);   
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');


  

  useEffect(() => {
    const fetchCourse = async () => {
      if (user && token && courseId) {
        try {
          const response = await axios.post(
            `http://localhost:5000/api/teacher/course/${courseId}`,
            { teacherId: user.id, courseId },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setSelectedCourse(response.data);  // Update selected course
        } catch (err) {
          if (err.response?.status === 403) {
            setError('Unauthorized access: You cannot view this course.');
          } else {
            setError(err.response?.data?.error || 'Something went wrong');
          }
        }
      }
    };

    fetchCourse();
  }, [courseId, user, token]); // Re-fetch when courseId changes

  
  // Fetch attendance data
  useEffect(() => {
    const fetchAttendanceData = async () => {
      if (user && token) {
        try {
          setLoading(true);
          const response = await axios.post(
            `http://localhost:5000/api/teacher/course/${courseId}/generate-attendance`,
            { adminId: user.id },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setAttendanceData(response.data);
          setLoading(false);
        } catch (error) {
          setError(error.response?.data?.error || 'Failed to fetch attendance data');
          setLoading(false);
        }
      }
    };
    fetchAttendanceData();
  }, [user, token, courseId]);
  





  const handleExport = async () => {
    try {
        const response = await axios.post(
            `http://localhost:5000/api/teacher/course/${courseId}/export-attendance`,
            { adminId: user.id },
            { headers: { Authorization: `Bearer ${token}` }, responseType: 'blob' }
        );

        const courseName = selectedCourse?.name || 'UnknownCourse';  // Default to 'UnknownCourse' if name is undefined
        const filename = `${courseName} AttendanceReport.xlsx`;  // Change extension to .xlsx

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
    } catch (error) {
        setError('Failed to export attendance data');
    }
  };


  return (
    <>
      <div className={`max-w-7xl mx-auto p-6 ${darkMode ? "bg-college-navy" : "bg-white text-gray-900"}`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div className='flex justify-start'>
            <h3 className={`m-0 font-medium text-base ${darkMode ? "text-white" : "text-blue-500"}`}> Attendance Report</h3>
          </div>
          <div className='flex justify-end'>
            <button onClick={handleExport} className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5">
              Export to Excel
            </button>
          </div>
        </div>
      </div>
      <div className={`max-w-7xl my-2 mx-auto p-5 ${darkMode ? "bg-college-navy" : "bg-white"}`}>
        {error && <div className="error my-2">{error}</div>}
        {successMessage && <div className="success my-2">{successMessage}</div>}
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead className={`${darkMode ? "bg-gray-800" : "bg-blue-300"}`}>
              <tr className="border-b">
                <th className={`py-2 px-4 text-left text-sm font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>Sr No</th>
                <th className={`py-2 px-4 text-left text-sm font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>Registration No</th>
                <th className={`py-2 px-4 text-left text-sm font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>Name</th>
                <th className={`py-2 px-4 text-left text-sm font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>Total Classes</th>
                <th className={`py-2 px-4 text-left text-sm font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>Presents</th>
                <th className={`py-2 px-4 text-left text-sm font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>Attendance Percentage</th>
              </tr>
            </thead>
            <tbody>
              {attendanceData.map((data, index) => (
                <tr key={data.reg}>
                  <td className={`py-2 px-4 text-sm font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>{index + 1}</td>
                  <td className={`py-2 px-4 text-sm font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>{data.reg}</td>
                  <td className={`py-2 px-4 text-sm font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>{data.name}</td>
                  <td className={`py-2 px-4 text-sm font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>{data.totalClasses}</td>
                  <td className={`py-2 px-4 text-sm font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>{data.presentAttendance}</td>
                  <td className={`py-2 px-4 text-sm font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>{Number(data.attendancePercentage).toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default GenerateAttendance;
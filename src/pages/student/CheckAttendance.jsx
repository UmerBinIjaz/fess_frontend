import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { useDarkMode } from "../../context/DarkModeContext";
import { DarkMode } from "@mui/icons-material";


const CheckAttendance = () => {
  const { user, token } = useContext(AuthContext);
  const { darkMode, setDarkMode } = useDarkMode();
  const { courseId } = useParams(); // Get courseId from URL
  const [error, setError] = useState("");
  const [attendance, setAttendance] = useState([]);

  useEffect(() => {
    const fetchAttendance = async () => {
      if (user && token && courseId) {
        try {
          const response = await axios.post(
            `https://fess-backend-6787.onrender.com/api/student/course/${courseId}/attendance`,
            { studentID: user.id, courseId },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          setAttendance(response.data); // Store response data
        } catch (err) {
          console.error("Error fetching data:", err);
          // setError("Error fetching data. Please try again.");
        }
      }
    };

    fetchAttendance();
  }, [user, courseId, token]);

  return (
    <div className={`max-w-7xl mx-auto p-6 ${darkMode ? "bg-college-navy" : "bg-white text-gray-900"}`}>
      {error && <div className="error my-2">{error}</div>}

      {/* Check if attendance is empty */}
      {attendance.length === 0 ? (
        <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead className="">
            <tr className="border-b">
              <th className={`py-2 px-4 text-left text-sm font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>Sr</th>
              <th className={`py-2 px-4 text-left text-sm font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>Registration Number</th>
              <th className={`py-2 px-4 text-left text-sm font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>Name</th>
              <th className={`py-2 px-4 text-left text-sm font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>Course Name</th>
              <th className={`py-2 px-4 text-left text-sm font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>Presents</th>
              <th className={`py-2 px-4 text-left text-sm font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>Total Classes</th>
              <th className={`py-2 px-4 text-left text-sm font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>Attendance Percentage</th>
            </tr>
          </thead>
          <tbody>
              <tr>
                <td colSpan="7" className="my-2 py-2 px-4 error text-sm text-center">
                    No Attendance Record Found
                </td>
              </tr>
          </tbody>
        </table>
      </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead className="">
              <tr className="border-b">
                <th className={`py-2 px-4 text-left text-sm font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>Sr</th>
                <th className={`py-2 px-4 text-left text-sm font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>Registration Number</th>
                <th className={`py-2 px-4 text-left text-sm font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>Name</th>
                <th className={`py-2 px-4 text-left text-sm font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>Course Name</th>
                <th className={`py-2 px-4 text-left text-sm font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>Presents</th>
                <th className={`py-2 px-4 text-left text-sm font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>Total Classes</th>
                <th className={`py-2 px-4 text-left text-sm font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>Attendance Percentage</th>
              </tr>
            </thead>
            <tbody>
              {attendance.map((data, index) => (
                <tr key={data.reg}>
                  <td className={`py-2 px-4 text-sm font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>{index + 1}</td>
                  <td className={`py-2 px-4 text-sm font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>{data.reg}</td>
                  <td className={`py-2 px-4 text-sm font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>{data.name}</td>
                  <td className={`py-2 px-4 text-sm font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>{data.courseName}</td>
                  <td className={`py-2 px-4 text-sm font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>{data.presents}</td>
                  <td className={`py-2 px-4 text-sm font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>{data.totalClasses}</td>
                  <td className={`py-2 px-4 text-sm font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>
                    {Number(data.attendancePercentage).toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CheckAttendance;

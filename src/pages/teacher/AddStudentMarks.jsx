import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useParams, useNavigate, redirect } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { useDarkMode } from "../../context/DarkModeContext";

const AddStudentMarks = () => {
  const { courseId, sessionalId } = useParams();    // Fetch courseId and sessionalId from URL params
  const { darkMode, setDarkMode } = useDarkMode();
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [studentsMarks, setStudentsMarks] = useState([]);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch students and their marks
  useEffect(() => {
    const fetchStudentsAndMarks = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/teacher/course/${courseId}/sessionals/${sessionalId}/students-marks`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setStudentsMarks(response.data);
      } catch (err) {
        setError('Failed to fetch data');
      }
    };

    
    fetchStudentsAndMarks();
  }, [courseId, sessionalId, token]);

  // Handle updating marks for a student
  const handleUpdateMarks = async (studentId, newMarks) => {
    try {
      await axios.post(
        `http://localhost:5000/api/teacher/course/${courseId}/sessionals/${sessionalId}/update-marks`, 
        { studentId, newMarks, courseId, sessionalId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      const updatedStudent = studentsMarks.find(student => student.student_id === studentId);
      setSuccessMessage(`${updatedStudent.student_name}'s Marks updated successfully`);
      
      setStudentsMarks((prev) =>
        prev.map((student) =>
          student.student_id === studentId ? { ...student, obtained_marks: newMarks } : student
        )
          
      );
      navigate(`/teacher/course/${courseId}/AddStudentMarks/${sessionalId}/`);
    } catch (err) {
      setError('Failed to update marks');
    }


  };

  return (
    <div className={`max-w-7xl mx-auto p-6 mt-4 ${darkMode ? "bg-college-navy" : "bg-white text-gray-900"}`}>
      <div className="flex justify-between items-center mb-6">
        <h6 className="m-0 font-medium text-base text-blue-500">Student Marks in this Sessional</h6>
      </div>

      {error && (
        <div className="text-center bg-red-100 text-red-600 p-2 rounded-md mb-4">
          {error}
        </div>
      )}
      {successMessage && (
        <div className="text-center bg-green-100 text-green-600 p-2 rounded-md mb-4">
          {successMessage}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="border-b">
              <th className={`py-2 px-4 text-left text-sm font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>Sr No</th>
              <th className={`py-2 px-4 text-left text-sm font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>Student Name</th>
              <th className={`py-2 px-4 text-left text-sm font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>Marks Obtained</th>
              <th className={`py-2 px-4 text-left text-sm font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {studentsMarks.map((student, index) => (
              <tr key={student.student_id} className="border-b">
                <td className={`py-2 px-4 text-sm font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>{index + 1}</td>
                <td className={`py-2 px-4 text-sm font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>{student.student_name}</td>
                <td className={`py-2 px-4 text-sm font-medium text-gray-800"`}>
                  <input
                    type="number"
                    value={student.obtained_marks}
                    onChange={(e) =>
                      setStudentsMarks((prev) =>
                        prev.map((s) =>
                          s.student_id === student.student_id
                            ? { ...s, obtained_marks: e.target.value }
                            : s
                        )
                      )
                    }
                    className="w-full px-2 py-1 border rounded-md"
                  />
                </td>
                <td className={`py-2 px-4 text-sm font-medium `}>
                  <button
                    onClick={() => handleUpdateMarks(student.student_id, student.obtained_marks)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md"
                  >
                    Save
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AddStudentMarks;

import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { useDarkMode } from "../../context/DarkModeContext";
import { DarkMode } from "@mui/icons-material";


const TakeAttendance = () => {
  const { user, token } = useContext(AuthContext);
  const { darkMode, setDarkMode } = useDarkMode();
  const { courseId } = useParams();
  const [students, setStudents] = useState([]);
  const iterator = 0;
  const [selectedStudents, setSelectedStudents] = useState({});
  const [selectedCourse, setSelectedCourse] = useState(null);   
  const [attendanceDate, setAttendanceDate] = useState('');
  const [classNumber, setClassNumber] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch students data
  useEffect(() => {
    const fetchStudents = async () => {
      if (user && token) {
        try {
          const response = await axios.post(
            `http://localhost:5000/api/teacher/course/${courseId}/students`,
            { adminId: user.id },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setStudents(response.data);
        } catch (error) {
          setError(error.response?.data?.error || 'Failed to fetch students');
        }
      }
    };
    fetchStudents();
  }, [user, token, courseId]);


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

  // Fetch last class number from the backend
  const fetchLastClassNumber = async () => {
    try {
      // Make the API request to fetch the last class number
      const response = await axios.post(
        `http://localhost:5000/api/teacher/course/${courseId}/lastClassNumber`,
        { adminId: user.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      // Log the entire response to check its structure
      console.log("Response data:", response.data);
  
      // Ensure classNumber is in the response and is a valid number
      const classNumberFromResponse = response.data.classNumber;
  
      // Log the classNumber value
      // console.log("Class number from response:", classNumberFromResponse);
  
      if (classNumberFromResponse === null || classNumberFromResponse === undefined) {
        // Handle the case where no class number is found
        setError('No class number found. Please try again later.');
        setClassNumber(0); // Or you can set it to a default value like 0 or any other meaningful value
      } else if (isNaN(classNumberFromResponse)) {
        // Handle the case where classNumber is not a valid number
        setError('Invalid class number received from the server. Please try again.');
        setClassNumber(0); // Set to a default value or handle it based on your needs
      } else {
        // Set the fetched class number to the state
        setClassNumber(classNumberFromResponse);
      }
    } catch (error) {
      console.error('Error fetching last class number:', error);
      setError('Failed to fetch last class number. Please try again.');
    }
  };
   
  fetchLastClassNumber();

  const handleCheckboxChange = (regNo) => {
    setSelectedStudents((prev) => {
      const newSelectedStudents = { ...prev };
      // Toggle attendance status between "Present" and "Absent"
      newSelectedStudents[regNo] = newSelectedStudents[regNo] === "Present" ? "Absent" : "Present";
      return newSelectedStudents;
    });
  };
  
  // Submit attendance
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    // Fetch the last class number before submitting attendance
  // Fetch the last class number before submitting attendance
  await fetchLastClassNumber();

  // Ensure class number is fetched before submitting
  if (!classNumber && classNumber !== 0) {
    setError('Failed to fetch class number. Please try again.');
    return;
  }
  if(!attendanceDate){
    setError('Please Select The Date First');
    return;    
  }

  
  // Prepare attendance payload
  const payload = {
    reg: students.map((student) => student.student_registration),
    course_id: courseId,
    class_number: classNumber + 1,
    attendanceStatus: students.map((student) => {
      // Get attendance status from selectedStudents object
      return selectedStudents[student.student_registration] || "Absent"; // Default to "Absent"
    }),
    attendance_date: attendanceDate,
  };

    try {
      setLoading(true);
      const response = await axios.post(
        `http://localhost:5000/api/teacher/course/${courseId}/TakeAttendance`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccessMessage(response.data.message);
      setLoading(false);
    } catch (err) {
      console.error('Error submitting attendance:', err);
      setError('Failed to submit attendance. Please try again.');
      setLoading(false);
    }
  };

  const handleSelectAll = () => {
    const allSelected = {};
    students.forEach((student) => {
      allSelected[student.student_registration] = "Present";
    });
    setSelectedStudents(allSelected);
  };
  
  const handleDeselectAll = () => {
    const allDeselected = {};
    students.forEach((student) => {
      allDeselected[student.student_registration] = "Absent";
    });
    setSelectedStudents(allDeselected);
  };    
      
  return (
    <>
      <div className={`max-w-7xl mx-auto p-6 ${darkMode ? "bg-college-navy" : "bg-white text-gray-900"}`}>
        {/* Import Button */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div className='flex justify-start'>
            <h3 className={`m-0 font-medium text-base ${darkMode ? "text-white" : "text-blue-500"}`}>Select Attendance Date</h3>
          </div>
          <div className='flex justify-end'>
            {/* <label for="meeting-time">Choose a time for your appointment:</label> */}
            <input
              type="datetime-local"
              id="meeting-time"
              name="meeting-time"
              className={`rounded ${darkMode ? "bg-college-navy text-white" : "bg-white text-blue-500"}`}
              style={{ border: '2px Solid Black' }}
              value={attendanceDate}
              onChange={(e) => setAttendanceDate(e.target.value)}
              required
            />
          </div>
        </div>
      </div>
      <div className={`max-w-7xl my-2 mx-auto p-5 ${darkMode ? "bg-college-navy" : "bg-white"}`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        { selectedCourse && (
          <div className='flex justify-start'>
            <h3 className={`m-0 font-medium text-base ${darkMode ? "text-white" : "text-blue-500"}`}>All Student in {selectedCourse.name} Class</h3>
          </div>
        )} 
          <div className='flex justify-start'>
            {/* <label for="meeting-time">Choose a time for your appointment:</label> */}
              <h3 className={`m-0 font-medium text-base ${darkMode ? "text-red-400" : "text-red-500"}`}>Note: <em>Click on the checkboxes beside each student to take attendance!</em></h3>
          </div>
        </div>
        {error && <div className="error my-2">{error}</div>}
        {successMessage && <div className="success my-2">{successMessage}</div>}
        
        
  {/* Add the Select All and Deselect All buttons here */}
  <div className="flex justify-start gap-4 mb-4">
    <button
      className="text-white bg-green-700 hover:bg-green-800 font-medium rounded-lg text-sm px-5 py-2.5"
      onClick={handleSelectAll}
    >
      Select All
    </button>
    <button
      className="text-white bg-red-700 hover:bg-red-800 font-medium rounded-lg text-sm px-5 py-2.5"
      onClick={handleDeselectAll}
    >
      Deselect All
    </button>
  </div>
        


        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead className={`${darkMode ? "bg-gray-900" : "bg-blue-300"}`}>
              <tr className="border-b">
                <th className={`py-2 px-4 text-left text-sm font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>ID</th>
                <th className={`py-2 px-4 text-left text-sm font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>Student Reg</th>
                <th className={`py-2 px-4 text-left text-sm font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>Student Name</th>
                <th className={`py-2 px-4 text-left text-sm font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>CheckBox</th>
              </tr>
            </thead>
            <tbody>

              {students.map((student,iterator) => (
                <tr key={student.student_registration}>
                  <td className={`py-2 px-4 text-sm font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>{iterator+1}</td>
                  <td className={`py-2 px-4 text-sm font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>{student.student_registration}</td>
                  <td className={`py-2 px-4 text-sm font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>{student.student_name}</td>
                  <td className='py-2 text-sm font-medium text-gray-700'>
                    <input type="checkbox"   id={`choose-me-${student.student_registration}`}
  checked={selectedStudents[student.student_registration] === "Present"}
  onChange={() => handleCheckboxChange(student.student_registration)}
                      className="hidden peer" />
                    <label
                        htmlFor={`choose-me-${student.student_registration}`}
                      style={{ width: 120 }}
                      className={`select-none cursor-pointer flex items-center justify-center rounded-lg border-2 border-gray-200 py-3 font-bold transition-colors duration-200 ease-in-out peer-checked:bg-gray-200 peer-checked:text-gray-900 peer-checked:border-gray-200 ${darkMode ? "text-gray-100" : "text-gray-700" }`}
                    >
                      <span>{selectedStudents[student.student_registration] === "Present" ? "Present" : "Absent"}</span>
                    </label>              
                  </td>
                </tr>
              ))}
            </tbody>
          </table>  
          <button className="text-white my-5 bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Submitting...' : 'Take Attendance'}
          </button>
        </div>
      </div>
    </>
  )
}

export default TakeAttendance;
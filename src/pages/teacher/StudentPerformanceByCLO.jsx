import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { useDarkMode } from "../../context/DarkModeContext";

const StudentPerformanceByCLO = () => {
    const { user, token } = useContext(AuthContext);
    const { darkMode } = useDarkMode();
    const { courseId, cloId } = useParams();
    const [performanceData, setPerformanceData] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchPerformanceData = async () => {
            if (user && token) {
                try {
                    const response = await axios.get(
                        `http://localhost:5000/api/teacher/course/${courseId}/studentclo/clo/${cloId}/`,
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                    setPerformanceData(response.data);
                } catch (err) {
                    setError("Failed to fetch student performance data.");
                }
            }
        };
        fetchPerformanceData();
    }, [user, token, courseId, cloId]);

    // Extract the CLO name from the first entry in performanceData
    const cloName = performanceData.length > 0 ? performanceData[0].cloPerformance[0].clo_name : '';


    return (
        <div className={`max-w-7xl mx-auto p-6 mt-4 ${darkMode ? "bg-college-navy text-white" : "bg-white text-gray-900"}`}>
            {/* Display the CLO name only once */}
            {performanceData.length > 0 && (
                <div className="flex justify-between items-center mb-6">
                    <h6 className="m-0 font-medium text-base text-blue-500">
                        Student Record Against ({cloName}) CLO
                    </h6>
                </div>
            )}

            <div className="overflow-x-auto">
                <table className="min-w-full table-auto">
                    <thead>
                        <tr className="border-b">
                            {["ID", "CLO Name", "Student Name", "Total Obtained Marks", "Total Possible Marks", "Performance (%)"].map((header) => (
                                <th key={header} className={`py-2 px-4 text-left text-sm font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {performanceData.map((student, index) => (
                            student.cloPerformance.map((clo) => (
                                <tr key={`${student.student_id}-${clo.clo_id}`} className="border-b">
                                    <td className={`py-2 px-4 text-sm ${darkMode ? "text-white" : "text-gray-700"}`}>{index + 1}</td>
                                    <td className={`py-2 px-4 text-sm ${darkMode ? "text-white" : "text-gray-700"}`}>{clo.clo_name}</td>
                                    <td className={`py-2 px-4 text-sm ${darkMode ? "text-white" : "text-gray-700"}`}>{student.student_name}</td>
                                    <td className={`py-2 px-4 text-sm ${darkMode ? "text-white" : "text-gray-700"}`}>{clo.totalObtained}</td>
                                    <td className={`py-2 px-4 text-sm ${darkMode ? "text-white" : "text-gray-700"}`}>{clo.totalPossible}</td>
                                    <td className={`py-2 px-4 text-sm ${darkMode ? "text-white" : "text-gray-700"}`}>{clo.performancePercentage}%</td>                        
                                </tr>
                            ))
                        ))}                            
                    </tbody>
                </table>    
            </div>
        </div>
    );
};

export default StudentPerformanceByCLO;

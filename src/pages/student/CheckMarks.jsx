import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { useDarkMode } from "../../context/DarkModeContext";
import { DarkMode } from "@mui/icons-material";


const CheckMarks = () => {
    const { user, token } = useContext(AuthContext);
    const { darkMode, setDarkMode } = useDarkMode();
    const { courseId } = useParams();
    const [error, setError] = useState("");
    const [marks, setMarks] = useState([]);

    useEffect(() => {
        const fetchMarks = async () => {
            if (user && token && courseId) {
                try {
                    const response = await axios.post(
                        `https://fess-backend-6787.onrender.com/api/student/course/${courseId}/marks`,
                        { studentID: user.id },
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );

                    setMarks(response.data);
                } catch (err) {
                    console.error("Error fetching data:", err);
                    setError("Error fetching data. Please try again.");
                }
            }
        };
        fetchMarks();
    }, [user, courseId, token]);

    return (
        <div className={`max-w-7xl mx-auto p-6 ${darkMode ? "bg-college-navy" : "bg-white text-gray-900"}`}>
            {error && <div className="error my-2">{error}</div>}
            {marks.length === 0 ? (
                <div className="overflow-x-auto">
                    <table className="min-w-full table-auto">
                        <thead>
                            <tr className="border-b">
                                <th className={`py-2 px-4 text-left text-sm font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>Sr</th>
                                <th className={`py-2 px-4 text-left text-sm font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>Reg No</th>
                                <th className={`py-2 px-4 text-left text-sm font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>Name</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td colSpan="3" className="py-2 px-4 error text-sm text-center">
                                    No Marks Record Found
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full table-auto">
                        <thead>
                            <tr className="border-b">
                                <th className={`py-2 px-4 text-left text-sm font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>Sr</th>
                                <th className={`py-2 px-4 text-left text-sm font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>Reg No</th>
                                <th className={`py-2 px-4 text-left text-sm font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>Name</th>
                                {/* Dynamically render sessional headers */}
                                {marks.length > 0 &&
                                    marks[0].marks.map((sessional) => (
                                        <th key={sessional.type} className={`py-2 px-4 text-left text-sm font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>
                                            {sessional.type} ({sessional.total})
                                        </th>
                                    ))}
                                <th className={`py-2 px-4 text-left text-sm font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>
                                    Total Obtained Marks
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {marks.map((data, index) => {
                                const totalObtainedMarks = data.marks.reduce((sum, sessional) => sum + (sessional.obtained || 0), 0);
                                const totalMarks = data.marks.reduce((sum, sessional) => sum + (sessional.total || 0), 0);
                                return (
                                    <tr key={data.reg} className="border-b">
                                        <td className={`py-2 px-4 text-sm font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>{index + 1}</td>
                                        <td className={`py-2 px-4 text-sm font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>{data.reg}</td>
                                        <td className={`py-2 px-4 text-sm font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>{data.name}</td>
                                        {/* Display student marks */}
                                        {data.marks.map((sessional) => (
                                            <td key={sessional.type} className={`py-2 px-4 text-sm font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>
                                                {sessional.obtained}/{sessional.total}
                                            </td>
                                        ))}
                                        {/* Display total obtained marks */}
                                        <td className={`py-2 px-4 text-sm font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>
                                            {totalObtainedMarks}/{totalMarks}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default CheckMarks;

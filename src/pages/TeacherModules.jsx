// Header.js
import React from "react";
import { useDarkMode } from "../context/DarkModeContext";
// import AdminDashboard from "../assets/AdminDashboard.png";
// import AdminBackground from "../assets/AdminBackground.png"
// import AdminDashboardEdited from "../assets/AdminDashboardEdited.jpg"
// import TeacherDashboardEdited from "../assets/TeacherDashboardEdited.jpg"
// import StudentDashboardEdited from "../assets/StudentDashboardEdited.jpg"


import "../App.css";
import { DarkMode } from "@mui/icons-material";

const TeacherModules = () => {
    const { darkMode } = useDarkMode();
    return (
        <>
        {/* Teacher Modules */}
        <section id="TeacherModules" className="py-20 text-center">
            <h2 className="text-3xl font-semibold mb-6">Teacher Modules</h2>
            <p className={`text-lg mb-8 ${darkMode ? "text-white" : "text-gray-600"}`}>Empower teachers with tools for efficient course management.</p>        
            <div className="flex justify-center mb-6">
                <img src={TeacherDashboardEdited} alt="Teacher Dashboard" className="w-full max-w-3xl shadow-lg rounded-lg" />
            </div>
            <ul className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
                <li className={`p-4 rounded-lg transition duration-300 shadow 
                    ${darkMode ? "bg-dallas-cowboys-blueMain text-white hover:bg-blue-800" 
                            : "bg-gray-100 text-gray-900 hover:bg-gray-300"}`}>
                    Manage Courses 
                </li>
                <li className={`p-4 rounded-lg transition duration-300 shadow 
                    ${darkMode ? "bg-dallas-cowboys-blueMain text-white hover:bg-blue-800" 
                            : "bg-gray-100 text-gray-900 hover:bg-gray-300"}`}>
                    Take Attendance
                </li>
                <li className={`p-4 rounded-lg transition duration-300 shadow 
                    ${darkMode ? "bg-dallas-cowboys-blueMain text-white hover:bg-blue-800" 
                            : "bg-gray-100 text-gray-900 hover:bg-gray-300"}`}>
                    Upload Study Materials
                </li>
                <li className={`p-4 rounded-lg transition duration-300 shadow 
                    ${darkMode ? "bg-dallas-cowboys-blueMain text-white hover:bg-blue-800" 
                            : "bg-gray-100 text-gray-900 hover:bg-gray-300"}`}>
                    Create Assessment
                </li>
                <li className={`p-4 rounded-lg transition duration-300 shadow 
                    ${darkMode ? "bg-dallas-cowboys-blueMain text-white hover:bg-blue-800" 
                            : "bg-gray-100 text-gray-900 hover:bg-gray-300"}`}>
                    Map Clo with Assessment
                </li>
                <li className={`p-4 rounded-lg transition duration-300 shadow 
                    ${darkMode ? "bg-dallas-cowboys-blueMain text-white hover:bg-blue-800" 
                            : "bg-gray-100 text-gray-900 hover:bg-gray-300"}`}>
                    Upload Assessment Results
                </li>
                <li className={`p-4 rounded-lg transition duration-300 shadow 
                    ${darkMode ? "bg-dallas-cowboys-blueMain text-white hover:bg-blue-800" 
                            : "bg-gray-100 text-gray-900 hover:bg-gray-300"}`}>
                    Generate Questions from Files
                </li>
                <li className={`p-4 rounded-lg transition duration-300 shadow 
                    ${darkMode ? "bg-dallas-cowboys-blueMain text-white hover:bg-blue-800" 
                            : "bg-gray-100 text-gray-900 hover:bg-gray-300"}`}>
                    Download a Question Paper
                </li>                                
            </ul>
        </section>    
        
        </>
    )
}

export default TeacherModules
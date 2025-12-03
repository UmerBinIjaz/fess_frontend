// Header.js
import React from "react";
import { useDarkMode } from "../context/DarkModeContext";
// // import AdminDashboard from "../assets/AdminDashboard.png";
// import AdminBackground from "../assets/AdminBackground.png"
// // import AdminDashboardEdited from "../assets/AdminDashboardEdited.jpg"
// import TeacherDashboardEdited from "../assets/TeacherDashboardEdited.jpg"
// import StudentDashboardEdited from "../assets/StudentDashboardEdited.jpg"


import "../app.css";
import { DarkMode } from "@mui/icons-material";
const AdminModules = () => {
    const { darkMode } = useDarkMode();
    return (
        <>
        <section id="AdminModules" className="py-20 text-center">
            <h2 className="text-3xl font-semibold mb-6">Admin Modules</h2>
            <p className={`text-lg mb-8 ${darkMode ? "text-white" : "text-gray-600"}`}>Manage students, Candidates, Students, and voting records.</p>
            {/* <div className="flex justify-center mb-6">
                <img src={AdminDashboardEdited} alt="Admin Dashboard" className="w-full max-w-3xl shadow-lg rounded-lg" />
            </div>         */}
            <ul className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
                <li className={`p-4 rounded-lg transition duration-300 shadow 
                    ${darkMode ? "bg-dallas-cowboys-blueMain text-white hover:bg-blue-800" 
                            : "bg-gray-100 text-gray-900 hover:bg-gray-300"}`}>
                    Create a Student Account
                </li>
                <li className={`p-4 rounded-lg transition duration-300 shadow 
                    ${darkMode ? "bg-dallas-cowboys-blueMain text-white hover:bg-blue-800" 
                            : "bg-gray-100 text-gray-900 hover:bg-gray-300"}`}>
                    Bulk Import to create Student Accounts
                </li>                
                <li className={`p-4 rounded-lg transition duration-300 shadow 
                    ${darkMode ? "bg-dallas-cowboys-blueMain text-white hover:bg-blue-800" 
                            : "bg-gray-100 text-gray-900 hover:bg-gray-300"}`}>
                    Manage Candidates
                </li>                
                <li className={`p-4 rounded-lg transition duration-300 shadow 
                    ${darkMode ? "bg-dallas-cowboys-blueMain text-white hover:bg-blue-800" 
                            : "bg-gray-100 text-gray-900 hover:bg-gray-300"}`}>
                    Download Voting Records
                </li>
            </ul>
        </section>


        </>
    )
}

export default AdminModules
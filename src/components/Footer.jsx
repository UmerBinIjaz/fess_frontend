import React from "react";
import { useDarkMode } from "../context/DarkModeContext";
// import AdminDashboard from "../assets/AdminDashboard.png";
// import AdminBackground from "../assets/AdminBackground.png"
// import AdminDashboardEdited from "../assets/AdminDashboardEdited.jpg"
// import TeacherDashboardEdited from "../assets/TeacherDashboardEdited.jpg"
// import StudentDashboardEdited from "../assets/StudentDashboardEdited.jpg"


import "../App.css";
import { DarkMode } from "@mui/icons-material";

const Footer = () => {
    const { darkMode } = useDarkMode();
    return (
        <>
        
        <footer class={` py-4 text-center shadow ${darkMode ? "dallas-cowboys-blueMain text-white" : "bg-gray-300 text-dark"}`}>
            <div class="container mx-auto px-4 sm:px-8 lg:grid lg:grid-cols-1 lg:gap-x-8">
                <span class={`text-sm text-gray-500 sm:text-center ${darkMode ? "text-gray-200" : "text-gray-700"}`}>Developed By Umer Bin Ijaz.
                </span>
            </div>
        </footer>    
        </>
    )
}

export default Footer
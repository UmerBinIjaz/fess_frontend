import React, { useState, useEffect } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
import { useDarkMode } from "../../../context/DarkModeContext";
import { Moon, Sun } from "lucide-react";

const Layout = () => {
  const { darkMode, setDarkMode } = useDarkMode();  
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  // Apply dark mode styling to the <body> tag and ensure full height
  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
    document.body.classList.add("h-screen", "overflow-hidden"); // Ensure body takes full height
  }, [darkMode]);


  return (
    <>
      <Sidebar isSidebarOpen={isSidebarOpen}/>
      <div
        className={`relative md:ml-64 transition-all duration-300 flex flex-col h-screen ${
          darkMode ? "bg-dallas-cowboys-blue" : "text-black"
        }`}
      >
        <Header toggleSidebar={toggleSidebar}/>
        <div className="md:px-4 mx-auto w-full flex-grow overflow-y-auto"  style={{ paddingTop: 10}}>
          <Outlet />
          {/* Dark Mode Toggle Button - Bottom Right */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="fixed bottom-4 right-4 p-3 rounded-full bg-gray-200 dark:bg-gray-800 shadow-lg transition"
          >
            {darkMode ? <Sun className="w-6 h-6 text-white" /> : <Moon className="w-6 h-6 text-gray-900" />}
          </button>


        </div>
      </div>
    </>
    // <div className="flex flex-col h-screen">
    //   {/* Header */}
    //   <Header toggleSidebar={toggleSidebar} />

    //   <div className="flex flex-1 overflow-hidden">
    //     {/* Sidebar */}
    //     <Sidebar isSidebarOpen={isSidebarOpen} />
        
    //     {/* Main Content */}
    //     <main className="flex-1 p-6 bg-gray-100 overflow-y-auto">
    //       <Outlet />
    //     </main>
    //   </div>
    // </div>
  );
};

export default Layout;

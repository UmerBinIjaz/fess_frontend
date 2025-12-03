import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, Outlet, useLocation } from 'react-router-dom';
import { FaUser, FaBars, FaTimes, FaUserCircle, FaEdit, FaEnvelope } from 'react-icons/fa';
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { AuthContext } from '../../../context/AuthContext';
import axios from 'axios'; // Ensure axios is imported
import { useDarkMode } from "../../../context/DarkModeContext";
import { DarkMode } from "@mui/icons-material";

import './Sidebar.css';

const Sidebar = ({ isSidebarOpen }) => {
  const { courseId } = useParams();
  const { user, token } = useContext(AuthContext);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);  // Track the selected course
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [listdropdownOpen, setlistDropdownOpen] = useState(true);
  const [collapseShow, setCollapseShow] = useState("hidden");
  const { darkMode, setDarkMode } = useDarkMode();  

  const location = useLocation();
  
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const listtoggleDropdown = () => {
    setlistDropdownOpen(!listdropdownOpen);
  };



  const isStudentCoursePage = location.pathname.includes(`/student/course/${courseId}`);
  const getActiveClass = (path) => (location.pathname === path ? 'text-blue-500' : 'text-gray-500');

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownOpen && !event.target.closest('.menu') && !event.target.closest('#menu-button')) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [dropdownOpen]);

  return (
    <>
      <nav className={`md:left-0 md:block md:fixed md:top-0 md:bottom-0 md:overflow-y-auto 
        md:flex-row md:flex-nowrap shadow-xl flex flex-wrap items-center justify-between 
        relative md:w-64 z-10 py-4 px-6 transition-all duration-300 
        ${darkMode ? "bg-college-navy text-white" : "bg-white text-gray-900"}`}>
        <div className="md:flex-col md:items-stretch md:min-h-full px-0 flex flex-wrap items-center justify-between w-full mx-auto">
          <button className={`cursor-pointer md:hidden px-3 py-1 text-xl leading-none bg-transparent rounded ${darkMode ? "text-white" : "text-gray-700"}`} type="button" onClick={() => setCollapseShow("bg-white m-2 py-3 px-6")}>
            <FaBars />
          </button>
          <Link className="md:block text-left text-blueGray-600 mr-0 inline-block whitespace-nowrap text-sm uppercase font-bold p-4 px-0" to="/"> Fess Voting System </Link>
          
          <ul className="md:hidden">
            <li className="inline-block relative">
              <button type="button" className="profile rounded-md text-dark bg-dark-purple-300 dark:bg-slate-600 dark:text-white duration-300" onClick={toggleDropdown} id="menu-button" aria-expanded={dropdownOpen} aria-haspopup="true">
                <FaUser className="text-xl" />
              </button>
              <div className={`menu ${dropdownOpen ? 'block' : 'hidden'}`} role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabIndex="-1">
                <h3>{user?.name}<br /><span>{user?.email}</span></h3>
                <div className="py-1" role="none">
                  <Link to="/student/profile" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"> <FaUserCircle className="mr-3 text-xl" /> My Profile </Link>
                  <Link to="/student/edit-profile" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"> <FaEdit className="mr-3 text-xl" /> Edit Profile </Link>
                  <Link to="/student/logout" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"> <FaEnvelope className="mr-3 text-xl" /> Logout </Link>
                </div>
              </div>
            </li>
          </ul>

          {/* Collapse */}
          <div className={`md:flex md:flex-col md:items-stretch md:opacity-100 md:relative md:mt-4 absolute top-0 left-0 right-0 z-40 overflow-y-auto overflow-x-hidden h-auto items-center flex-1 rounded ${collapseShow} ${darkMode ? "bg-college-navy !important text-white" : "bg-white text-gray-900"}`}>
            <div className="md:min-w-full md:hidden block pb-4 mb-4 ">
              <div className="flex flex-wrap">
                <div className="w-6/12">
                  <Link className="md:block text-left md:pb-2 text-blueGray-600 mr-0 inline-block whitespace-nowrap text-sm uppercase font-bold p-4 px-0" to="/"> Fess Voting System </Link>
                </div>
                <div className="w-6/12 flex justify-end">
                  <button type="button" className={`cursor-pointer md:hidden px-3 py-1 text-xl leading-none bg-transparent rounded ${darkMode ? "text-white" : "text-gray-700"}`} onClick={() => setCollapseShow("hidden")}>
                    <FaTimes />
                  </button>
                </div>
              </div>
            </div>

            <hr className="my-1 md:w-full" />

            <ul className="rounded-md z-10 w-full">
              <li className="items-center">
                <Link to="/student/" className={`text-xs uppercase py-3 font-bold block ${darkMode ? location.pathname === "/student/" ? "text-blue-300" : "text-white" : getActiveClass("/student/")}`}> Dashboard </Link>
              </li>
            </ul>

            <ul className="rounded-md z-10 w-full">
              <li className="items-center">
                <Link to="/student/cast-vote" className={`text-xs uppercase py-3 font-bold block ${darkMode ? location.pathname === "/student/cast-vote" ? "text-blue-300" : "text-white" : getActiveClass("/student/cast-vote")}`}> Cast Vote </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Sidebar;

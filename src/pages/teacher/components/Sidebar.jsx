import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, Outlet, useLocation } from 'react-router-dom';
// import { useParams, Link, Outlet } from 'react-router-dom';
import { FaUser, FaBars, FaTimes, FaUserCircle, FaEdit, FaEnvelope } from 'react-icons/fa';
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { AuthContext } from '../../../context/AuthContext';
import axios from 'axios'; // Ensure axios is imported
import { useDarkMode } from "../../../context/DarkModeContext";

import './Sidebar.css';

const Sidebar = ({ isSidebarOpen }) => {
  const { courseId, sessionalId } = useParams();
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

  // Check if the current URL includes the courseId, and if so, display the course in the sidebar
  const isTeacherCoursePage = location.pathname.includes(`/teacher/course/${courseId}`);
  const getActiveClass = (path) => (location.pathname === path ? 'text-blue-500' : 'text-gray-500');

  // const getActiveClass = (paths) => {
  //   // Ensure paths is an array. If it's a single string, convert it into an array.
  //   const pathArray = Array.isArray(paths) ? paths : [paths];
  
  //   return pathArray.some(path => location.pathname.startsWith(path)) ? "text-blue-500" : "text-gray-500";
  // };
  

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

  // Check if current URL matches the teacher course page
  // const isTeacherCoursePage = window.location.href.includes(`/teacher/course/${courseId}`);


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
          <Link className="md:block text-left text-blueGray-600 mr-0 inline-block whitespace-nowrap text-sm uppercase font-bold p-4 px-0" to="/"> Info Tech Classroom </Link>
          
          <ul className="md:hidden">
            <li className="inline-block relative">
              <button type="button" className="profile rounded-md text-dark bg-dark-purple-300 dark:bg-slate-600 dark:text-white duration-300" onClick={toggleDropdown} id="menu-button" aria-expanded={dropdownOpen} aria-haspopup="true">
                <FaUser className="text-xl" />
              </button>
              <div className={`menu ${dropdownOpen ? 'block' : 'hidden'}`} role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabIndex="-1">
                <h3>{user?.name}<br /><span>{user?.email}</span></h3>
                <div className="py-1" role="none">
                  <Link to="/teacher/profile" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"> <FaUserCircle className="mr-3 text-xl" /> My Profile </Link>
                  <Link to="/teacher/edit-profile" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"> <FaEdit className="mr-3 text-xl" /> Edit Profile </Link>
                  <Link to="/teacher/logout" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"> <FaEnvelope className="mr-3 text-xl" /> Logout </Link>
                </div>
              </div>
            </li>
          </ul>

          {/* Collapse */}
          <div className={`md:flex md:flex-col md:items-stretch md:opacity-100 md:relative md:mt-4 absolute top-0 left-0 right-0 z-40 overflow-y-auto overflow-x-hidden h-auto items-center flex-1 rounded ${collapseShow} ${darkMode ? "bg-college-navy !important text-white" : "bg-white text-gray-900"}`}>
            <div className="md:min-w-full md:hidden block pb-4 mb-4 ">
              <div className="flex flex-wrap">
                <div className="w-6/12">
                  <Link className="md:block text-left md:pb-2 text-blueGray-600 mr-0 inline-block whitespace-nowrap text-sm uppercase font-bold p-4 px-0" to="/"> Info Tech Classroom </Link>
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
                <Link to="/teacher/" className={`text-xs uppercase py-3 font-bold block ${darkMode ? location.pathname === "/teacher/" ? "text-blue-300" : "text-white" : getActiveClass("/teacher/")}`}> Dashboard </Link>
              </li>
            </ul>

            <ul className="rounded-md z-10 w-full">
              <li className="items-center">
                <Link to="/teacher/courses/" className={`text-xs uppercase py-3 font-bold block ${darkMode ? location.pathname === "/teacher/courses/" ? "text-blue-300" : "text-white" : getActiveClass("/teacher/courses/")}`}> Courses </Link>
              </li>
            </ul>

            <hr className="my-4 md:min-w-full" />
            
            {/* Show Admin Layout Pages dropdown only if the teacher has courses */}
            {/* Conditionally render the selected course if available */}
            {/* {isTeacherCoursePage && selectedCourse && (
              <div className="text-blueGray-500 text-xs uppercase font-bold block pt-1 pb-4">
                <h3>{selectedCourse.name}</h3>
                <h5>{selectedCourse.class_code}</h5>
              </div>
            )} */}

            {/* Show Admin Layout Pages dropdown only if the teacher has courses */}
            {isTeacherCoursePage && selectedCourse && (
              <h3
                style={{ cursor: "pointer" }}
                onClick={listtoggleDropdown}
                className="md:min-w-full text-blueGray-500 text-xs uppercase font-bold block pt-1 pb-4 no-underline focus:outline-none"
              >
                {selectedCourse.name}{" "}
                {listdropdownOpen ? <FaChevronUp className="inline ml-2" /> : <FaChevronDown className="inline ml-2" />}
              </h3>
            )}

            {listdropdownOpen && isTeacherCoursePage && selectedCourse && (
              <ul className={`dropdown ${listdropdownOpen ? "open" : ""} rounded-md mt-2 z-10 w-full`}>
              
                {/* mappedClos */}

                <li className="items-center">
                  {/* <Link className={`text-xs uppercase py-3 font-bold block ${getActiveClass(`/student/course/${courseId}/check-files/`)}`} to={`/student/course/${courseId}/check-files/`}> */}
                  <Link className={`text-xs uppercase py-3 font-bold block ${darkMode ? location.pathname === `/teacher/course/${courseId}/mappedClos/` ? "text-blue-300" : "text-white" : getActiveClass(`/teacher/course/${courseId}/mappedClos/`)}`} to={`/teacher/course/${courseId}/mappedClos/`}>
                    Mapped Clos
                  </Link>
                </li>                
                              
                
              
                <li className="items-center">
                  {/* <Link className={`text-xs uppercase py-3 font-bold block ${getActiveClass(`/student/course/${courseId}/check-files/`)}`} to={`/student/course/${courseId}/check-files/`}> */}
                  <Link className={`text-xs uppercase py-3 font-bold block ${darkMode ? location.pathname === `/teacher/course/${courseId}/MapClosAssessment/` ? "text-blue-300" : "text-white" : getActiveClass(`/teacher/course/${courseId}/MapClosAssessment/`)}`} to={`/teacher/course/${courseId}/MapClosAssessment/`}>
                    Map Clos Assessment
                  </Link>
                </li>   

              <li className="items-center">
                <Link
                  className={`text-xs uppercase py-3 font-bold block ${darkMode ? location.pathname === `/teacher/course/${courseId}/Marks-Distributions/` ? "text-blue-300" : "text-white" : getActiveClass(`/teacher/course/${courseId}/Marks-Distributions/`)}`} to={`/teacher/course/${courseId}/Marks-Distributions/`}
                >
                  Marks Distributions
                </Link>
              </li>


{/* 
                <li className="items-center">
                  <Link className={`text-xs uppercase py-3 font-bold block `} to={`/teacher/course/${courseId}/AddStudentMarks/${sessionalId}/`}>
                    Marks Distributions
                  </Link>
                </li> */}
                <li className="items-center">
                  <Link className={`text-xs uppercase py-3 font-bold block ${darkMode ? location.pathname === `/teacher/course/${courseId}/upload-file/` ? "text-blue-300" : "text-white" : getActiveClass(`/teacher/course/${courseId}/upload-file/`)}`} to={`/teacher/course/${courseId}/upload-file/`}>
                    Files
                  </Link>
                </li>
                <li className="items-center">
                  <Link className={`text-xs uppercase py-3 font-bold block ${darkMode ? location.pathname === `/teacher/course/${courseId}/take-attendance/` ? "text-blue-300" : "text-white" : getActiveClass(`/teacher/course/${courseId}/take-attendance/`)}`} to={`/teacher/course/${courseId}/take-attendance/`}>
                    Take Attendance
                  </Link>
                </li>
                <li className="items-center">
                  <Link className={`text-xs uppercase py-3 font-bold block ${darkMode ? location.pathname === `/teacher/course/${courseId}/generate-attendance/` ? "text-blue-300" : "text-white" : getActiveClass(`/teacher/course/${courseId}/generate-attendance/`)}`} to={`/teacher/course/${courseId}/generate-attendance/`}>
                    Generate Attendance
                  </Link>
                </li> 
                <li className="items-center">
                  <Link className={`text-xs uppercase py-3 font-bold block ${darkMode ? location.pathname === `/teacher/course/${courseId}/generate-question-papers/` ? "text-blue-300" : "text-white" : getActiveClass(`/teacher/course/${courseId}/generate-question-papers/`)}`} to={`/teacher/course/${courseId}/generate-question-papers/`}>
                    Generate Question Papers
                  </Link>
                </li>                
              </ul>
            )}

          </div>
        </div>
      </nav>
    </>
  );
};

export default Sidebar;

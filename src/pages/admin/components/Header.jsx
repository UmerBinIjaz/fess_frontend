import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { useDarkMode } from "../../../context/DarkModeContext";
import { DarkMode } from "@mui/icons-material";

import {
  FaUser,
  FaUserCircle,
  FaEdit,
  FaEnvelope,
  FaCog,
  FaQuestionCircle,
  FaBars,
} from 'react-icons/fa';

import './Header.css';
import { AuthContext } from '../../../context/AuthContext';

const Header = ({ toggleDarkMode, toggleSidebar }) => {
  const { user } = useContext(AuthContext); // Get user data from AuthContext
  const [dropdownOpen, setDropdownOpen] = useState(false);
  // const { darkMode } = useDarkMode();
  const { darkMode, setDarkMode } = useDarkMode();  

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownOpen &&
        !event.target.closest('.menu') &&
        !event.target.closest('#menu-button')
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [dropdownOpen]);

  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <header
    className={`hidden md:flex p-4 pr-9 justify-between items-center ${darkMode ? "bg-college-navy text-white" : "bg-white text-gray-900"}`}
     
    >
      <h1 className={`text-lg font-bold ${darkMode ? "text-white" : "text-gray-600"}`}>My App</h1>
      {/* Sidebar Toggle */}

      <div className={ `action relative inline-block text-left ${darkMode ? "bg-college-navy text-white" : "bg-white text-gray-900"}`}>
        <button
          className="sm:hidden mr-4"
          style={{ color: '#262824' }}
          onClick={(e) => e.preventDefault()} // Make sure this is passed as a prop and works
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5m-16.5 5.25h16.5m-16.5 5.25h16.5"
            />
          </svg>
        </button>


        {/* Button */}
        <button
          type="button"
          className={`profile rounded-md text-dark`}

          onClick={toggleDropdown}
          id="menu-button"
          aria-expanded={dropdownOpen}
          aria-haspopup="true"
        >
          <FaUser className="text-xl" />
        </button>

        {/* Dropdown Menu */}
        <div
          className={`menu ${dropdownOpen ? 'show' : ''} `}
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
          tabIndex="-1"
          
        >
          <h3>
            {user?.name}
            <br />
            <span>{user?.email}</span>
          </h3>
          <div className="py-1" role="none">
            {/* <Link
              to="/admin/profile"
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              role="menuitem"
              tabIndex="-1"
              id="menu-item-0"
            >
              <FaUserCircle className="mr-3 text-xl" />
              My Profile
            </Link>
            <Link
              to="/admin/edit-profile"
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              role="menuitem"
              tabIndex="-1"
              id="menu-item-1"
            >
              <FaEdit className="mr-3 text-xl" />
              Edit Profile
            </Link> */}
            <Link
              to="/admin/logout"
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              role="menuitem"
              tabIndex="-1"
              id="menu-item-5"
            >
              <FaEnvelope className="mr-3 text-xl" />
              Logout
            </Link>
          </div>
        </div>

      </div>
    </header>
  );
};

export default Header;

// Header.js
import React from "react";
import { useDarkMode } from "../context/DarkModeContext";
import Fazaia from "../assets/Fazaia.jpg";


import "../App.css";
import { DarkMode } from "@mui/icons-material";



const Header = () => {
  const { darkMode } = useDarkMode();

  
  return (
    <>
      {/* Hero Section */}
      <header
        className="header py-28 text-center md:pt-36 lg:text-left xl:pt-44 xl:pb-32"
      >
        <div className="container mx-auto px-4 sm:px-8 lg:grid lg:grid-cols-2 lg:gap-x-8">
          <div className="mb-16 lg:mt-32 xl:mt-40 xl:mr-12">
            <h1 className="text-4xl font-bold mb-5">
              Welcome to Fees Voting System
            </h1>
            {/* <p className={'text-lg text-gray-600 mb-8 {${darkMode ? "" : ""}}> */}
            <p className={`text-lg mb-8 ${darkMode ? "text-white" : "text-gray-600"}`}>
              A complete voting system for students to vote for the candidates who wanted to achieve any designation in sports Gala.
            </p>
            <div className="flex justify-center lg:justify-start gap-4">
              <a
                href="#admin-modules"
                className="inline-block px-11 py-4 border border-[#594cda] rounded-[32px] bg-[#594cda] text-white font-semibold text-sm leading-none transition-all duration-200 hover:bg-transparent hover:text-[#594cda]"
              >
                Explore Modules
              </a>
            </div>
          </div>
          <div className="xl:text-right flex justify-center items-center">
            <img
              className="inline"
              src={Fazaia}
              alt="Admin Dashboard"
            />
          </div>
        </div>
      </header>
    </>      
  );
};

export default Header;

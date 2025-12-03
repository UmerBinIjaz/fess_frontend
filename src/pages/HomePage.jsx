import React from 'react';
import Navbar from '../components/Navbar';
import Header from '../components/Header';
// import Header from '../components/Header';
import About from '../components/About';
// import Feature from '../components/Features';
// import DetailOne from '../components/DetailOne';
// import DetailTwo from '../components/DetailTwo';
// import DetailThree from '../components/DetailThree';
import { useDarkMode } from "../context/DarkModeContext";
import "../app.css";
import AdminModules from './AdminModules';
import StudentModules from './StudentModules';
import Footer from '../components/Footer';


function HomePage() {
  const { darkMode } = useDarkMode();

  return (
    <div className={`${darkMode ? "bg-college-navy text-white" : "bg-gray-100 text-gray-900"} min-h-screen`}>
      <Navbar />
      <div className={darkMode ? "bg-college-navy text-white" : "bg-gray-100 text-gray-900"}>
        <Header />
        <AdminModules/>
        <StudentModules/>
      </div>
      <Footer/>       
      
      {/* <About /> */}
      {/* <Navbar />
      <Header />
      <Introduction />
      <Feature />
      <DetailOne />
      <DetailTwo />
      <DetailThree /> */}
    </div>
  );
}

export default HomePage;

import { useDarkMode } from "../context/DarkModeContext";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Moon, Sun, Menu, X } from "lucide-react"; // Icons

const Navbar = () => {
  const { darkMode, setDarkMode } = useDarkMode();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "shadow-md" : ""
      } ${darkMode ? "bg-college-navy" : "bg-gray-100 text-black"}`}
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img
            src="https://flowbite.com/docs/images/logo.svg"
            className="h-8 sm:h-10 mr-2"
            alt="Logo"
          />
          <span className="text-xl font-semibold">Fazaia Education System School</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6">
          <a
            href="#AdminModules"
            className="hover:text-blue-600 font-medium transition delay-150 duration-300 ease-in-out cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById("AdminModules")?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Admin Modules
          </a>

          <a
            href="#StudentModules"
            className="hover:text-blue-600 font-medium transition delay-150 duration-300 ease-in-out cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById("StudentModules")?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Student Modules
          </a>

        </nav>

        {/* Actions (Dark Mode & Sign In) */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-800"
          >
            {darkMode ? <Sun className="w-5 h-5 text-white" /> : <Moon className="w-5 h-5 text-gray-900" />}
          </button>
          <Link
            to="/student/login"
            className="hidden md:inline-block text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5"
          >
            Sign In
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden p-2" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <div className={`${darkMode ? "bg-college-navy" : "bg-gray-100"} absolute top-18 left-0 w-full py-4 shadow-md md:hidden`}>
          <nav className="flex flex-col space-y-4 text-center">
            <a href="#AdminModules" className="block py-2 hover:text-blue-600"   onClick={(e) => { setIsOpen(false); e.preventDefault(); document.getElementById("AdminModules")?.scrollIntoView({ behavior: "smooth" });}}> Admin Modules</a>
            <a href="#TeacherModules" className="block py-2 hover:text-blue-600"   onClick={(e) => { setIsOpen(false); e.preventDefault(); document.getElementById("TeacherModules")?.scrollIntoView({ behavior: "smooth" });}}> Teacher Modules</a>
            <a href="#StudentModules" className="block py-2 hover:text-blue-600"   onClick={(e) => { setIsOpen(false); e.preventDefault(); document.getElementById("StudentModules")?.scrollIntoView({ behavior: "smooth" });}}> Student Modules</a>
            <Link to="/student/login" className="block py-2 bg-blue-700 text-white rounded-lg mx-4 hover:bg-blue-800" onClick={() => setIsOpen(false)}>Sign In</Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;

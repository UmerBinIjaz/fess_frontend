import React from 'react'
import AdminDashboard from "../assets/AdminDashboard.png";


const Hero = () => {
  return (
    <div className='py-28 text-center md:pt-36 lg:text-left xl:pt-44 xl:pb-32'  style={{ backgroundImage: "linear-gradient(rgba(197, 234, 249, 1), rgba(255, 255, 255, 1))" }}>
      <section className="text-center py-12 px-6">
        <h2 className="text-3xl font-bold text-gray-800">Welcome to Info Tech Classroom</h2>
        <p className="text-lg text-gray-600 mt-4">An advanced virtual classroom for managing academic tasks, courses, and student progress efficiently.</p>
        <img src={AdminDashboard} alt="Admin Dashboard" className="mt-6 mx-auto w-3/4 shadow-lg rounded-lg" />
      </section>
    </div>
  )
}

export default Hero
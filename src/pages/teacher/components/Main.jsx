import React from 'react';
import ClassCard from './ClassCard';
// import NotificationBar from './NotificationBar';
import { FaBars, FaHome, FaCalendarAlt, FaFolderOpen, FaTasks, FaArchive, FaCog, FaTimes } from "react-icons/fa";

const Main = () => (
  <main className="flex-1 p-6">
    <div className="bg-blue-100 p-4 rounded-lg flex items-center justify-between">
      <div className="flex items-center">
        <img src="https://placehold.co/64x64" alt="Generative AI for Educators" className="mr-4" />
        <div>
          <h2 className="text-lg font-bold">Introducing Generative AI for Educators</h2>
          <p className="text-sm">
            A two-hour, no-cost online course for K-12 educators. Save time and enhance lesson planning with generative AI.
          </p>
        </div>
      </div>
      <div className="flex items-center">
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg mr-2">Learn more</button>
        <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg">Get started</button>
        <FaTimes className="text-lg ml-4 cursor-pointer" />
      </div>
    </div>
    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
      <ClassCard title="IT-342 Computer Communication" subtitle="Morning" teacher="Tayyaba Khan" color="purple" initial="T" />
      <ClassCard title="CS 102" subtitle="Earth Sciences" teacher="omer aftab" color="teal" initial="O" />
    </div>
  </main>
);

export default Main;

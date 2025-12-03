import React from 'react';
import { FaCalendarAlt, FaFolderOpen } from 'react-icons/fa';

const ClassCard = ({ title, subtitle, teacher, color, initial }) => (
    <div className="bg-white shadow-md rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold">{title}</h3>
          <p className="text-sm text-gray-600">{subtitle}</p>
          <p className="text-sm text-gray-600">{teacher}</p>
        </div>
        <div className={`bg-${color}-500 text-white rounded-full w-10 h-10 flex items-center justify-center text-lg`}>{initial}</div>
      </div>
      <div className="mt-4 flex justify-between">
        <FaCalendarAlt className="text-lg" />
        <FaFolderOpen className="text-lg" />
      </div>
    </div>
  );
  
export default ClassCard;

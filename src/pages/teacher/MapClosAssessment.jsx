import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Select from "react-select";
import { AuthContext } from '../../context/AuthContext';
import { useDarkMode } from "../../context/DarkModeContext";
import { FaEye, FaTrash } from 'react-icons/fa';

const MapClosAssessment = () => {
  const { user, token } = useContext(AuthContext);
  const { darkMode, setDarkMode } = useDarkMode();
  const { courseId } = useParams(); // Fetching courseId from URL params
  const [clos, setCLOs] = useState([]);
  const [selectedCLOs, setSelectedCLOs] = useState([]);
  const [marksDistribution, setMarksDistribution] = useState([]);
  const [selectedMarksDistribution, setSelectedMarksDistribution] = useState(null);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [mappedAssessments, setMappedAssessments] = useState([]); // State for mapped assessments

  // Fetch marks distribution
  useEffect(() => {
    const fetchMarksDistribution = async () => {
      if (user && token) {
        try {
          const response = await axios.get(
            `http://localhost:5000/api/teacher/course/${courseId}/Fetchsessionals/`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setMarksDistribution(
            response.data.map((item) => ({
              value: item.id,
              label: `${item.Sessional_type} - ${item.TotalMarks}`,
            }))
          );
        } catch (error) {
          console.error("Error fetching marks distribution:", error);
        }
      }
    };
    fetchMarksDistribution();
  }, [user, token, courseId]);

  // Fetch CLOs
  useEffect(() => {
    const fetchCLOs = async () => {
      if (user && token) {
          try {
              const response = await axios.get(
                  `http://localhost:5000/api/teacher/course/${courseId}/mapped-clos`,
                  { headers: { Authorization: `Bearer ${token}` } }
              );
              console.log("Fetched CLOs:", response.data); // Log the fetched CLOs
              setCLOs(response.data.map((item) => ({ value: item.id, label: item.name })));
          } catch (err) {
              setError("Failed to fetch CLOs.");
          }
      }
    };
    fetchCLOs();
  }, [user, token, courseId]);

  // Fetch mapped assessments
  useEffect(() => {
    const fetchMappedAssessments = async () => {
      if (user && token) {
        try {
          const response = await axios.get(
            `http://localhost:5000/api/teacher/course/${courseId}/mapped-clo-assessments`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setMappedAssessments(response.data);
        } catch (error) {
          console.error("Error fetching mapped assessments:", error);
        }
      }
    };
    fetchMappedAssessments();
  }, [user, token, courseId]);

  const handleMapCLOs = async () => {
    if (!selectedMarksDistribution || selectedCLOs.length === 0) {
      setError("Please select a marks distribution and at least one CLO.");
      return;
    }
    try {
      await axios.post(
        `http://localhost:5000/api/teacher/course/${courseId}/map-clos-assessment`,
        {
          marks_distribution_id: selectedMarksDistribution.value,
          clo_ids: selectedCLOs.map((clo) => clo.value),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccessMessage("CLOs mapped to marks distribution successfully.");
      setError("");
      setSelectedCLOs([]);
      setSelectedMarksDistribution(null);

      // Refresh the mapped assessments after successful mapping
      const response = await axios.get(
        `http://localhost:5000/api/teacher/course/${courseId}/mapped-clo-assessments`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMappedAssessments(response.data);
    } catch (err) {
      setError("Failed to map CLOs to marks distribution.");
    }
  };

  return (
    <>
      <div className={`max-w-7xl mx-auto p-6 mt-4 ${darkMode ? "bg-college-navy" : "bg-white text-gray-900"}`}> 
        <h2 className="m-0 font-medium text-base text-blue-500">Map CLOs to Marks Distribution</h2>

        {error && <div className="bg-red-100 text-red-600 p-2 rounded-md mb-4">{error}</div>}
        {successMessage && <div className="bg-green-100 text-green-600 p-2 rounded-md mb-4">{successMessage}</div>}

        <div className="mb-4">
          <label className={`block font-medium my-3 ${darkMode ? "text-white" : "text-gray-700"}`}>Select Marks Distribution</label>
          <Select options={marksDistribution} value={selectedMarksDistribution} onChange={setSelectedMarksDistribution} />
        </div>

        <div className="mb-4">
          <label className={`block font-medium my-3 ${darkMode ? "text-white" : "text-gray-700"}`}>Select CLOs</label>
          <Select options={clos} isMulti value={selectedCLOs} onChange={setSelectedCLOs} />
        </div>

        <button onClick={handleMapCLOs} className="bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg text-sm px-6 py-2.5 mt-4">
          Map CLOs
        </button>


      </div>

      <div className={`max-w-7xl mx-auto p-6 mt-4 ${darkMode ? "bg-college-navy" : "bg-white text-gray-900"}`}>
        <div className="flex justify-between items-center mb-6">
          <h6 className="m-0 font-medium text-base text-blue-500">Mapped Clo Assessment</h6>        
        </div> 
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr className='border-b'>
                <th className={`py-2 px-4 text-left text-sm font-bold ${darkMode ? "text-white" : "text-gray-700"}`}>Marks Distribution Name</th>
                <th className={`py-2 px-4 text-left text-sm font-bold ${darkMode ? "text-white" : "text-gray-700"}`}>Course Name</th>
                <th className={`py-2 px-4 text-left text-sm font-bold ${darkMode ? "text-white" : "text-gray-700"}`}>CLO Name</th>
              </tr>
            </thead>
            <tbody>
              {mappedAssessments.map((assessment, index) => (
                <tr key={index} className='border-b'>
                  <td className={`py-2 px-4 text-sm font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>{assessment.marks_distribution_name}</td>
                  <td className={`py-2 px-4 text-sm font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>{assessment.course_name}</td>
                  <td className={`py-2 px-4 text-sm font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>{assessment.clo_name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>  

      </div>

    </>
  );
};

export default MapClosAssessment;
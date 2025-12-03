import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { useDarkMode } from "../../context/DarkModeContext";

const Results = () => {
  const { user, token } = useContext(AuthContext);
  const { darkMode } = useDarkMode();
  const [results, setResults] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await axios.get(
          'https://fess-backend-6787.onrender.com/api/admin/vote-results',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setResults(response.data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch results. Please try again.');
      }
    };

    if (user && token) {
      fetchResults();
    }
  }, [user, token]);

  const renderResultRow = (position, data) => (
    <tr key={position}>
      <td className="py-2 px-4 font-medium">{position}</td>
      <td className="py-2 px-4 font-medium">{data?.name || 'No Votes'}</td>
      <td className="py-2 px-4 font-medium">{data?.votes || 0}</td>
    </tr>
  );

  return (
    <div className={`max-w-5xl mx-auto p-6 ${darkMode ? "bg-college-navy text-white" : "bg-white text-gray-900"}`}>
      <h1 className="text-2xl font-bold mb-4">Election Results</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border border-gray-300">
          <thead>
            <tr className="border-b">
              <th className="py-2 px-4 text-left">Position</th>
              <th className="py-2 px-4 text-left">Winner</th>
              <th className="py-2 px-4 text-left">Votes</th>
            </tr>
          </thead>
          <tbody>
            {results ? Object.keys(results).map((position) =>
              renderResultRow(position.replace(/_/g, ' '), results[position])
            ) : (
              <tr>
                <td colSpan="3" className="py-2 px-4 text-center">No Results Yet</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Results;

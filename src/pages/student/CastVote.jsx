import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { useDarkMode } from "../../context/DarkModeContext";

const CastVote = () => {
  const { user, token } = useContext(AuthContext);
  const { darkMode } = useDarkMode();
  const [candidates, setCandidates] = useState([]);
  const [selected, setSelected] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const res = await axios.get('https://fess-backend-6787.onrender.com/api/student/getCandidates');
        setCandidates(res.data);
      } catch (err) {
        console.error(err);
        setError('Failed to load candidates.');
      }
    };
    fetchCandidates();
  }, []);

  const chooseCandidate = (house, designation, candidate) => {
    setSelected(prev => ({
      ...prev,
      [house]: { ...prev[house], [designation]: candidate.id }
    }));
  };

  const houses = [...new Set(candidates.map(c => c.house_group.toUpperCase()))];

  const getCandidatesByHouseAndDesignation = (house, designation) => {
    return candidates.filter(c =>
      c.house_group.toUpperCase() === house &&
      c.designation.toLowerCase() === designation.toLowerCase()
    );
  };

  const submitVote = async () => {
    if (!user) return alert('You must be logged in to vote!');

    try {
      const response = await axios.post(
        'https://fess-backend-6787.onrender.com/api/student/castVote',
        {
          studentId: user.id,
          votes: selected
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      alert(response.data.message);
      setSelected({});
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || 'Error submitting vote.');
    }
  };

  return (
    <div className={`max-w-6xl mx-auto p-6 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
      {error && <div className="mb-4 text-red-500">{error}</div>}

      {houses.map(house => (
        <div key={house} className="mb-8 border p-4 rounded shadow-sm">
          <h2 className="text-2xl font-bold mb-4">{house} House</h2>

          {['Boys House Captian', 'Boys Vice House Captian', 'Girls House Captian', 'Girls Vice House Captian'].map(designation => (
            <div key={designation} className="mb-4">
              <h3 className="font-semibold mb-2">{designation}</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {getCandidatesByHouseAndDesignation(house, designation).map(c => (
                  <div
                    key={c.id}
                    onClick={() => chooseCandidate(house, designation, c)}
                    className={`p-3 border rounded cursor-pointer hover:shadow-lg ${
                      selected[house]?.[designation] === c.id
                        ? 'bg-blue-400 text-white'
                        : darkMode
                        ? 'bg-gray-700'
                        : 'bg-gray-100'
                    }`}
                  >
                    <h4 className="font-semibold">{c.name}</h4>
                    <p>Reg: {c.reg}</p>
                    <p>Symbol: {c.symbol}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}

      <div className="text-center mt-6">
        <button
          onClick={submitVote}
          className="px-6 py-3 bg-green-500 text-white font-bold rounded hover:bg-green-600"
        >
          Submit Vote
        </button>
      </div>
    </div>
  );
};

export default CastVote;

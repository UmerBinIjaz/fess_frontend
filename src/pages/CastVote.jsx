import React, { useState, useEffect } from "react";
import axios from "axios";

const CastVote = () => {
  const [regSearch, setRegSearch] = useState("");
  const [student, setStudent] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [selected, setSelected] = useState({});
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(false); // remove AuthContext

  // Fetch all candidates once
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/student/getCandidates")
      .then((res) => setCandidates(res.data))
      .catch(() => setError("Failed to load candidates."));
  }, []);

  // Fetch student by registration number
  const fetchStudent = async () => {
    if (!regSearch.trim()) return alert("Enter registration number");

    try {
      const res = await axios.get(
        `http://localhost:5000/api/student/getStudentByReg/${regSearch}`
      );

      if (res.data) {
        setStudent(res.data);
        setError("");
      } else {
        setStudent(null);
        setError("Student not found.");
      }
    } catch (err) {
      setStudent(null);
      setError("Invalid Registration Number");
    }
  };

  const chooseCandidate = (house, designation, candidate) => {
    setSelected((prev) => ({
      ...prev,
      [house]: { ...prev[house], [designation]: candidate.id },
    }));
  };

  const houses = [...new Set(candidates.map((c) => c.house_group.toUpperCase()))];

  const getCandidatesByHouseAndDesignation = (house, designation) => {
    return candidates.filter(
      (c) =>
        c.house_group.toUpperCase() === house &&
        c.designation.toLowerCase() === designation.toLowerCase()
    );
  };

  // Submit vote using student.id NOT login user
  const submitVote = async () => {
    if (!student) return alert("Search student first!");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/student/castVote",
        {
          studentId: student.id,
          votes: selected,
        }
      );

      alert(response.data.message);
      setSelected({});
      setRegSearch("");
      setStudent(null);
    } catch (err) {
      alert(err.response?.data?.error || "Error submitting vote.");
    }
  };

  return (
    <div className={`max-w-6xl mx-auto p-6 ${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"}`}>
      {/* SEARCH AREA */}
      <div className="mb-6 p-4 border rounded shadow">
        <h2 className="text-xl font-bold mb-2">Search Student by Registration</h2>

        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Enter Registration Number"
            value={regSearch}
            onChange={(e) => setRegSearch(e.target.value)}
            className="border p-2 rounded w-full"
          />
          <button
            onClick={fetchStudent}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Search
          </button>
        </div>

        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>

      {/* STUDENT DETAILS */}
      {student && (
        <div className="mb-6 p-4 border rounded shadow bg-green-50">
          <h3 className="text-lg font-bold mb-2">Student Details</h3>
          <p><b>Name:</b> {student.name}</p>
          <p><b>Registration:</b> {student.reg}</p>
          <p><b>Class & Section:</b> {student.class_section}</p>
        </div>
      )}

      {/* SHOW CANDIDATES ONLY IF STUDENT IS FOUND */}
      {student &&
        houses.map((house) => (
          <div key={house} className="mb-8 border p-4 rounded shadow-sm">
            <h2 className="text-2xl font-bold mb-4">{house} House</h2>

            {[
              "Boys House Captian",
              "Boys Vice House Captian",
              "Girls House Captian",
              "Girls Vice House Captian",
            ].map((designation) => (
              <div key={designation} className="mb-4">
                <h3 className="font-semibold mb-2">{designation}</h3>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {getCandidatesByHouseAndDesignation(house, designation).map((c) => (
                    <div
                      key={c.id}
                      onClick={() => chooseCandidate(house, designation, c)}
                      className={`p-3 border rounded cursor-pointer hover:shadow-lg ${
                        selected[house]?.[designation] === c.id
                          ? "bg-blue-400 text-white"
                          : darkMode
                          ? "bg-gray-700"
                          : "bg-gray-100"
                      }`}
                    >
                      <h4 className="font-semibold">{c.name}</h4>
                      <p>Class: {c.class}</p>
                      <p>Section: {c.section}</p>
                      <p>Symbol: {c.symbol}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}

      {/* SUBMIT BUTTON */}
      {student && (
        <div className="text-center mt-6">
          <button
            onClick={submitVote}
            className="px-6 py-3 bg-green-500 text-white font-bold rounded hover:bg-green-600"
          >
            Submit Vote
          </button>
        </div>
      )}
    </div>
  );
};

export default CastVote;

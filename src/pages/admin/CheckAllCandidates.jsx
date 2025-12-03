import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useDarkMode } from "../../context/DarkModeContext";

const CheckAllCandidates = () => {
  const { user, token } = useContext(AuthContext);
  const { darkMode } = useDarkMode();  
  const [candidates, setCandidates] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [entries, setEntries] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredData, setFilteredData] = useState([]);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);

  const [newCandidate, setNewCandidate] = useState({
    name: '', gender: '', class: '', section: '', house_group: '', symbol: '', designation: ''
  });
  
  const [importFile, setImportFile] = useState(null);
  const navigate = useNavigate();

  // Fetch candidates
  useEffect(() => {
    const fetchCandidates = async () => {
      if (user && token) {
        try {
          const response = await axios.get(
            'https://fess-backend-6787.onrender.com/api/admin/candidates',
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setCandidates(response.data);
          setFilteredData(response.data);
        } catch (error) {
          setMessage(error.response?.data?.error || 'Failed to fetch candidates');
        }
      }
    };
    fetchCandidates();
  }, [user, token]);

  // Search filter
  useEffect(() => {
    const result = candidates.filter(candidate =>
      candidate?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate?.class?.includes(searchTerm) ||
      candidate?.section?.includes(searchTerm)
    );
    setFilteredData(result);
    setCurrentPage(1);
  }, [searchTerm, candidates]);

  // Delete candidate
  const handleDelete = async (candidateId) => {
    try {
      await axios.delete(
        `https://fess-backend-6787.onrender.com/api/admin/delete-candidates/${candidateId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage('Candidate Deleted Successfully');
      setIsSuccess(true);
      setCandidates(prev => prev.filter(c => c.id !== candidateId));
      setFilteredData(prev => prev.filter(c => c.id !== candidateId));
    } catch (error) {
      setMessage('Failed to delete candidate');
      setIsSuccess(false);
    }
  };

  // Add candidate
  const handleAddCandidate = async () => {
    try {
      const response = await axios.post(
        'https://fess-backend-6787.onrender.com/api/admin/add-candidate',
        newCandidate,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const addedCandidate = response.data.candidate;
      setCandidates(prev => [...prev, addedCandidate]);
      setFilteredData(prev => [...prev, addedCandidate]);

      setMessage('Candidate added successfully!');
      setIsSuccess(true);
      setShowAddModal(false);

    } catch (err) {
      setMessage(err.response?.data?.error || 'Failed to add candidate');
      setIsSuccess(false);
    }
  };

  // Import candidates
  const handleImportCandidates = async () => {
    const formData = new FormData();
    formData.append('file', importFile);

    try {
      const response = await axios.post(
        'https://fess-backend-6787.onrender.com/api/admin/import-candidates',
        formData,
        { headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` } }
      );

      if (response.data?.candidates?.length > 0) {
        const importedCandidates = response.data.candidates;
        setCandidates(prev => [...prev, ...importedCandidates]);
        setFilteredData(prev => [...prev, ...importedCandidates]);

        setMessage("Candidates imported successfully!");
        setIsSuccess(true);
        setShowImportModal(false);
      } else {
        setMessage("No valid candidates were imported.");
        setIsSuccess(false);
      }
    } catch (err) {
      setMessage(err.response?.data?.error || "Failed to import candidates");
      setIsSuccess(false);
    }
  };

  // Pagination helper
  const paginate = (data, pageNumber, entriesPerPage) => {
    const indexOfLast = pageNumber * entriesPerPage;
    const indexOfFirst = indexOfLast - entriesPerPage;
    return data.slice(indexOfFirst, indexOfLast);
  };

  const totalPages = Math.ceil(filteredData.length / entries);

  return (
    <div className={`max-w-7xl mx-auto p-6 ${darkMode ? "bg-college-navy" : "bg-white text-gray-900"}`}>
      
      {/* Add / Import Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div className="flex justify-start">
          <button onClick={() => setShowAddModal(true)} className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5">
            Add Candidate
          </button>
        </div>
        <div className="flex justify-end">
          <button onClick={() => setShowImportModal(true)} className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5">
            Bulk Import Candidates
          </button>
        </div>
      </div>

      {/* Add Candidate Modal */}
      {showAddModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-lg font-medium mb-4">Add Candidate</h3>

            {/* <input type="text" placeholder="Registration" value={newCandidate.reg} onChange={(e) => setNewCandidate({...newCandidate, reg: e.target.value})} className="w-full mb-3 px-4 py-2 border rounded"/> */}
            <input type="text" placeholder="Name" value={newCandidate.name} onChange={(e) => setNewCandidate({...newCandidate, name: e.target.value})} className="w-full mb-3 px-4 py-2 border rounded"/>
            
            <select
              value={newCandidate.gender}
              onChange={(e) => setNewCandidate({...newCandidate, gender: e.target.value})}
              className="w-full mb-3 px-4 py-2 border rounded"
              required>
              <option value="" disabled>
                Select Gender
              </option>
              <option value="M">M</option>
              <option value="F">F</option>
            </select>

            <input type="text" placeholder="Class" value={newCandidate.class} onChange={(e) => setNewCandidate({...newCandidate, class: e.target.value})} className="w-full mb-3 px-4 py-2 border rounded"/>
            <input type="text" placeholder="Section" value={newCandidate.section} onChange={(e) => setNewCandidate({...newCandidate, section: e.target.value})} className="w-full mb-3 px-4 py-2 border rounded"/>
            <input type="text" placeholder="House Group" value={newCandidate.house_group} onChange={(e) => setNewCandidate({...newCandidate, house_group: e.target.value})} className="w-full mb-3 px-4 py-2 border rounded"/>
            <input type="text" placeholder="Symbol" value={newCandidate.symbol} onChange={(e) => setNewCandidate({...newCandidate, symbol: e.target.value})} className="w-full mb-3 px-4 py-2 border rounded"/>
            <input type="text" placeholder="Designation" value={newCandidate.designation} onChange={(e) => setNewCandidate({...newCandidate, designation: e.target.value})} className="w-full mb-3 px-4 py-2 border rounded"/>

            <button onClick={handleAddCandidate} className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded mr-2">Save</button>
            <button onClick={() => setShowAddModal(false)} className="text-gray-600 bg-gray-200 px-4 py-2 rounded">Cancel</button>
          </div>
        </div>
      )}

      {/* Import Candidates Modal */}
      {showImportModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-lg font-medium mb-4">Import Candidates</h3>
            <input type="file" onChange={(e) => setImportFile(e.target.files[0])} className="w-full mb-3 px-4 py-2 border rounded"/>
            <button onClick={handleImportCandidates} className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded mr-2">Import</button>
            <button onClick={() => setShowImportModal(false)} className="text-gray-600 bg-gray-200 px-4 py-2 rounded">Cancel</button>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="flex justify-between mb-4">
        <h6 className="m-0 font-medium text-base text-blue-500">All Candidates</h6>
        <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="px-4 py-2 border rounded-lg focus:outline-none"/>
      </div>

      {/* Message */}
      {message && (
        <div className={`text-center mt-4 text-sm px-4 py-2 rounded ${isSuccess ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
          {message}
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="border-b">
              <th className="py-2 px-4">#</th>
              <th className="py-2 px-4">Name</th>
              <th className="py-2 px-4">Gender</th>
              <th className="py-2 px-4">Class</th>
              <th className="py-2 px-4">Section</th>
              <th className="py-2 px-4">House Group</th>
              <th className="py-2 px-4">Symbol</th>
              <th className="py-2 px-4">Designation</th>
              <th className="py-2 px-4">Date Created</th>
              <th className="py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginate(filteredData, currentPage, entries).map((candidate, index) => (
              <tr key={candidate.id} className="border-b">
                <td className="py-2 px-4">{index + 1 + (currentPage - 1) * entries}</td>
                <td className="py-2 px-4">{candidate.name}</td>
                <td className="py-2 px-4">
                  {candidate.gender === "M" ? "Male" : "Female"}
                </td>

                <td className="py-2 px-4">{candidate.class}</td>
                <td className="py-2 px-4">{candidate.section}</td>
                <td className="py-2 px-4">{candidate.house_group}</td>
                <td className="py-2 px-4">{candidate.symbol}</td>
                <td className="py-2 px-4">{candidate.designation}</td>
                <td className="py-2 px-4">{candidate.dateCreated || "N/A"}</td>
                <td className="py-2 px-4 flex space-x-2">
                  <button onClick={() => navigate(`../edit-candidate/${candidate.id}/`)} className="px-3 py-1 bg-blue-500 text-white rounded"><FaEdit /></button>
                  <button onClick={() => handleDelete(candidate.id)} className="px-3 py-1 bg-red-500 text-white rounded"><FaTrash /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between mt-4">
        <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} className="px-4 py-2 bg-gray-300 text-sm rounded-md">Previous</button>
        <span className="px-4 py-2 text-sm">Page {currentPage} of {totalPages}</span>
        <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages} className="px-4 py-2 bg-gray-300 text-sm rounded-md">Next</button>
      </div>
    </div>
  );
};

export default CheckAllCandidates;

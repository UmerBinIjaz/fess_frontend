import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useDarkMode } from "../../context/DarkModeContext";
import { DarkMode, Password } from "@mui/icons-material";

const CheckAllStudents = () => {
  const { user, token } = useContext(AuthContext);
  const { darkMode } = useDarkMode();  
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [entries, setEntries] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredData, setFilteredData] = useState([]);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  
  // FIX: added missing class_section field
  const [newStudent, setNewStudent] = useState({ 
    reg: '', 
    name: '',
    class_section: '',
    password: '' 
  });
  
  const [importFile, setImportFile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudents = async () => {
      if (user && token) {
        try {
          const response = await axios.post(
            'https://fess-backend-6787.onrender.com/api/admin/students',
            { adminId: user.id },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setStudents(response.data);
          setFilteredData(response.data);
        } catch (error) {
          setMessage(error.response?.data?.error || 'Failed to fetch students');
        }
      }
    };
    fetchStudents();
  }, [user, token]);

  useEffect(() => {
    const result = students.filter(student =>
      student?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student?.reg?.includes(searchTerm)
    );
    setFilteredData(result);
    setCurrentPage(1);
  }, [searchTerm, students]);

  const handleDelete = async (studentId) => {
    try {
      await axios.delete(
        `https://fess-backend-6787.onrender.com/api/admin/delete-student/${studentId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage('Student Deleted Successfully');
      setIsSuccess(true);

      setStudents(prev => prev.filter(s => s.id !== studentId));
      setFilteredData(prev => prev.filter(s => s.id !== studentId));
    } catch (error) {
      setMessage('Failed to delete student');
      setIsSuccess(false);
    }
  };

  const handleAddStudent = async () => {
    try {
      const response = await axios.post(
        'https://fess-backend-6787.onrender.com/api/admin/add-student',
        newStudent,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const addedStudent = response.data.student;

      setStudents(prev => [...prev, addedStudent]);
      setFilteredData(prev => [...prev, addedStudent]);

      navigate("/admin/students");
      setMessage('Student added successfully!');
      setIsSuccess(true);
      setShowAddModal(false);
      
    } catch (err) {
      setMessage(err.response?.data?.error || 'Failed to add student');
      setIsSuccess(false);
    }
  };


  // FIX: added correct multipart/form-data headers
  const handleImportStudents = async () => {
    const formData = new FormData();
    formData.append('file', importFile);

    try {
        const response = await axios.post(
            'https://fess-backend-6787.onrender.com/api/admin/import-students',
            formData,
            { headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` } }
        );

        if (response.data?.students?.length > 0) {

            const importedStudents = response.data.students;

            setStudents(prev => [...prev, ...importedStudents]);
            setFilteredData(prev => [...prev, ...importedStudents]);

            setMessage("Students imported successfully!");
            setIsSuccess(true);
            setShowImportModal(false);
        } else {
            setMessage("No valid students were imported.");
            setIsSuccess(false);
        }

    } catch (err) {
        setMessage(err.response?.data?.error || "Failed to import students");
        setIsSuccess(false);
    }
  };

  const paginate = (data, pageNumber, entriesPerPage) => {
    const indexOfLast = pageNumber * entriesPerPage;
    const indexOfFirst = indexOfLast - entriesPerPage;
    return data.slice(indexOfFirst, indexOfLast);
  };

  const totalPages = Math.ceil(filteredData.length / entries);

  return (
    <div className={`max-w-7xl mx-auto p-6 ${darkMode ? "bg-college-navy" : "bg-white text-gray-900"}`}>
      {/* Create Student IDOR Import Students ID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div className="flex justify-start">
          <button
            onClick={() => setShowAddModal(true)}
            className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5"
          >
            Add Student
          </button>
        </div>
        <div className="flex justify-end">
          <button
            onClick={() => setShowImportModal(true)}
            className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5"
          >
            Bulk Import Student
          </button>
        </div>
      </div>

      {/* Add Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-lg font-medium mb-4">Add Student</h3>
            <input
              type="text"
              placeholder="Registration"
              value={newStudent.reg}
              onChange={(e) => setNewStudent({ ...newStudent, reg: e.target.value })}
              className="w-full mb-3 px-4 py-2 border rounded"
            />
            <input
              type="text"
              placeholder="Name"
              value={newStudent.name}
              onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
              className="w-full mb-3 px-4 py-2 border rounded"
            />

            <input
              type="text"
              placeholder="Class And Section (e.g., 10A)"
              value={newStudent.class_section}
              onChange={(e) => setNewStudent({ ...newStudent, class_section: e.target.value })}
              className="w-full mb-3 px-4 py-2 border rounded"
            />
            

            <input
              type="password"
              placeholder="Password"
              value={newStudent.password}
              onChange={(e) => setNewStudent({ ...newStudent, password: e.target.value })}
              className="w-full mb-3 px-4 py-2 border rounded"
            />
            <button
              onClick={handleAddStudent}
              className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded mr-2"
            >
              Save
            </button>
            <button
              onClick={() => setShowAddModal(false)}
              className="text-gray-600 bg-gray-200 px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Import Students Modal */}
      {showImportModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-lg font-medium mb-4">Import Students</h3>
            <input type="file" onChange={(e) => setImportFile(e.target.files[0])} className="w-full mb-3 px-4 py-2 border rounded" />
            <button onClick={handleImportStudents} className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded mr-2">Import</button>
            <button onClick={() => setShowImportModal(false)} className="text-gray-600 bg-gray-200 px-4 py-2 rounded">Cancel</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div className="flex justify-start sm:justify-start items-center">
          <h6 className="m-0 font-medium text-base text-blue-500">All Students</h6>
        </div>
        <div className="flex justify-start sm:justify-end">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 w-full sm:w-auto max-w-xs border border-gray-300 rounded-lg focus:outline-none"
          />
        </div>
      </div>

      {message && (
        <div
          className={`text-center mt-4 text-sm px-4 py-2 rounded ${
            isSuccess ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
          }`}
        >
          {message}
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="border-b">
              <th className="py-2 px-4">ID</th>
              <th className="py-2 px-4">Registration</th>
              <th className="py-2 px-4">Name</th>
              <th className="py-2 px-4">Class</th>
              <th className="py-2 px-4">Section</th>
              <th className="py-2 px-4">Date Created</th>
              <th className="py-2 px-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginate(filteredData, currentPage, entries).map((student, index) => {

              const classSec = student?.class_section || "";
              const classPart = classSec.slice(0, -1);
              const sectionPart = classSec.slice(-1);

              return (
                <tr key={student?.id} className="border-b">
                  <td className="py-2 px-4">{index + 1 + (currentPage - 1) * entries}</td>
                  <td className="py-2 px-4">{student?.reg}</td>
                  <td className="py-2 px-4">{student?.name}</td>
                  
                  {/* FIXED class_section display */}
                  <td className="py-2 px-4">{classPart}</td>
                  <td className="py-2 px-4">{sectionPart}</td>

                  <td className="py-2 px-4">{student?.dateCreated || "N/A"}</td>

                  <td className="py-2 px-4">
                    <button
                      onClick={() => navigate(`../edit-student/${student?.id}/`)}
                      className="px-4 py-2 text-sm bg-blue-500 text-white rounded-md mr-2"
                    >
                      <FaEdit />
                    </button>

                    <button
                      onClick={() => handleDelete(student?.id)}
                      className="px-4 py-2 text-sm bg-red-500 text-white rounded-md"
                    >
                      <FaTrash />
                    </button>
                  </td>

                </tr>
              );
            })}
          </tbody>
          
        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-between mt-4">
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-300 text-sm rounded-md"
        >
          Previous
        </button>

        <span className="px-4 py-2 text-sm">
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-300 text-sm rounded-md"
        >
          Next
        </button>
      </div>

    </div>
  );
};

export default CheckAllStudents;
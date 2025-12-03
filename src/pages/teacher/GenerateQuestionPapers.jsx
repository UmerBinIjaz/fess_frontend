import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { useDarkMode } from "../../context/DarkModeContext";
import { DarkMode } from "@mui/icons-material";

const GenerateQuestionPapers = () => {
  const { courseId } = useParams();
  const { user, token } = useContext(AuthContext);
  const { darkMode, setDarkMode } = useDarkMode();
  const [files, setFiles] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [numQuestions, setNumQuestions] = useState(5);
  const [totalMarks, setTotalMarks] = useState(10);
  const [generatedPaper, setGeneratedPaper] = useState(null);
  const [generatedQuestions, setGeneratedQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // Step state
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [suggestedQuestionTypes, setSuggestedQuestionTypes] = useState([]);
  const [selectedQuestionTypes, setSelectedQuestionTypes] = useState([]);

  useEffect(() => {
    // Fetch uploaded files
    const fetchFiles = async () => {
      try {
        const response = await axios.post(
          `http://localhost:5000/api/teacher/course/${courseId}/files`,
          { teacherId: user.id },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setFiles(response.data);
      } catch (err) {
        if (err.response?.status === 403) {
          setError("Unauthorized access: You cannot view this course.");
        } else {
          setError(err.response?.data?.error || "Something went wrong");
        }
      }
    };
    fetchFiles();
  }, [user, token, courseId]);

  useEffect(() => {
    const fetchSuggestedTypes = async () => {
      setError("");
      setLoading(true);
      try {
        const response = await axios.post(
          `http://localhost:5000/api/teacher/course/${courseId}/suggest-question-types`,
          { selectedFiles },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setSuggestedQuestionTypes(response.data.suggestedTypes);
      } catch (error) {
        setError("Error fetching suggested question types.");
      } finally {
        setLoading(false);
      }
    };

    if (step === 3 && selectedFiles.length > 0) {
      fetchSuggestedTypes();
    }
  }, [step, selectedFiles, courseId, token]);

  const handleQuestionTypeSelection = (type) => {
    setSelectedQuestionTypes((prev) => {
      if (prev.includes(type)) {
        return prev.filter((t) => t !== type);
      } else {
        return [...prev, type];
      }
    });
  };

  const handleGenerateQuestions = async () => {
    setError("");
    setSuccessMessage("");

    if (selectedFiles.length === 0) {
      setError("Please select at least one lecture file.");
      return;
    }

    if (selectedQuestionTypes.length === 0) {
      setError("Please select at least one question type.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `http://localhost:5000/api/teacher/course/${courseId}/generate-questions`,
        {
          selectedFiles,
          numQuestions,
          totalMarks,
          questionTypes: selectedQuestionTypes, // Send selected question types
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccessMessage(response.data.message);
      setGeneratedPaper(response.data.filePath);
      setGeneratedQuestions(response.data.questions); // Store generated questions
      setStep(4); // Move to the final step
    } catch (error) {
      setError("Error generating questions.");
    } finally {
      setLoading(false);
    }
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (isNaN(numQuestions) || numQuestions <= 0) {
        setError("Number of questions must be a positive number.");
        return;
      }
      if (isNaN(totalMarks) || totalMarks <= 0) {
        setError("Total marks must be a positive number.");
        return;
      }
    }
    if (step < 4) {
      setStep(step + 1);
    }
  };

  const handlePreviousStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <>
      <div className={`max-w-7xl mx-auto p-6 ${darkMode ? "bg-college-navy" : "bg-white text-gray-900"}`}>
        <div className="flex justify-between items-center mb-6">
          <h6 className={`m-0 font-medium text-base ${darkMode ? "text-white" : "text-blue-500"}`}>
            Generate Question Paper
          </h6>
        </div>
        {/* Success or Error Messages */}
        {error && (
          <div className="text-center bg-red-100 text-red-600 p-2 rounded-md mb-4">
            {error}
          </div>
        )}
        {successMessage && (
          <div className="text-center bg-green-100 text-green-600 p-2 rounded-md mb-4">
            {successMessage}
          </div>
        )}
        {/* Step 1: Enter Total Marks and Number of Questions */}
        {step === 1 && (
          <div>
            <h3 className={`m-0 font-medium text-base mb-4 ${darkMode ? "text-white" : "text-blue-500"}`}>
              Step 1: Enter Details
            </h3>
            <div>
              <label className={`block font-medium mb-2 ${darkMode ? "text-white" : "text-gray-700"}`}>
                Enter Total Number of Questions
              </label>
              <input
                type="number"
                value={numQuestions}
                onChange={(e) => setNumQuestions(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className={`block font-medium mb-2 ${darkMode ? "text-white" : "text-gray-700"}`}>
                Total Marks:
              </label>
              <input
                type="number"
                value={totalMarks}
                onChange={(e) => setTotalMarks(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              className="px-4 py-2 my-4 text-sm bg-red-500 text-white rounded-md"
              onClick={handleNextStep}
            >
              Next
            </button>
          </div>
        )}
        {/* Step 2: Select Lecture Files */}
        {step === 2 && (
          <div>
            <h3 className={`m-0 font-medium text-base mb-3 ${darkMode ? "text-white" : "text-blue-500"}`}>
              Step 2: Select Lectures
            </h3>
            <div>
              <label className={`block text-gray-700 font-medium mb-2 ${darkMode ? "text-white" : "text-gray-700"}`}>
                Select Lectures:{" "}
              </label>
              {files.map((file) => (
                <div key={file.id} className="flex items-center space-x-2">
                  <input
                    id={`file-${file.id}`}
                    type="checkbox"
                    value={file.file_path}
                    checked={selectedFiles.includes(file.file_path)}
                    onChange={(e) => {
                      const value = e.target.value;
                      setSelectedFiles((prev) =>
                        e.target.checked
                          ? [...prev, value]
                          : prev.filter((f) => f !== value)
                      );
                    }}
                    className="hidden peer"
                  />
                  <label
                    htmlFor={`file-${file.id}`}
                    className={`select-none my-2 cursor-pointer w-full flex items-center justify-center rounded-lg border-2 border-gray-200 px-4 py-2 transition-colors duration-200 ease-in-out peer-checked:bg-gray-300 peer-checked:text-gray-900 peer-checked:border-gray-200 ${darkMode ? "text-white" : "text-gray-700"}`}
                  >
                    {file.file_name}
                  </label>
                </div>
              ))}
            </div>
            <button
              className="px-4 py-2 my-4 text-sm bg-blue-500 text-white rounded-md mx-2"
              onClick={handlePreviousStep}
            >
              Back
            </button>
            <button
              className="px-4 py-2 my-4 text-sm bg-red-500 text-white rounded-md"
              onClick={handleNextStep}
            >
              Next
            </button>
          </div>
        )}

        {/* Step 3: Select Question Types */}
        {step === 3 && (
          <div>
            <h3 className={`m-0 font-medium text-base mb-2 ${darkMode ? "text-white" : "text-blue-500"}`}>
              Step 3: Select Question Types
            </h3>
            {loading ? (
              <div>Loading question types...</div>
            ) : (
              <div>
                {suggestedQuestionTypes.map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`type-${type}`}
                      value={type}
                      checked={selectedQuestionTypes.includes(type)}
                      onChange={() => handleQuestionTypeSelection(type)}
                      className="hidden peer"
                    />
                    <label
                      htmlFor={`type-${type}`}
                      className={`select-none my-2 cursor-pointer w-full flex items-center justify-center rounded-lg border-2 border-gray-200 px-4 py-2 text-gray-700 transition-colors duration-200 ease-in-out peer-checked:bg-gray-200 peer-checked:text-gray-900 peer-checked:border-gray-200 ${darkMode ? "text-white" : "text-gray-700"}`}
                    >
                      {type}
                    </label>
                  </div>
                ))}
              </div>
            )}
            <button
              className="px-4 py-2 my-4 text-sm bg-blue-500 text-white rounded-md mx-2"
              onClick={handlePreviousStep}
            >
              Back
            </button>
            <button
              className="px-4 py-2 my-4 text-sm bg-red-500 text-white rounded-md"
              onClick={handleNextStep}
              disabled={loading}
            >
              Next
            </button>
          </div>
        )}

        {/* Step 4: Generate and Download Question Paper */}
        {step === 4 && (
          <div>
            <h3 className={`m-0 font-medium text-base mb-2 ${darkMode ? "text-white" : "text-blue-500"}`}>
              Step 4: Generate and Download
            </h3>

            <button
              className="px-4 py-2 my-4 text-sm bg-blue-500 text-white rounded-md mx-2"
              onClick={handlePreviousStep}
            >
              Back
            </button>
            <button
              onClick={handleGenerateQuestions}
              className="px-4 py-2 my-4 text-sm bg-red-500 text-white rounded-md"
              disabled={loading}
            >
              {loading ? "Generating..." : "Generate Questions"}
            </button>
            {generatedPaper && (
              <div>
                <h3 className={`font-medium mb-4 ${darkMode ? "text-white" : "text-gray-700"}`}>
                  Download Your Question Paper:
                </h3>
                <a
                  href={`http://localhost:5000/${generatedPaper}`}
                  className="px-4 py-2 mt-2 text-sm bg-red-500 text-white rounded-md"
                  download
                >
                  Download Question Paper
                </a>
              </div>
            )}
          </div>
        )}

      </div>

        {/* Display Generated Questions */}
        <div className={`max-w-7xl mx-auto p-6 mt-4 ${darkMode ? "bg-college-navy" : "bg-white text-gray-900"}`}>
          <div className="flex justify-between items-center mb-6">
            <h6 className={`m-0 font-medium text-base ${darkMode ? "text-white" : "text-blue-500"}`}>
              Questions
            </h6>
          </div>
          <table className="w-full">
            <tbody>
              {generatedQuestions.map((question, index) => (
                <p key={index} className="text-justify">
                  {/* <td className='py-2 px-4 text-sm text-gray-700'>{1}</td> */}
                  <span className={`py-2 px-4 text-sm font-bold ${darkMode ? "text-white" : "text-gray-700"}`}>
                    {question}
                  </span>
                </p>
              ))}
            </tbody>
          </table>
        </div>


    </>
  );
};

export default GenerateQuestionPapers;

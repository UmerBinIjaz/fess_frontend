// TeacherRoutes.jsx
import React, { Profiler } from 'react';
import { Route, Routes } from 'react-router-dom';

// Import page components
import Login from '../pages/teacher/Login';
import Register from '../pages/teacher/Register';
import ForgotPassword from '../pages/teacher/ForgotPassword';
import ResetPassword from '../pages/teacher/ResetPassword';
import Logout from '../pages/teacher/Logout';

// Import layout and private route components
import PrivateRoute from '../components/PrivateRoute';
import Layout from '../pages/teacher/components/Layout';
import MyProfile from '../pages/teacher/MyProfile';
import EditProfile from '../pages/teacher/EditProfile';
import Courses from '../pages/teacher/Courses';
import Course from '../pages/teacher/Course';
import CreateCLO from '../pages/teacher/CreateCLO';
// Dashboard and feature pages
import Dashboard from '../pages/teacher/Dashboard';
import CreateCourse from '../pages/teacher/CreateCourse';
import UploadFile from '../pages/teacher/UploadFile';
import TakeAttendance from '../pages/teacher/TakeAttendance';
import ExportAttendance from '../pages/teacher/ExportAttendance';
import GenerateQuestionPapers from '../pages/teacher/GenerateQuestionPapers';
import GenerateAttendance from '../pages/teacher/GenerateAttendance';
import MarksDistribution from '../pages/teacher/MarksDistribution';
import AddStudentMarks from '../pages/teacher/AddStudentMarks';
import MapClos from '../pages/admin/MapClos';
import MapTeacherClos from '../pages/teacher/MapClos';
import MapClosAssessment from '../pages/teacher/MapClosAssessment';
import StudentPerformanceByCLO from '../pages/teacher/StudentPerformanceByCLO';

const TeacherRoutes = () => {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            <Route path="/logout" element={<Logout />} />

            {/* Private Routes */}
            <Route
                path="/"
                element={
                    <PrivateRoute role="teacher">
                        <Layout /> {/* Layout includes Sidebar and Header */}
                    </PrivateRoute>
                }
            >
                {/* Nested Routes */}
                <Route index element={<Dashboard />} />
                <Route path="create-course" element={<CreateCourse />} />
                <Route path='courses' element={<Courses />}/>
                <Route path="course/:courseId" element={<Course />}>
                    {/* Nested Routes within Course */}
                    <Route path="mappedClos" element={<MapTeacherClos />} />
                    <Route path="Marks-Distributions" element={<MarksDistribution />} />
                    <Route path="MapClosAssessment" element={<MapClosAssessment/>} />
                    <Route path="StudentCloPerformance/clo/:cloId/" element={<StudentPerformanceByCLO/>} />
                    <Route path="AddStudentMarks/:sessionalId/" element={<AddStudentMarks />} />
                    <Route path="upload-file" element={<UploadFile />} />
                    <Route path="take-attendance" element={<TakeAttendance />} />
                    <Route path="generate-attendance" element={<GenerateAttendance />} />
                    <Route path="export-attendance" element={<ExportAttendance />} />
                    <Route path="generate-question-papers" element={<GenerateQuestionPapers />} />
                </Route>
                <Route path="edit-profile" element={<EditProfile />} />
                <Route path="profile" element={<MyProfile />} />
            </Route>
        </Routes>
    );
};

export default TeacherRoutes;

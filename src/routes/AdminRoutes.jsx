import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from '../pages/admin/Login';
import Register from '../pages/admin/Register';
import ForgotPassword from '../pages/admin/ForgotPassword';
import ResetPassword from '../pages/admin/ResetPassword';
import PrivateRoute from '../components/PrivateRoute';
import Layout from '../pages/admin/components/Layout';
// Page components
import Dashboard from '../pages/admin/Dashboard';
import EditProfile from '../pages/admin/Editprofile';
import MyProfile from '../pages/admin/profile';
import CheckAllStudents from '../pages/admin/CheckAllStudents';
import EditStudent from '../pages/admin/EditStudent';
import ImportStudents from '../pages/admin/ImportStudents';
import CreateStudents from '../pages/admin/CreateStudents';
import Logout from '../pages/admin/Logout';
import CheckAllCandidates from '../pages/admin/CheckAllCandidates';
import EditCandidate from '../pages/admin/EditCandidate';
import Results from '../pages/admin/Results';

const AdminRoutes = () => {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            <Route path="/logout" element={<Logout />} />
            <Route
                path="/"
                element={
                    <PrivateRoute role="admin">
                        <Layout /> {/* Layout includes Sidebar and Header */}
                    </PrivateRoute>
                }
            >
                {/* Nested Routes */}
                <Route index element={<Dashboard />} />
                {/* <Route path="profile" element={<MyProfile />} />
                <Route path="edit-profile" element={<EditProfile />} /> */}
                <Route path="students" element={<CheckAllStudents />} />
                {/* <Route path="obe" element={<OBE/>}/> */}
                <Route path="create-students" element={<CreateStudents />} />
                <Route path="/edit-student/:studentId" element={<EditStudent />}/>
                <Route path="import-students" element={<ImportStudents />} />


                <Route path="candidates" element={<CheckAllCandidates/>} />
                <Route path="/edit-candidate/:candidateId" element={<EditCandidate />}/>
                <Route path="/result" element={<Results />}/>
                {/* <Route path="obe" element={<OBE/>}/> */}
                {/* <Route path="create-students" element={<CreateStudents />} />
                <Route path="/edit-student/:studentId" element={<EditStudent />}/>
                <Route path="import-students" element={<ImportStudents />} /> */}

            </Route>
        </Routes>
    );
};

export default AdminRoutes;

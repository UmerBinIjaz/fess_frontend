import React from 'react';
import { Route, Routes } from 'react-router-dom';
import PrivateRoute from '../components/PrivateRoute';
import Layout from '../pages/student/components/Layout';
import Login from '../pages/student/Login';
import Logout from '../pages/student/Logout';
import Dashboard from '../pages/student/Dashboard';
import MyProfile from '../pages/student/profile';
import EditProfile from '../pages/student/EditProfile';
import ForgotPassword from '../pages/student/ForgotPassword';
import ResetPassword from '../pages/student/ResetPassword';
import CastVote from '../pages/student/CastVote';

// import StudentRegister from '../pages/student/StudentRegister';

function StudentRoutes() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/logout" element={<Logout />} />
            <Route path='/forgot-password' element={<ForgotPassword/>}/>
            <Route path='/reset-password' element={<ResetPassword/>}/>
            {/* <Route path="/register" element={<StudentRegister />} /> */}
            <Route
                path="/"
                element={
                    <PrivateRoute role="student">
                        <Layout /> {/* Layout includes Sidebar and Header */}
                    </PrivateRoute>
                }
            >
                {/* Nested Routes */}
                <Route index element={<Dashboard />} />
                <Route path="profile" element={<MyProfile />} />
                <Route path="/cast-vote" element={<CastVote />} />
                {/* <Route path="edit-profile" element={<EditProfile />} /> */}
            </Route>
        </Routes>
    );
}

export default StudentRoutes;

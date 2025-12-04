import React from 'react';
import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AdminRoutes from './routes/AdminRoutes';
// import TeacherRoutes from './routes/TeacherRoutes';
import StudentRoutes from './routes/StudentRoutes';
import NotFound from './pages/NotFound';
import CastVote from './pages/CastVote';

// import './App.css'
// src/App.jsx



function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/cast-vote" element={<CastVote />} />
                <Route path="/admin/*" element={<AdminRoutes />} />
                {/* <Route path="/teacher/*" element={<TeacherRoutes />} /> */}
                <Route path="/student/*" element={<StudentRoutes />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Router>
    );
}

export default App;

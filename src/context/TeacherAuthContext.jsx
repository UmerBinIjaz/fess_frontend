import React, { createContext, useState, useEffect } from 'react';

export const TeacherAuthContext = createContext();

const TeacherAuthProvider = ({ children }) => {
  const [teacher, setTeacher] = useState(null); // Store teacher details
  const [token, setToken] = useState(null);

  const logout = () => {
    setTeacher(null);
    setToken(null);
    localStorage.removeItem('teacher');
    localStorage.removeItem('teacherToken');
  };

  useEffect(() => {
    const storedTeacher = JSON.parse(localStorage.getItem('teacher'));
    const storedToken = localStorage.getItem('teacherToken');
    if (storedTeacher && storedToken) {
      setTeacher(storedTeacher);
      setToken(storedToken);
    }
  }, []);

  return (
    <TeacherAuthContext.Provider value={{ teacher, token, setTeacher, setToken, logout }}>
      {children}
    </TeacherAuthContext.Provider>
  );
};

export default TeacherAuthProvider;
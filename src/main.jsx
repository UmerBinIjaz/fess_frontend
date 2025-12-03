import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import AuthProvider from './context/AuthContext'; // Import AuthProvider
import { DarkModeProvider } from "./context/DarkModeContext";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <DarkModeProvider>
        <App />
      </DarkModeProvider>  
    </AuthProvider>
  </React.StrictMode>
);

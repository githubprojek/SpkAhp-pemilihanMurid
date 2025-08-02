// src/App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/Login";
import Admin from "./pages/Admin"; // Ini handle semua routes yang butuh login

const App = () => {
  return (
    <Routes>
      {/* Login page tetap bisa diakses tanpa login */}
      <Route path="/login" element={<LoginPage />} />

      {/* Semua route setelah login di-handle oleh Admin.jsx */}
      <Route path="/*" element={<Admin />} />
    </Routes>
  );
};

export default App;

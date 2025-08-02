// src/pages/Admin.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Dashboard from "../components/Dashboard";
import Murid from "../components/Murid.jsx";
import Kriteria from "../components/Kriteria";
import Perbandingan from "../components/Perbandingan";
import Bobot from "../components/Bobot";
import NilaiAkhir from "../components/NilaiAkhir";
import PerbandinganSiswa from "../components/PerbandinganSiswa";
import BobotSiswa from "../components/BobotSiswa.jsx";
import User from "../components/User";
import { useAuthStore } from "../store/useLoginStore.js";

const Admin = () => {
  const { isLoggedIn } = useAuthStore();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar />
        <div className="flex-1 overflow-y-auto bg-gray-50">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/user" element={<User />} />
            <Route path="/murid" element={<Murid />} />
            <Route path="/perbandingansiswa" element={<PerbandinganSiswa />} />
            <Route path="/bobotmurid" element={<BobotSiswa />} />
            <Route path="/kriteria" element={<Kriteria />} />
            <Route path="/perbandingan" element={<Perbandingan />} />
            <Route path="/bobot" element={<Bobot />} />
            <Route path="/nilaiakhir" element={<NilaiAkhir />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Admin;

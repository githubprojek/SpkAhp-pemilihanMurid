// src/components/Sidebar.jsx
import React, { useState } from "react";
import { LayoutDashboard, User, Settings, LogOut, ChevronDown, ChevronUp, BarChart, Users } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useLoginStore.js";

const Sidebar = () => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  const toggleDropdown = (menu) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
  };

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const renderDropdown = (label, icon, items) => (
    <div>
      <div onClick={() => toggleDropdown(label)} className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-200 ${openDropdown === label ? "bg-green-700" : "hover:bg-green-700"}`}>
        <div className="flex items-center space-x-3">
          {icon}
          <span className="text-sm font-medium">{label}</span>
        </div>
        {openDropdown === label ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </div>
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openDropdown === label ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}`}>
        <div className="ml-6 mt-2 space-y-1">
          {items.map(({ label, to }) => (
            <SidebarItem key={label} label={label} to={to} />
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-screen w-64 bg-green-800 text-white flex flex-col shadow-lg border-r border-white">
      <div className="text-2xl font-bold p-6 border-b border-green-700 text-center">SMA CITRA NEGARA</div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        <SidebarItem icon={<LayoutDashboard size={20} />} label="Dashboard" to="/dashboard" />
        <SidebarItem icon={<Users size={20} />} label="User" to="/user" />
        {renderDropdown("Siswa", <User size={20} />, [
          { label: "Semua Siswa", to: "/murid" },
          { label: "Perbandingan Siswa", to: "/perbandingansiswa" },
          { label: "Bobot Siswa", to: "/bobotmurid" },
        ])}
        {renderDropdown("Kriteria", <Settings size={20} />, [
          { label: "Semua Kriteria", to: "/kriteria" },
          { label: "Perbandingan Kriteria", to: "/perbandingan" },
          { label: "Bobot Kriteria", to: "/bobot" },
        ])}
        <SidebarItem icon={<BarChart size={20} />} label="Penilaian Akhir" to="/nilaiakhir" />
      </nav>
      <div className="px-4 py-4 border-t border-green-700">
        <div onClick={handleLogout} className="flex items-center space-x-3 p-2 pl-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-green-700">
          <LogOut size={20} />
          <span className="text-sm font-medium">Logout</span>
        </div>
      </div>
    </div>
  );
};

const SidebarItem = ({ icon, label, to }) => (
  <NavLink to={to} className={({ isActive }) => `flex items-center space-x-3 p-2 pl-3 rounded-lg transition-all duration-200 cursor-pointer ${isActive ? "bg-green-600" : "hover:bg-green-700"}`}>
    {icon && icon}
    <span className="text-sm font-medium">{label}</span>
  </NavLink>
);

export default Sidebar;

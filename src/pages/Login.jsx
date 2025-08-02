// src/pages/LoginPage.jsx
import React, { useState, useEffect } from "react";
import { useAuthStore } from "../store/useLoginStore.js";
import { useNavigate } from "react-router-dom";
import gedung from "../assets/gedung.webp";
import logo from "../assets/LOGO-SMA.webp";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState("");
  const { login, error, isLoggedIn } = useAuthStore();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    await login(email, password);
  };

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/dashboard", { replace: true });
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    if (error) {
      setLocalError(error);
    }
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="bg-no-repeat bg-center min-h-screen bg-cover flex" style={{ backgroundImage: `url(${gedung})` }}>
        <div className="absolute inset-0 bg-black opacity-70"></div>
        <div className="absolute flex items-center justify-center h-full w-full">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
            <div className="text-center items-center justify-center mb-6">
              <img src={logo} alt="logo" className="mx-auto mb-4 w-[150px]" />
              <h2 className="text-3xl font-bold text-blue-800">SMK CITRA NEGARA</h2>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2 w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Masukan email anda"
                  required
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-2 w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Masukan password anda"
                  required
                />
              </div>
              {localError && <p className="text-red-500 text-sm mt-2">{localError}</p>}
              <div>
                <button type="submit" className="w-full mt-4 py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

// src/store/useStoreLogin.js
import { create } from "zustand";
import axios from "../lib/axios";

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  role: null,
  isLoggedIn: false,
  error: null,

  login: async (email, password) => {
    try {
      const res = await axios.post("/auth/login", { email, password });
      const { token, user } = res.data;

      set({
        user,
        token,
        role: user.role,
        isLoggedIn: true,
        error: null,
      });

      localStorage.setItem("token", token);
    } catch (err) {
      set({
        error: err.response?.data?.message || "Terjadi kesalahan saat login. Coba lagi.",
      });
    }
  },

  logout: () => {
    set({
      user: null,
      token: null,
      role: null,
      isLoggedIn: false,
      error: null,
    });

    localStorage.removeItem("token");
  },
}));

// lib/axios.js
import axios from "axios";

// Buat instance axios
const axiosInstance = axios.create({
  baseURL: "https://be-spk-ahp-murid.vercel.app/",
  headers: {
    "Content-Type": "application/json",
  },
});

// Tambahkan interceptor untuk otomatis menyisipkan token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;

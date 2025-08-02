// src/store/useUserStore.js
import { create } from "zustand";
import axios from "../lib/axios";

export const useUserStore = create((set) => ({
  userList: [],
  loading: false,
  error: null,
  message: null,

  fetchUsers: async () => {
    try {
      set({ loading: true });
      const res = await axios.get("/user/getall");
      set({ userList: res.data, loading: false });
    } catch (err) {
      set({ loading: false, error: "Gagal mengambil data user." });
    }
  },

  addUser: async (data) => {
    try {
      const res = await axios.post("/user/add", data);
      set({ message: "User berhasil ditambahkan." });
      await set((state) => state.fetchUsers());
    } catch (err) {
      set({ error: "Gagal menambahkan user." });
    }
  },

  updateUser: async (id, data) => {
    try {
      const res = await axios.put(`/user/update/${id}`, data);
      set({ message: "User berhasil diperbarui." });
      await set((state) => state.fetchUsers());
    } catch (err) {
      set({ error: "Gagal memperbarui user." });
    }
  },

  deleteUser: async (id) => {
    try {
      await axios.delete(`/user/delete/${id}`);
      set({ message: "User berhasil dihapus." });
      await set((state) => state.fetchUsers());
    } catch (err) {
      set({ error: "Gagal menghapus user." });
    }
  },
}));

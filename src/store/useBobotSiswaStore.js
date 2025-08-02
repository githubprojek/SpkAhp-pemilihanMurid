// store/useBobotMuridStore.js
import { create } from "zustand";
import axios from "../lib/axios";

export const useBobotSiswaStore = create((set, get) => ({
  list: [],
  loading: false,
  error: null,
  message: "",

  fetchAll: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axios.get("/bobotmurid/getall");
      set({ list: res.data, loading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || "Gagal memuat data", loading: false });
    }
  },

  hitungBobot: async () => {
    set({ loading: true, error: null, message: "" });
    try {
      const res = await axios.post("/bobotmurid/hitungbobot");
      set({ list: res.data.data, message: res.data.message, loading: false });
      await get().fetchAll();
    } catch (err) {
      set({ error: err.response?.data?.message || "Gagal menghitung bobot", loading: false });
    }
  },

  deleteBobot: async (id) => {
    try {
      await axios.delete(`/bobotmurid/delete/${id}`);
      await get().fetchAll();
    } catch (err) {
      set({ error: err.response?.data?.message || "Gagal menghapus data" });
    }
  },
}));

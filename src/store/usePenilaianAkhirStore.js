// store/usePenilaianAkhirStore.js
import { create } from "zustand";
import axios from "../lib/axios";

export const usePenilaianAkhirStore = create((set, get) => ({
  list: [],
  loading: false,
  error: null,
  message: "",

  fetchAll: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axios.get("/penilaianakhir/getall");
      set({ list: res.data, loading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || "Gagal memuat data", loading: false });
    }
  },

  hitung: async () => {
    set({ loading: true, error: null, message: "" });
    try {
      const res = await axios.post("/penilaianakhir/hitung");
      set({ list: res.data.data, message: res.data.message, loading: false });
      await get().fetchAll();
    } catch (err) {
      set({ error: err.response?.data?.message || "Gagal menghitung penilaian akhir", loading: false });
    }
  },

  deleteAll: async () => {
    try {
      await axios.delete("/penilaianakhir/delete");
      set({ list: [] });
      await get().fetchAll();
    } catch (err) {
      set({ error: err.response?.data?.message || "Gagal menghapus penilaian akhir" });
    }
  },
}));

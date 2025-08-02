import { create } from "zustand";
import axios from "../lib/axios";

export const usePerbandinganMuridStore = create((set, get) => ({
  list: [],
  loading: false,
  error: null,
  successMessage: "",

  fetchAll: async () => {
    try {
      set({ loading: true, error: null });
      const res = await axios.get("/perbandinganmurid/getall");
      set({ list: res.data, loading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || "Gagal memuat data", loading: false });
    }
  },

  addPerbandingan: async (data) => {
    try {
      set({ loading: true, error: null, successMessage: "" });
      const res = await axios.post("/perbandinganmurid/add", data);
      set({ successMessage: res.data.message, loading: false });
      await get().fetchAll();
    } catch (err) {
      set({ error: err.response?.data?.message || "Gagal menambahkan", loading: false });
    }
  },

  deletePerbandingan: async (id) => {
    try {
      await axios.delete(`/perbandinganmurid/delete/${id}`);
      set((state) => ({ list: state.list.filter((item) => item._id !== id) }));
      await get().fetchAll();
    } catch (err) {
      set({ error: err.response?.data?.message || "Gagal menghapus data" });
    }
  },
  deleteByKriteria: async (kriteriaId) => {
    try {
      await axios.delete(`/perbandinganmurid/delete/kriteria/${kriteriaId}`);
      await get().fetchAll();
    } catch (err) {
      set({ error: err.response?.data?.message || "Gagal menghapus perbandingan berdasarkan kriteria" });
    }
  },
}));

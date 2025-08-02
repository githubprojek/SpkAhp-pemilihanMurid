import { create } from "zustand";
import axios from "../lib/axios"; // pastikan ini adalah axios instance yg sudah include token

export const useKriteriaStore = create((set) => ({
  kriteriaList: [],
  loading: false,
  error: null,

  // ✅ Ambil semua data kriteria
  fetchKriteria: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get("/kriteria/getall");
      set({ kriteriaList: response.data, loading: false });
    } catch (err) {
      set({
        error: err.response?.data?.message || "Gagal memuat data kriteria",
        loading: false,
      });
    }
  },

  // ✅ Tambah kriteria baru
  addKriteria: async (newData) => {
    try {
      await axios.post("/kriteria/add", newData);
      // Auto refresh setelah tambah
      await useKriteriaStore.getState().fetchKriteria();
    } catch (err) {
      set({
        error: err.response?.data?.message || "Gagal menambahkan kriteria",
      });
    }
  },

  // ✅ Update kriteria
  updateKriteria: async (id, updatedData) => {
    try {
      await axios.put(`/kriteria/update/${id}`, updatedData);
      await useKriteriaStore.getState().fetchKriteria();
    } catch (err) {
      set({
        error: err.response?.data?.message || "Gagal memperbarui kriteria",
      });
    }
  },

  // ✅ Hapus kriteria
  deleteKriteria: async (id) => {
    try {
      await axios.delete(`/kriteria/delete/${id}`);
      await useKriteriaStore.getState().fetchKriteria();
    } catch (err) {
      set({
        error: err.response?.data?.message || "Gagal menghapus kriteria",
      });
    }
  },
}));

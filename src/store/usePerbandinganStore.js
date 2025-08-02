import { create } from "zustand";
import axios from "../lib/axios.js";

export const usePerbandinganStore = create((set, get) => ({
  perbandinganList: [],
  loading: false,
  error: null,

  fetchPerbandingan: async () => {
    set({ loading: true });
    try {
      const res = await axios.get("/perbandingan/getall");
      console.log("perbandingan fetch", res.data);
      set({ perbandinganList: res.data, loading: false });
    } catch (error) {
      set({ error, loading: false });
    }
  },

  addPerbandingan: async (newData) => {
    try {
      await axios.post("/perbandingan/add", newData);
      await get().fetchPerbandingan();
    } catch (error) {
      console.error("Gagal tambah perbandingan:", error.response?.data || error.message);
    }
  },

  updatePerbandingan: async (id, updateData) => {
    try {
      await axios.put(`/perbandingan/update/${id}`, updateData);
      await get().fetchPerbandingan();
    } catch (error) {
      console.error("Gagal update perbandingan:", error.response?.data || error.message);
    }
  },

  deletePerbandingan: async () => {
    try {
      await axios.delete("/perbandingan/deleteall");
      await get().fetchPerbandingan();
    } catch (error) {
      console.log("gagal menghapus semuanya", error);
    }
  },
}));

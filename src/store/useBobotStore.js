import { create } from "zustand";
import axios from "../lib/axios";

export const useBobotStore = create((set, get) => ({
  bobotList: [],
  loading: false,
  result: null,
  detail: null, // untuk simpan matrix, CI, CR, dll
  isKonsisten: null, // untuk simpan status konsistensi

  fetchBobot: async () => {
    try {
      const res = await axios.get("/bobot/getall");
      set({ bobotList: res.data });
    } catch (err) {
      console.error("Fetch bobot gagal", err);
    }
  },

  hitungBobot: async () => {
    try {
      set({ loading: true });
      const res = await axios.post("/bobot/hitungbobot");
      set({
        result: res.data,
        detail: res.data.detail || null,
        loading: false,
      });
      await get().fetchBobot();
    } catch (err) {
      set({ loading: false });
      alert(err.response?.data?.message || "Gagal hitung bobot");
    }
  },

  deleteBobot: async (id) => {
    try {
      await axios.delete(`/bobot/delete/${id}`);
      await get().fetchBobot();
    } catch (err) {
      console.error("Gagal hapus bobot", err);
    }
  },
  fetchKonsistensi: async () => {
    try {
      const res = await axios.get("/bobot/konsistensi");
      set({ isKonsisten: res.data.isKonsisten });
    } catch (err) {
      console.error("Gagal ambil status konsistensi", err);
    }
  },
}));

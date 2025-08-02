// src/store/useMuridStore.js
import { create } from "zustand";
import axios from "../lib/axios";

export const useMuridStore = create((set) => ({
  muridList: [],
  loading: false,

  fetchMurid: async () => {
    try {
      const res = await axios.get("/murid/getall");
      set({ muridList: res.data });
    } catch (error) {
      console.error("Fetch murid error:", error);
    }
  },

  addMurid: async (newData) => {
    try {
      const res = await axios.post("/murid/add", newData);
      set((state) => ({
        muridList: [...state.muridList, res.data],
      }));
    } catch (error) {
      console.error("Add murid error:", error);
    }
  },

  updateMurid: async (id, updatedData) => {
    try {
      const res = await axios.put(`/murid/update/${id}`, updatedData);
      set((state) => ({
        muridList: state.muridList.map((item) => (item._id === id ? res.data : item)),
      }));
    } catch (error) {
      console.error("Update murid error:", error);
    }
  },

  deleteMurid: async (id) => {
    try {
      await axios.delete(`/murid/delete/${id}`);
      set((state) => ({
        muridList: state.muridList.filter((item) => item._id !== id),
      }));
    } catch (error) {
      console.error("Delete murid error:", error);
    }
  },
}));

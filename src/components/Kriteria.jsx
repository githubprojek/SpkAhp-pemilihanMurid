import React, { useEffect, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useKriteriaStore } from "../store/useKriteriaStore.js";
import { useAuthStore } from "../store/useLoginStore.js";
import Modal from "../components/Modal";

const Kriteria = () => {
  const { role } = useAuthStore();
  const { kriteriaList, fetchKriteria, addKriteria, deleteKriteria, updateKriteria } = useKriteriaStore();

  const [formData, setFormData] = useState({ nama: "", keterangan: "" });
  const [editId, setEditId] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchKriteria();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nama || !formData.keterangan) return;

    if (editId) {
      await updateKriteria(editId, formData);
      setEditId(null);
    } else {
      await addKriteria(formData);
    }

    setFormData({ nama: "", keterangan: "" });
    setModalOpen(false);
  };

  const handleEdit = (kriteria) => {
    setEditId(kriteria._id);
    setFormData({ nama: kriteria.nama, keterangan: kriteria.keterangan });
    setModalOpen(true);
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setFormData({ nama: "", keterangan: "" });
    setModalOpen(false);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Data Kriteria</h1>
          {role === "admin" && (
            <button
              onClick={() => {
                setFormData({ nama: "", keterangan: "" });
                setEditId(null);
                setModalOpen(true);
              }}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl transition"
            >
              <Plus className="w-5 h-5" />
              Tambah
            </button>
          )}
        </div>

        <div className="bg-white shadow rounded-2xl overflow-hidden">
          <table className="min-w-full table-auto text-sm">
            <thead className="bg-green-600 text-white">
              <tr>
                <th className="py-3 px-4 text-left">No</th>
                <th className="py-3 px-4 text-left">Nama</th>
                <th className="py-3 px-4 text-left">Keterangan</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {kriteriaList.map((item, index) => (
                <tr key={item._id} className="odd:bg-white even:bg-gray-50 border-t hover:bg-gray-100 transition">
                  <td className="py-3 px-4">{index + 1}</td>
                  <td className="py-3 px-4">{item.nama}</td>
                  <td className="py-3 px-4">{item.keterangan}</td>
                  <td className="py-3 px-4 text-center">
                    {role === "admin" ? (
                      <div className="flex justify-center gap-2">
                        <button onClick={() => handleEdit(item)} className="inline-flex items-center justify-center bg-yellow-400 hover:bg-yellow-500 text-white p-2 rounded-full transition" title="Edit">
                          <Pencil className="w-5 h-5" />
                        </button>
                        <button onClick={() => deleteKriteria(item._id)} className="inline-flex items-center justify-center bg-red-600 hover:bg-red-700 text-white p-2 rounded-full transition" title="Hapus">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                </tr>
              ))}
              {kriteriaList.length === 0 && (
                <tr>
                  <td colSpan="4" className="py-6 text-center text-gray-500 font-medium">
                    Tidak ada data kriteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Modal Form */}
        <Modal isOpen={isModalOpen} onClose={handleCancelEdit} title={editId ? "Edit Kriteria" : "Tambah Kriteria"}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama Kriteria</label>
              <input type="text" name="nama" value={formData.nama} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Keterangan</label>
              <textarea name="keterangan" value={formData.keterangan} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500" required />
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={handleCancelEdit} className="px-4 py-2 text-gray-700 bg-gray-200 rounded-xl hover:bg-gray-300">
                Batal
              </button>
              <button type="submit" className={`px-4 py-2 font-semibold text-white rounded-xl transition ${editId ? "bg-yellow-500 hover:bg-yellow-600" : "bg-green-600 hover:bg-green-700"}`}>
                {editId ? "Update" : "Tambah"}
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
};

export default Kriteria;

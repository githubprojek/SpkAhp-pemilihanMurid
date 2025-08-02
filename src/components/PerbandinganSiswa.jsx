import React, { useEffect, useState } from "react";
import { useKriteriaStore } from "../store/useKriteriaStore";
import { useMuridStore } from "../store/useMuridStore";
import { usePerbandinganMuridStore } from "../store/usePerbandinganMuridStore";
import { Plus, Trash2 } from "lucide-react";
import { useAuthStore } from "../store/useLoginStore";

import Modal from "../components/Modal";

const PerbandinganSiswa = () => {
  const { kriteriaList, fetchKriteria } = useKriteriaStore();
  const { role } = useAuthStore();
  const { muridList, fetchMurid } = useMuridStore();
  const { list, fetchAll, addPerbandingan, deletePerbandingan, deleteByKriteria, error, message, loading } = usePerbandinganMuridStore();

  const [isModalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({ kriteria: "", murid1: "", murid2: "", nilai: "" });

  useEffect(() => {
    fetchKriteria();
    fetchMurid();
    fetchAll();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.kriteria && formData.murid1 && formData.murid2 && formData.nilai && formData.murid1 !== formData.murid2) {
      await addPerbandingan(formData);
      setFormData({ kriteria: "", murid1: "", murid2: "", nilai: "" });
      setModalOpen(false);
    }
  };

  const grouped = list.reduce((acc, item) => {
    const kId = item.kriteria?._id;
    const kNama = item.kriteria?.nama || "-";
    if (!acc[kId]) acc[kId] = { nama: kNama, data: [] };
    acc[kId].data.push(item);
    return acc;
  }, {});

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Perbandingan Siswa per Kriteria</h1>
        {role !== "admin" && (
          <button onClick={() => setModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl">
            <Plus size={18} /> Tambah Perbandingan
          </button>
        )}
      </div>

      {message && <p className="text-green-600 mb-4">{message}</p>}
      {error && <p className="text-red-600 mb-4">{error}</p>}

      {Object.entries(grouped).map(([id, group], index) => {
        const matrix = {};
        const muridNames = muridList.map((m) => ({ id: m._id, nama: m.nama }));

        group.data.forEach((item) => {
          matrix[`${item.murid1?._id}-${item.murid2?._id}`] = item.nilai;
        });

        return (
          <div key={id} className="mb-10">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-semibold text-gray-800">
                {index + 1}. {group.nama}
              </h2>
              {role !== "admin" && (
                <button onClick={() => deleteByKriteria(id)} className="bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1 rounded flex items-center gap-1">
                  <Trash2 size={16} /> Hapus Tabel
                </button>
              )}
            </div>
            <div className="bg-white rounded-xl shadow overflow-hidden">
              <table className="w-full text-sm text-center">
                <thead className="bg-green-600 text-white">
                  <tr>
                    <th className="p-2">Nama</th>
                    {muridNames.map((m) => (
                      <th key={m.id} className="p-2 whitespace-nowrap">
                        {m.nama}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {muridNames.map((rowMurid) => (
                    <tr key={rowMurid.id} className="text-center border-t">
                      <td className="font-medium bg-gray-100 p-2 text-left">{rowMurid.nama}</td>
                      {muridNames.map((colMurid) => {
                        const key = `${rowMurid.id}-${colMurid.id}`;
                        const val = rowMurid.id === colMurid.id ? "1" : matrix[key];
                        return (
                          <td key={colMurid.id} className="p-2">
                            {val !== undefined ? val : "-"}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}

      {/* MODAL: Input Perbandingan */}
      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title="Tambah Perbandingan Murid">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="font-medium">Kriteria</label>
            <select name="kriteria" value={formData.kriteria} onChange={handleChange} className="w-full border p-2 rounded" required>
              <option value="">-- Pilih --</option>
              {kriteriaList.map((k) => (
                <option key={k._id} value={k._id}>
                  {k.nama}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="font-medium">Murid 1</label>
            <select name="murid1" value={formData.murid1} onChange={handleChange} className="w-full border p-2 rounded" required>
              <option value="">-- Pilih --</option>
              {muridList.map((m) => (
                <option key={m._id} value={m._id}>
                  {m.nama}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="font-medium">Murid 2</label>
            <select name="murid2" value={formData.murid2} onChange={handleChange} className="w-full border p-2 rounded" required>
              <option value="">-- Pilih --</option>
              {muridList.map((m) => (
                <option key={m._id} value={m._id}>
                  {m.nama}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="font-medium">Nilai Perbandingan (1-9)</label>
            <input
              type="number"
              step="0.0001" // ✅ memungkinkan input desimal sampai 4 digit
              min="0.1111" // ✅ karena 1/9 = 0.1111
              max="9"
              name="nilai"
              value={formData.nilai}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl mt-2">
            Simpan
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default PerbandinganSiswa;

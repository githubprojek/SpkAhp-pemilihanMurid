import React, { useEffect, useState } from "react";
import { usePerbandinganStore } from "../store/usePerbandinganStore.js";
import { useKriteriaStore } from "../store/useKriteriaStore.js";
import { useAuthStore } from "../store/useLoginStore.js";
import { PlusCircle, Trash2 } from "lucide-react";
import Modal from "../components/Modal";

const Perbandingan = () => {
  const { role } = useAuthStore();
  const { perbandinganList, fetchPerbandingan, addPerbandingan, deletePerbandingan } = usePerbandinganStore();
  const { kriteriaList, fetchKriteria } = useKriteriaStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    kriteria1: "",
    kriteria2: "",
    nilai_kriteria: "",
  });

  useEffect(() => {
    fetchPerbandingan();
    fetchKriteria();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "nilai_kriteria") {
      // Hanya izinkan angka & titik (validasi ringan)
      if (/^[0-9]*\.?[0-9]*$/.test(value)) {
        setFormData({ ...formData, [name]: value });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.kriteria1 === formData.kriteria2) {
      alert("Tidak boleh membandingkan kriteria dengan dirinya sendiri.");
      return;
    }
    await addPerbandingan(formData);
    setFormData({ kriteria1: "", kriteria2: "", nilai_kriteria: "" });
    setIsModalOpen(false);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold text-gray-800">Perbandingan Kriteria</h1>
        {role === "admin" && (
          <div className="flex items-center gap-3">
            <button onClick={() => setIsModalOpen(true)} className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl transition duration-200 shadow-md">
              <PlusCircle className="w-5 h-5" />
              Tambah
            </button>
            <button onClick={() => deletePerbandingan()} className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl transition duration-200 shadow-md">
              <Trash2 className="w-5 h-5" />
              Hapus
            </button>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow overflow-auto">
        <table className="w-full text-sm text-center">
          <thead className="bg-green-600 text-white">
            <tr>
              <th className="p-2">Kriteria / Kriteria</th>
              {kriteriaList.map((k) => (
                <th key={k._id} className="p-2">
                  {k.nama}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {kriteriaList.map((rowKriteria) => (
              <tr key={rowKriteria._id} className="border-t">
                <td className="font-semibold text-left bg-gray-50 p-2">{rowKriteria.nama}</td>
                {kriteriaList.map((colKriteria) => {
                  const isSame = rowKriteria._id === colKriteria._id;
                  const pair = perbandinganList.find((p) => p.kriteria1 === rowKriteria._id && p.kriteria2 === colKriteria._id);
                  let value = "-";
                  if (isSame) {
                    value = "1";
                  } else if (pair) {
                    const raw = pair.kriteria1 === rowKriteria._id ? pair.nilai_kriteria : 1 / pair.nilai_kriteria;

                    // Jika bilangan bulat, tampilkan tanpa desimal. Jika desimal, tampilkan maksimal 4 digit tanpa trailing 0.
                    value =
                      Number(raw) % 1 === 0
                        ? Number(raw).toString()
                        : Number(raw)
                            .toFixed(4)
                            .replace(/\.?0+$/, "");
                  }

                  return (
                    <td key={colKriteria._id} className="p-2">
                      {value}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Tambah Perbandingan">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-gray-600">Kriteria 1</label>
            <select name="kriteria1" value={formData.kriteria1} onChange={handleChange} required className="w-full mt-1 p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400">
              <option value="">Pilih Kriteria 1</option>
              {kriteriaList.map((k) => (
                <option key={k._id} value={k._id}>
                  {k.nama}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-600">Kriteria 2</label>
            <select name="kriteria2" value={formData.kriteria2} onChange={handleChange} required className="w-full mt-1 p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400">
              <option value="">Pilih Kriteria 2</option>
              {kriteriaList.map((k) => (
                <option key={k._id} value={k._id}>
                  {k.nama}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-600">Nilai Perbandingan</label>
            <input
              type="text"
              name="nilai_kriteria"
              value={formData.nilai_kriteria}
              onChange={handleChange}
              required
              placeholder="Contoh: 3, 0.3333"
              className="w-full mt-1 p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>
          <div className="text-right pt-4">
            <button type="submit" className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-xl transition duration-200 shadow-md">
              <PlusCircle className="w-5 h-5" />
              Simpan
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Perbandingan;

import React, { useEffect, useState } from "react";
import { useMuridStore } from "../store/useMuridStore";
import { Plus, Trash2, Pencil, FileDown } from "lucide-react";
import Modal from "./Modal";
import { useAuthStore } from "../store/useLoginStore";
import { base64logo } from "../assets/base64logo.js";

const Siswa = () => {
  const { muridList, fetchMurid, addMurid, updateMurid, deleteMurid } = useMuridStore();
  const { user } = useAuthStore();
  const isGuru = user?.role === "guru";

  const [form, setForm] = useState({ nis: "", nama: "", kelas: "", email: "" });
  const [editingId, setEditingId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchMurid();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await updateMurid(editingId, form);
    } else {
      await addMurid(form);
    }
    setForm({ nis: "", nama: "", kelas: "", email: "" });
    setEditingId(null);
    setIsModalOpen(false);
  };

  const handleEdit = (murid) => {
    setForm({ nis: murid.nis, nama: murid.nama, kelas: murid.kelas, email: murid.email });
    setEditingId(murid._id);
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setForm({ nis: "", nama: "", kelas: "", email: "" });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleExportPDF = () => {
    const tableBody = [
      [
        { text: "No", bold: true },
        { text: "NIS", bold: true },
        { text: "Nama", bold: true },
        { text: "Kelas", bold: true },
        { text: "Email", bold: true },
      ],
    ];

    muridList.forEach((murid, index) => {
      tableBody.push([index + 1, murid.nis || "-", murid.nama || "-", murid.kelas || "-", murid.email || "-"]);
    });

    // Pisahkan weekday & tanggal agar bisa tambahkan koma secara manual
    const today = new Date();
    const weekday = today.toLocaleDateString("id-ID", { weekday: "long" });
    const datePart = today.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    const docDefinition = {
      content: [
        {
          table: {
            widths: [30, "*"],
            body: [
              [
                {
                  image: base64logo,
                  width: 75,
                  margin: [50, 0, 10, 0],
                },
                {
                  stack: [
                    {
                      text: "YAYASAN AT-TAQWA KEMIRI JAYA (YATKJ)",
                      style: "schoolType",
                      alignment: "center",
                      margin: [0, 0, 0, 2],
                    },
                    {
                      text: "SMA CITRA NEGARA",
                      style: "schoolName",
                      alignment: "center",
                      margin: [0, 0, 0, 2],
                    },
                    {
                      text: "TERAKREDITASI 'A'",
                      style: "schoolAkreditasi",
                      alignment: "center",
                      margin: [0, 0, 0, 4],
                    },
                    {
                      text: "Jl. Raya Tanah Baru Jl. Kemiri Jaya 2 No.99, Beji, Kota Depok 16421 Telp (021) 77213470",
                      style: "schoolInfo",
                      alignment: "center",
                    },
                    {
                      text: "Website: smp-smkcitranegara.com, Email: smkcitranegara@ymail.com",
                      style: "schoolInfo",
                      alignment: "center",
                      margin: [0, 2, 0, 0],
                    },
                  ],
                },
              ],
            ],
          },
          layout: "noBorders",
          margin: [0, 0, 0, 5],
        },

        { canvas: [{ type: "line", x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1.5 }] },

        {
          text: "LAPORAN DATA SISWA",
          style: "title",
          alignment: "center",
          decoration: "underline",
          margin: [0, 15, 0, 10],
        },
        {
          text: `Tanggal : ${today.toLocaleDateString("id-ID")}`,
          alignment: "left",
          fontSize: 12,
          margin: [0, 0, 0, 5],
        },
        {
          text: "No. Surat: -/-/-",
          fontSize: 12,
          alignment: "left",
          margin: [0, 0, 0, 20],
        },
        {
          text:
            "Data ini mencakup informasi dasar siswa seperti NIS, nama, kelas, dan email, yang telah dihimpun secara sistematis dari sistem informasi sekolah. " +
            "Informasi ini dapat digunakan sebagai referensi dalam kegiatan akademik, administrasi, maupun pelaporan lainnya. " +
            "Kami berkomitmen untuk menjaga keakuratan dan kerahasiaan data sesuai dengan kebijakan perlindungan data siswa yang berlaku.",
          style: "paragraph",
        },
        {
          style: "tableContainer",
          layout: {
            hLineWidth: () => 0.5,
            vLineWidth: () => 0.5,
            hLineColor: () => "#ccc",
            vLineColor: () => "#ccc",
          },
          table: {
            widths: [30, 70, "*", 60, "*"],
            headerRows: 1,
            body: tableBody,
          },
        },
        {
          text: `Depok, ${weekday}, ${datePart}`,
          alignment: "right",
          fontSize: 12,
          margin: [0, 50, 0, 0],
        },
        {
          text: "Mengetahui,\nKepala Sekolah",
          alignment: "right",
          fontSize: 12,
          margin: [0, 0, 0, 60],
        },
        {
          text: "( Ahmad Taufik, S.Kom )",
          alignment: "right",
          fontSize: 12,
        },
      ],
      styles: {
        schoolType: { fontSize: 14, bold: true },
        schoolName: { fontSize: 22, bold: true },
        schoolAkreditasi: { fontSize: 14, bold: true },
        schoolInfo: { fontSize: 8, bold: true },
        title: { fontSize: 14, bold: true },
        paragraph: {
          fontSize: 12,
          lineHeight: 1.5,
          alignment: "justify",
        },
        tableContainer: {
          margin: [0, 5, 0, 15],
          alignment: "center",
        },
      },
    };

    pdfMake.createPdf(docDefinition).open();
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Data Siswa</h1>
        <div className="flex items-center gap-2">
          {isGuru && (
            <button onClick={openAddModal} className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
              <Plus size={18} />
              Tambah Siswa
            </button>
          )}
          <button onClick={handleExportPDF} className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl">
            <FileDown size={18} /> Export PDF
          </button>
        </div>
      </div>

      {/* Modal Form */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? "Edit Siswa" : "Tambah Siswa"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="nis" placeholder="NIS" value={form.nis} onChange={handleChange} className="input w-full" required />
          <input type="text" name="nama" placeholder="Nama" value={form.nama} onChange={handleChange} className="input w-full" required />
          <input type="text" name="kelas" placeholder="Kelas" value={form.kelas} onChange={handleChange} className="input w-full" required />
          <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} className="input w-full" required />
          <button type="submit" className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">
            {editingId ? "Update Siswa" : "Tambah Siswa"}
          </button>
        </form>
      </Modal>

      {/* Tabel Siswa */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm text-center">
          <thead className="bg-green-600 text-white">
            <tr>
              <th className="py-3">No</th>
              <th className="py-3">NIS</th>
              <th className="py-3">Nama</th>
              <th className="py-3">Kelas</th>
              <th className="py-3">Email</th>
              {isGuru && <th className="py-3">Aksi</th>}
            </tr>
          </thead>
          <tbody>
            {muridList.map((item, idx) => (
              <tr key={item._id} className="odd:bg-white even:bg-gray-100">
                <td className="py-2">{idx + 1}</td>
                <td>{item.nis}</td>
                <td>{item.nama}</td>
                <td>{item.kelas}</td>
                <td>{item.email}</td>
                {isGuru && (
                  <td className="flex justify-center gap-2 py-2">
                    <button onClick={() => handleEdit(item)} className="p-2 bg-yellow-400 text-white rounded-full hover:bg-yellow-500">
                      <Pencil size={16} />
                    </button>
                    <button onClick={() => deleteMurid(item._id)} className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600">
                      <Trash2 size={16} />
                    </button>
                  </td>
                )}
              </tr>
            ))}
            {muridList.length === 0 && (
              <tr>
                <td colSpan={isGuru ? 6 : 5} className="py-4 text-gray-400 italic">
                  Belum ada data siswa
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Siswa;

import React, { useEffect } from "react";
import { useBobotStore } from "../store/useBobotStore.js";
import { useKriteriaStore } from "../store/useKriteriaStore.js";
import { useAuthStore } from "../store/useLoginStore.js";
import { RefreshCcw, Trash2, FileDown } from "lucide-react";
import { base64logo } from "../assets/base64logo.js";

const Bobot = () => {
  const { role } = useAuthStore();
  const { bobotList, fetchBobot, hitungBobot, deleteBobot, result, loading } = useBobotStore();
  const { kriteriaList, fetchKriteria } = useKriteriaStore();

  useEffect(() => {
    fetchBobot();
    fetchKriteria();
  }, []);

  // Fungsi export ke PDF
  const handleExportPDF = () => {
    const tableBody = [
      [
        { text: "No", bold: true },
        { text: "Nama Kriteria", bold: true },
        { text: "Bobot", bold: true },
        { text: "Lambda", bold: true },
        { text: "CI", bold: true },
        { text: "CR", bold: true },
        { text: "Konsisten", bold: true },
      ],
    ];

    bobotList.forEach((item, index) => {
      const showAHPMetrics = index === 0;
      tableBody.push([
        index + 1,
        item.kriteria?.nama || "-",
        item.bobot.toFixed(4),
        showAHPMetrics ? item.lambdaMax?.toFixed(4) : "",
        showAHPMetrics ? item.CI?.toFixed(4) : "",
        showAHPMetrics ? item.CR?.toFixed(4) : "",
        showAHPMetrics ? (item.isKonsisten ? "True" : "False") : "",
      ]);
    });

    // Format tanggal akhir (dengan koma setelah weekday)
    const today = new Date();
    const weekday = today.toLocaleDateString("id-ID", { weekday: "long" });
    const datePart = today.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    const docDefinition = {
      content: [
        // HEADER SEKOLAH
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
                    { text: "YAYASAN AT-TAQWA KEMIRI JAYA (YATKJ)", style: "schoolType", alignment: "center", margin: [0, 0, 0, 2] },
                    { text: "SMA CITRA NEGARA", style: "schoolName", alignment: "center", margin: [0, 0, 0, 2] },
                    { text: "TERAKREDITASI 'A'", style: "schoolAkreditasi", alignment: "center", margin: [0, 0, 0, 4] },
                    { text: "Jl. Raya Tanah Baru Jl. Kemiri Jaya 2 No.99, Beji, Kota Depok 16421 Telp (021) 77213470", style: "schoolInfo", alignment: "center" },
                    { text: "Website: smp-smkcitranegara.com, Email: smkcitranegara@ymail.com", style: "schoolInfo", alignment: "center", margin: [0, 2, 0, 0] },
                  ],
                },
              ],
            ],
          },
          layout: "noBorders",
          margin: [0, 0, 0, 5],
        },

        { canvas: [{ type: "line", x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1.5 }] },

        // JUDUL
        {
          text: "LAPORAN BOBOT KRITERIA AHP",
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

        // PARAGRAF FORMAL
        {
          text: "Berikut ini adalah laporan bobot kriteria berdasarkan metode AHP (Analytic Hierarchy Process). Setiap kriteria dievaluasi secara kuantitatif dan divalidasi menggunakan nilai konsistensi (CR) untuk memastikan keabsahan model penilaian.",
          style: "paragraph",
        },
        {
          text: "Laporan ini dapat digunakan sebagai referensi utama dalam pengambilan keputusan akademik atau administratif berdasarkan analisis kriteria yang obyektif.",
          style: "paragraph",
          margin: [0, 0, 0, 20],
        },

        // TABEL PENILAIAN
        {
          style: "tableContainer",
          layout: {
            hLineWidth: () => 0.5,
            vLineWidth: () => 0.5,
            hLineColor: () => "#ccc",
            vLineColor: () => "#ccc",
          },
          table: {
            widths: [30, "*", 60, 60, 60, 60, 60],
            headerRows: 1,
            body: tableBody,
          },
        },

        // TANGGAL & TTD
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
        schoolType: {
          fontSize: 14,
          bold: true,
        },
        schoolName: {
          fontSize: 22,
          bold: true,
        },
        schoolAkreditasi: {
          fontSize: 14,
          bold: true,
        },
        schoolInfo: {
          fontSize: 8,
          bold: true,
        },
        title: {
          fontSize: 14,
          bold: true,
        },
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
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Bobot Kriteria</h1>
        <div className="flex items-center gap-2">
          {role === "admin" && (
            <button onClick={hitungBobot} disabled={loading} className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl transition shadow">
              <RefreshCcw className="w-4 h-4" />
              {loading ? "Menghitung..." : "Hitung Bobot"}
            </button>
          )}
          <button onClick={handleExportPDF} className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl">
            <FileDown size={18} /> Export PDF
          </button>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-2xl overflow-hidden border border-gray-100">
        <table className="min-w-full text-sm text-center text-gray-700">
          <thead className="bg-green-600 text-white">
            <tr>
              <th className="py-3 px-4">No</th>
              <th className="py-3 px-4">Nama Kriteria</th>
              <th className="py-3 px-4">Bobot</th>
              <th className="py-3 px-4">Lambda</th>
              <th className="py-3 px-4">CI</th>
              <th className="py-3 px-4">CR</th>
              <th className="py-3 px-4">Konsisten</th>
            </tr>
          </thead>
          <tbody>
            {bobotList.map((item, index) => {
              const kriteria = kriteriaList.find((k) => k._id === item.kriteria);
              const showAHPMetrics = index === 0; // hanya tampilkan di baris pertama
              return (
                <tr key={item._id} className="odd:bg-white even:bg-gray-50 border-t">
                  <td className="py-3 px-4">{index + 1}</td>
                  <td className="py-3 px-4">{item?.kriteria?.nama || "-"}</td>
                  <td className="py-3 px-4">{item.bobot}</td>
                  <td className="py-3 px-4">{showAHPMetrics && item.lambdaMax?.toFixed(2)}</td>
                  <td className="py-3 px-4">{showAHPMetrics && item.CI?.toFixed(2)}</td>
                  <td className="py-3 px-4">{showAHPMetrics && item.CR?.toFixed(2)}</td>
                  <td className="py-3 px-4">{showAHPMetrics && (item.isKonsisten ? "✔️" : "❌")}</td>
                </tr>
              );
            })}

            {bobotList.length === 0 && (
              <tr>
                <td colSpan="4" className="py-6 text-gray-400 italic">
                  Belum ada data bobot.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Bobot;

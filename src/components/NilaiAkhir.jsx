import React, { useEffect } from "react";
import { usePenilaianAkhirStore } from "../store/usePenilaianAkhirStore";
import { RotateCw, FileDown } from "lucide-react";
import { base64logo } from "../assets/base64logo.js";

import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

pdfMake.vfs = pdfFonts.vfs;

const PenilaianAkhir = () => {
  const { list, fetchAll, hitung, error, message } = usePenilaianAkhirStore();

  useEffect(() => {
    fetchAll();
  }, []);

  const sortedList = [...list].sort((a, b) => b.totalSkor - a.totalSkor);

  // Ambil semua nama kriteria unik
  const kriteriaSet = new Set();
  sortedList.forEach((item) => item.rincian.forEach((r) => kriteriaSet.add(r.kriteria?.nama)));
  const kriteriaHeaders = Array.from(kriteriaSet);

  // Fungsi export ke PDF
  const handleExportPDF = () => {
    const tableBody = [[{ text: "No", bold: true }, { text: "Nama Murid", bold: true }, ...kriteriaHeaders.map((k) => ({ text: k, bold: true })), { text: "Total Skor", bold: true }]];

    sortedList.forEach((item, i) => {
      const muridKriteriaMap = {};
      item.rincian.forEach((r) => {
        muridKriteriaMap[r.kriteria?.nama] = r.bobotMurid;
      });

      const row = [i + 1, item.murid?.nama || "-", ...kriteriaHeaders.map((k) => (muridKriteriaMap[k] !== undefined ? muridKriteriaMap[k].toFixed(4) : "-")), item.totalSkor.toFixed(4)];
      tableBody.push(row);
    });

    // Format tanggal
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
          text: "LAPORAN PENILAIAN AKHIR MURID",
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
          text: "Dengan ini kami lampirkan hasil penilaian akhir seluruh murid berdasarkan beberapa kriteria akademik dan non-akademik. Proses evaluasi dilakukan secara objektif menggunakan metode AHP (Analytic Hierarchy Process), yang telah mempertimbangkan bobot kriteria dan penilaian individu murid terhadap setiap kriteria tersebut.",
          style: "paragraph",
        },
        {
          text: "Diharapkan hasil ini dapat menjadi acuan dalam proses evaluasi akademik dan pengambilan keputusan lebih lanjut, serta sebagai dasar transparansi penilaian kepada pihak yang berkepentingan.",
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
            widths: [30, 100, ...kriteriaHeaders.map(() => 60), 60],
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
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Penilaian Akhir Murid</h1>
        <div className="flex items-center gap-2">
          <button onClick={hitung} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl">
            <RotateCw size={18} /> Hitung Ulang
          </button>
          <button onClick={handleExportPDF} className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl">
            <FileDown size={18} /> Export PDF
          </button>
        </div>
      </div>

      {message && <p className="text-green-600">{message}</p>}
      {error && <p className="text-red-600">{error}</p>}

      <div className="bg-white rounded-xl shadow border overflow-auto">
        <table className="w-full text-sm text-center">
          <thead className="bg-green-600 text-white">
            <tr>
              <th className="p-2">Ranking</th>
              <th className="p-2">Nama Murid</th>
              {kriteriaHeaders.map((nama) => (
                <th key={nama} className="p-2">
                  {nama}
                </th>
              ))}
              <th className="p-2">Total Skor</th>
            </tr>
          </thead>
          <tbody>
            {sortedList.map((item, i) => {
              const muridKriteriaMap = {};
              item.rincian.forEach((r) => {
                muridKriteriaMap[r.kriteria?.nama] = r.bobotMurid;
              });

              return (
                <tr key={item._id} className="border-t">
                  <td className="p-2 font-bold">#{i + 1}</td>
                  <td className="p-2">{item.murid?.nama}</td>
                  {kriteriaHeaders.map((nama) => (
                    <td key={nama} className="p-2">
                      {muridKriteriaMap[nama] !== undefined ? muridKriteriaMap[nama].toFixed(3) : "-"}
                    </td>
                  ))}
                  <td className="p-2 font-semibold">{item.totalSkor.toFixed(3)}</td>
                </tr>
              );
            })}
            {sortedList.length === 0 && (
              <tr>
                <td colSpan={kriteriaHeaders.length + 3} className="p-4 text-center text-gray-500 italic">
                  Tidak ada data penilaian akhir.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PenilaianAkhir;

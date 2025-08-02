import React, { useEffect } from "react";
import { useBobotSiswaStore } from "../store/useBobotSiswaStore";
import { RotateCw, FileDown } from "lucide-react";
import { base64logo } from "../assets/base64logo.js";

const BobotMurid = () => {
  const { list, fetchAll, hitungBobot, loading, error, message } = useBobotSiswaStore();

  useEffect(() => {
    fetchAll();
  }, []);

  // Fungsi truncate di frontend
  const truncateNumber = (num, digits) => {
    const factor = Math.pow(10, digits);
    return Math.trunc(num * factor) / factor;
  };

  // Kelompokkan data berdasarkan kriteria
  const grouped = list.reduce((acc, item) => {
    const key = item.kriteria?._id;
    const kriteriaNama = item.kriteria?.nama || "-";
    if (!acc[key]) acc[key] = { nama: kriteriaNama, cr: item.CR, bobots: {} };
    acc[key].bobots[item.murid?.nama] = item.bobot;
    if (item.CR !== undefined) acc[key].cr = item.CR;
    return acc;
  }, {});

  const kriteriaList = Object.values(grouped);
  const muridNames = Array.from(new Set(list.map((item) => item.murid?.nama)));

  const handleExportPDF = () => {
    const headerRow = [{ text: "Nama Murid", bold: true }, ...kriteriaList.map((group) => ({ text: group.nama, bold: true })), { text: "CR", bold: true }];

    const tableBody = [headerRow];

    muridNames.forEach((nama) => {
      const row = [{ text: nama }];
      let crList = [];

      kriteriaList.forEach((group) => {
        const val = group.bobots[nama];
        crList.push(group.cr || 0);
        row.push({
          text: val !== undefined ? truncateNumber(val, 3).toFixed(3) : "-",
        });
      });

      const averageCR = truncateNumber(crList.reduce((a, b) => a + b, 0) / crList.length, 3).toFixed(3);

      row.push({ text: averageCR });
      tableBody.push(row);
    });

    // Format tanggal akhir
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
                { image: base64logo, width: 75, margin: [50, 0, 10, 0] },
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
          text: "LAPORAN BOBOT MURID PER KRITERIA",
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
          text: "Dengan ini kami lampirkan hasil bobot murid terhadap masing-masing kriteria. Proses perhitungan dilakukan dengan metode AHP (Analytic Hierarchy Process) yang mengukur tingkat kontribusi siswa pada setiap kriteria, disertai dengan nilai CR (Consistency Ratio) sebagai indikator validitas perbandingan.",
          style: "paragraph",
          margin: [0, 0, 0, 20],
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
            widths: [100, ...kriteriaList.map(() => "*"), 40],
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
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-2xl font-bold">Bobot Murid (Per Kriteria)</h1>
        <div className="flex items-center gap-2">
          <button onClick={hitungBobot} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl">
            <RotateCw size={18} /> Hitung Ulang
          </button>
          <button onClick={handleExportPDF} className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl">
            <FileDown size={18} /> Export PDF
          </button>
        </div>
      </div>

      {message && <p className="text-green-600 mb-4">{message}</p>}
      {error && <p className="text-red-600 mb-4">{error}</p>}

      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm text-center">
          <thead className="bg-green-600 text-white">
            <tr>
              <th className="p-2">Nama Murid</th>
              {kriteriaList.map((group) => (
                <th key={group.nama} className="p-2">
                  {group.nama}
                  <br />
                  <span className="text-xs">CR: {truncateNumber(group.cr || 0, 3).toFixed(3)}</span>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {muridNames.map((nama) => {
              const row = kriteriaList.map((group) => {
                const val = group.bobots[nama];
                return (
                  <td key={group.nama} className="p-2">
                    {val !== undefined ? truncateNumber(val, 3).toFixed(3) : "-"}
                  </td>
                );
              });

              return (
                <tr key={nama} className="border-t">
                  <td className="p-2 font-semibold text-left">{nama}</td>
                  {row}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BobotMurid;

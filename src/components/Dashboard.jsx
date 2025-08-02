import React, { useEffect } from "react";
import { useMuridStore } from "../store/useMuridStore";
import { useKriteriaStore } from "../store/useKriteriaStore";
import { useBobotStore } from "../store/useBobotStore";
import { usePerbandinganStore } from "../store/usePerbandinganStore";
import { usePenilaianAkhirStore } from "../store/usePenilaianAkhirStore";

import { BarChart2, Users, ListChecks, CheckCircle2, XCircle } from "lucide-react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const Dashboard = () => {
  const { muridList, fetchMurid } = useMuridStore();
  const { kriteriaList, fetchKriteria } = useKriteriaStore();
  const { result, fetchBobot, fetchKonsistensi, isKonsisten, bobotList } = useBobotStore();
  const { perbandinganList, fetchPerbandingan } = usePerbandinganStore();
  const { list, fetchAll } = usePenilaianAkhirStore();

  useEffect(() => {
    fetchMurid();
    fetchKriteria();
    fetchBobot();
    fetchKonsistensi();
    fetchPerbandingan();
    fetchKonsistensi();
    fetchAll();
  }, []);

  useEffect(() => {
    console.log("Result fetchall:", list);
  });

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Dashboard</h1>

      {/* STATISTICS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={<Users size={28} className="text-white" />} title="Jumlah Murid" value={muridList.length} color="bg-blue-500" />
        <StatCard icon={<ListChecks size={28} className="text-white" />} title="Jumlah Kriteria" value={kriteriaList.length} color="bg-amber-500" />
        <StatCard icon={<BarChart2 size={28} className="text-white" />} title="Jumlah Perbandingan" value={perbandinganList.length} color="bg-purple-600" />
        <StatCard
          icon={isKonsisten ? <CheckCircle2 size={28} className="text-white" /> : <XCircle size={28} className="text-white" />}
          title="Perbandingan Kriteria"
          value={isKonsisten ? "Konsisten" : "Tidak Konsisten"}
          color={isKonsisten ? "bg-green-600" : "bg-red-600"}
        />
      </div>

      {/* RINGKASAN BOBOT */}
      <div className="mt-10 bg-white shadow rounded-xl p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Perbandingan Kriteria (Ringkasan)</h2>
        {Array.isArray(bobotList) && bobotList.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {bobotList.map((item, idx) => (
              <div key={idx} className="border rounded-lg p-4 shadow-sm hover:shadow transition">
                <h3 className="text-sm font-medium text-gray-600">{item?.kriteria?.nama || "-"}</h3>
                <p className="text-lg font-semibold text-gray-800">{typeof item?.bobot === "number" ? item?.bobot.toFixed(4) : "-"}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic">Belum ada data bobot kriteria.</p>
        )}
      </div>

      {Array.isArray(list) && list.length > 0 && Array.isArray(list) && list.length > 0 && (
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Tabel Penilaian Akhir */}
          <div className="bg-white shadow rounded-xl p-6 overflow-x-auto">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Tabel Penilaian Akhir</h2>
            <table className="w-full text-sm text-center border">
              <thead className="bg-green-600 text-white">
                <tr>
                  <th className="py-2">No</th>
                  <th className="py-2">Nama Siswa</th>
                  <th className="py-2">Skor Akhir</th>
                </tr>
              </thead>
              <tbody>
                {[...list]
                  .sort((a, b) => b.bobot - a.bobot)
                  .map((item, idx) => (
                    <tr key={idx} className="odd:bg-white even:bg-gray-100">
                      <td className="py-2">{idx + 1}</td>
                      <td>{item?.murid?.nama || "-"}</td>
                      <td> {item.totalSkor.toFixed(4) || "-"}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* Chart Bobot Kriteria */}
          <div className="bg-white shadow rounded-xl p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Chart Bobot Kriteria</h2>
            <Bar
              data={{
                labels: bobotList.map((item) => item?.kriteria?.nama),
                datasets: [
                  {
                    label: "Bobot",
                    data: bobotList.map((item) => item.bobot),
                    backgroundColor: ["#f87171", "#60a5fa", "#34d399", "#fbbf24", "#a78bfa", "#fb923c", "#06b6d4", "#10b981", "#e879f9", "#f472b6"],
                    borderRadius: 5,
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      color: "#4b5563",
                    },
                  },
                  x: {
                    ticks: {
                      color: "#4b5563",
                    },
                  },
                },
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ icon, title, value, color }) => (
  <div className={`rounded-lg shadow p-5 flex items-center gap-4 ${color}`}>
    <div className="bg-white/20 p-2 rounded-md">{icon}</div>
    <div>
      <h3 className="text-white text-sm">{title}</h3>
      <p className="text-white text-xl font-bold">{value}</p>
    </div>
  </div>
);

export default Dashboard;

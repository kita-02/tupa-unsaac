import { useEffect, useState } from "react";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { api } from "../../services/api";

const COLORS = ["#4f46e5", "#f59e0b", "#10b981", "#ef4444", "#8b5cf6", "#06b6d4"];

export default function Reportes() {
  const [s, setS] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => { api.stats().then(setS).catch((e) => setError(e.message)); }, []);
  if (error) return <div className="max-w-7xl mx-auto px-4 py-10 text-red-600">{error}</div>;
  if (!s) return <div className="max-w-7xl mx-auto px-4 py-10 text-slate-500">Generando reportes...</div>;

  const stateData = Object.entries(s.by_state).map(([name, total]) => ({ name: name.replaceAll("_", " "), total }));
  const procData = s.by_procedure.filter((p) => p.total > 0);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex flex-wrap justify-between items-center gap-3">
        <div>
          <h1 className="text-3xl font-bold">Reportes y estadísticas</h1>
          <p className="text-slate-500 mt-1">Indicadores de trámites procesados</p>
        </div>
        <a href={api.csvUrl} className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm">
          ↓ Exportar CSV
        </a>
      </div>

      <div className="grid sm:grid-cols-4 gap-5 mt-8">
        {[["Total", s.total], ["Pendientes", s.pending], ["Procedimientos", s.total_procedures], ["Estudiantes", s.total_students]].map(([l, v]) => (
          <div key={l} className="bg-white rounded-2xl border border-slate-200 p-5">
            <p className="text-2xl font-extrabold text-indigo-700">{v}</p>
            <p className="text-sm text-slate-500">{l}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 className="font-bold mb-4">Solicitudes por estado</h2>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={stateData} dataKey="total" nameKey="name" outerRadius={90} label>
                {stateData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 className="font-bold mb-4">Solicitudes por procedimiento</h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={procData}>
              <XAxis dataKey="code" fontSize={11} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="total" fill="#4f46e5" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 mt-6">
        <h2 className="font-bold mb-4">Solicitudes por oficina</h2>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={s.by_office}>
            <XAxis dataKey="office" fontSize={10} interval={0} angle={-18} textAnchor="end" height={70} />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="total" fill="#10b981" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../services/api";

export default function Dashboard() {
  const [s, setS] = useState(null);

  useEffect(() => { api.stats().then(setS).catch(() => {}); }, []);

  if (!s) return <div className="max-w-7xl mx-auto px-4 py-10 text-slate-500">Cargando panel...</div>;

  const cards = [
    ["Solicitudes totales", s.total, "bg-indigo-600"],
    ["Pendientes de atención", s.pending, "bg-amber-500"],
    ["Procedimientos activos", s.total_procedures, "bg-emerald-600"],
    ["Estudiantes registrados", s.total_students, "bg-violet-600"],
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold">Panel de control</h1>
      <p className="text-slate-500 mt-1">Resumen de la gestión del TUPA</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-8">
        {cards.map(([label, value, color]) => (
          <div key={label} className="bg-white rounded-2xl border border-slate-200 p-6">
            <p className={`text-3xl font-extrabold ${color}`}>{value}</p>
            <p className="text-sm text-slate-500 mt-1">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 className="font-bold mb-4">Solicitudes por estado</h2>
          {Object.keys(s.by_state).length === 0 && <p className="text-sm text-slate-500">Sin datos.</p>}
          <ul className="space-y-2">
            {Object.entries(s.by_state).map(([state, total]) => (
              <li key={state} className="flex justify-between text-sm bg-slate-50 rounded-lg px-3 py-2">
                <span className="capitalize">{state.replaceAll("_", " ")}</span>
                <span className="font-bold">{total}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 className="font-bold mb-4">Procedimientos más solicitados</h2>
          <ul className="space-y-2">
            {s.by_procedure.filter((p) => p.total > 0).map((p) => (
              <li key={p.code} className="flex justify-between text-sm bg-slate-50 rounded-lg px-3 py-2">
                <span>{p.procedure}</span>
                <span className="font-bold">{p.total}</span>
              </li>
            ))}
            {s.by_procedure.every((p) => p.total === 0) && <p className="text-sm text-slate-500">Sin solicitudes aún.</p>}
          </ul>
        </div>
      </div>

      <div className="mt-8 flex gap-3">
        <Link to="/admin/bandeja" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm">Bandeja de solicitudes</Link>
        <Link to="/admin/reportes" className="border border-slate-300 hover:bg-slate-50 font-semibold px-5 py-2.5 rounded-xl text-sm">Ver reportes completos</Link>
      </div>
    </div>
  );
}

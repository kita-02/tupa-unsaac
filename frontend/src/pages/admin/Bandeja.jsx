import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../services/api";
import StatusBadge from "../../components/StatusBadge";

const FILTERS = [
  ["", "Todas"],
  ["submitted", "Enviadas"],
  ["under_review", "En revisión"],
  ["observed", "Observadas"],
  ["approved", "Aprobadas"],
  ["rejected", "Rechazadas"],
  ["delivered", "Entregadas"],
];

export default function Bandeja() {
  const [list, setList] = useState([]);
  const [filter, setFilter] = useState("");

  useEffect(() => { api.myRequests().then(setList).catch(() => {}); }, []);
  const shown = list.filter((r) => !filter || r.state === filter);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold">Bandeja de solicitudes</h1>
      <p className="text-slate-500 mt-1">Revisión y validación de trámites recibidos</p>

      <div className="flex flex-wrap gap-2 mt-6">
        {FILTERS.map(([v, label]) => (
          <button key={v} onClick={() => setFilter(v)}
            className={`text-sm px-3.5 py-1.5 rounded-full border ${filter === v ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-slate-600 border-slate-300 hover:bg-slate-50"}`}>
            {label}
          </button>
        ))}
      </div>

      {shown.length === 0 ? (
        <p className="mt-10 text-slate-500">No hay solicitudes en esta categoría.</p>
      ) : (
        <div className="mt-6 space-y-3">
          {shown.map((r) => (
            <Link key={r.id} to={`/tramites/${r.id}`} className="block bg-white rounded-2xl border border-slate-200 p-5 hover:border-indigo-400 transition">
              <div className="flex flex-wrap justify-between items-center gap-3">
                <div>
                  <span className="text-xs font-mono text-slate-400">{r.code}</span>
                  <h3 className="font-semibold">{r.procedure_name}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{r.user_name} ({r.user_code}) · {new Date(r.created_at).toLocaleDateString("es-PE")}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-500">{r.documents.length} doc(s)</span>
                  <StatusBadge state={r.state} label={r.state_label} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

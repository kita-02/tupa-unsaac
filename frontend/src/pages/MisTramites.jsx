import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";
import StatusBadge from "../components/StatusBadge";

export default function MisTramites() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.myRequests().then((d) => { setList(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Mis trámites</h1>
          <p className="text-slate-500 mt-1">Historial y estado de tus solicitudes registradas</p>
        </div>
        <Link to="/procedimientos" className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl">
          + Nuevo trámite
        </Link>
      </div>

      {loading ? (
        <p className="mt-10 text-slate-500">Cargando...</p>
      ) : list.length === 0 ? (
        <div className="mt-10 bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
          <p className="text-slate-500">Aún no tienes solicitudes.</p>
          <Link to="/procedimientos" className="text-indigo-600 font-semibold text-sm">Explorar el catálogo →</Link>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {list.map((r) => (
            <Link key={r.id} to={`/tramites/${r.id}`} className="block bg-white rounded-2xl border border-slate-200 p-5 hover:border-indigo-400 transition">
              <div className="flex flex-wrap justify-between items-center gap-3">
                <div>
                  <span className="text-xs font-mono text-slate-400">{r.code}</span>
                  <h3 className="font-semibold">{r.procedure_name}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Oficina: {r.office_name} · Registrado: {new Date(r.created_at).toLocaleDateString("es-PE")}</p>
                </div>
                <StatusBadge state={r.state} label={r.state_label} />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

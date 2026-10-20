import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function ProcedimientoDetail() {
  const { id } = useParams();
  const [p, setP] = useState(null);
  const [error, setError] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    api.procedure(id).then(setP).catch((e) => setError(e.message));
  }, [id]);

  if (error) return <div className="max-w-3xl mx-auto px-4 py-16 text-center text-red-600">{error}</div>;
  if (!p) return <div className="max-w-3xl mx-auto px-4 py-16 text-slate-500">Cargando...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <span className="text-xs font-mono bg-indigo-50 text-indigo-700 px-2 py-1 rounded">{p.code}</span>
      <h1 className="text-3xl font-bold mt-3">{p.name}</h1>
      <p className="text-slate-600 mt-3">{p.description}</p>

      <div className="grid md:grid-cols-3 gap-4 mt-8">
        {[
          ["Oficina responsable", p.office_name || "—"],
          ["Costo", p.cost > 0 ? `S/ ${p.cost.toFixed(2)}` : "Gratuito"],
          ["Plazo de respuesta", `${p.duration_days} días hábiles`],
        ].map(([k, v]) => (
          <div key={k} className="bg-white rounded-2xl border border-slate-200 p-5">
            <p className="text-xs uppercase tracking-wide text-slate-400 font-semibold">{k}</p>
            <p className="font-semibold mt-1">{v}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 mt-6">
        <h2 className="font-bold text-lg mb-4">Requisitos</h2>
        <ul className="space-y-3">
          {p.requirements.map((r, i) => (
            <li key={i} className="flex gap-3 text-sm">
              <span className="bg-indigo-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0">{i + 1}</span>
              <span className="text-slate-700">{r}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8">
        {user?.role === "student" ? (
          <Link to={`/nueva-solicitud/${p.id}`} className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-xl">
            Iniciar este trámite →
          </Link>
        ) : user ? (
          <p className="text-sm text-slate-500">Solo los estudiantes pueden registrar solicitudes.</p>
        ) : (
          <p className="text-sm text-slate-500">
            <Link to="/login" className="text-indigo-600 font-semibold">Inicia sesión</Link> como estudiante para iniciar este trámite.
          </p>
        )}
      </div>
    </div>
  );
}

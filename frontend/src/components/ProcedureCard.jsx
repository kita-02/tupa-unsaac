import { Link } from "react-router-dom";

export default function ProcedureCard({ p }) {
  return (
    <Link to={`/procedimientos/${p.id}`} className="block bg-white rounded-2xl border border-slate-200 p-5 hover:border-indigo-400 hover:shadow-md transition group">
      <div className="flex justify-between items-start gap-3">
        <div>
          <span className="text-xs font-mono bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded">{p.code}</span>
          <h3 className="font-semibold mt-2 group-hover:text-indigo-700">{p.name}</h3>
        </div>
        <span className="text-emerald-700 font-bold text-sm whitespace-nowrap">{p.cost > 0 ? `S/ ${p.cost.toFixed(2)}` : "Gratuito"}</span>
      </div>
      <p className="text-sm text-slate-500 mt-2 line-clamp-2">{p.description}</p>
      <div className="flex justify-between items-center mt-4 text-xs text-slate-500">
        <span>📍 {p.office_name}</span>
        <span className="text-indigo-600 font-medium">Ver detalle →</span>
      </div>
    </Link>
  );
}

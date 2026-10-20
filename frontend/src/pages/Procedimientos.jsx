import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../services/api";
import ProcedureCard from "../components/ProcedureCard";

export default function Procedimientos() {
  const [params] = useSearchParams();
  const [all, setAll] = useState([]);
  const [q, setQ] = useState(params.get("q") || "");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.procedures().then((d) => { setAll(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const list = all.filter((p) => {
    const s = q.toLowerCase();
    return !s || p.name.toLowerCase().includes(s) || p.description.toLowerCase().includes(s) || p.code.toLowerCase().includes(s);
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold">Catálogo de procedimientos</h1>
      <p className="text-slate-500 mt-1">Texto Único de Procedimientos Administrativos — UNSAAC</p>

      <input
        value={q} onChange={(e) => setQ(e.target.value)}
        placeholder="Buscar procedimiento por nombre, código o descripción..."
        className="w-full md:w-96 mt-6 px-4 py-3 rounded-xl border border-slate-300 focus:border-indigo-500 outline-none bg-white"
      />

      {loading ? (
        <p className="mt-10 text-slate-500">Cargando procedimientos...</p>
      ) : list.length === 0 ? (
        <p className="mt-10 text-slate-500">No se encontraron procedimientos.</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-5 mt-8">
          {list.map((p) => <ProcedureCard key={p.id} p={p} />)}
        </div>
      )}
    </div>
  );
}

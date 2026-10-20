import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../services/api";

export default function NuevaSolicitud() {
  const { id } = useParams();
  const nav = useNavigate();
  const [p, setP] = useState(null);
  const [motivo, setMotivo] = useState("");
  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.procedure(id).then(setP).catch((e) => setError(e.message));
  }, [id]);

  const submit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const r = await api.createRequest({ procedure_id: Number(id), motivo });
      for (const f of files) {
        try { await api.uploadDoc(r.id, f); } catch { /* archivo opcional */ }
      }
      nav(`/tramites/${r.id}`);
    } catch (err) {
      setError(err.message); setLoading(false);
    }
  };

  if (error && !p) return <div className="max-w-3xl mx-auto px-4 py-16 text-red-600">{error}</div>;
  if (!p) return <div className="max-w-3xl mx-auto px-4 py-16 text-slate-500">Cargando...</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold">Nueva solicitud</h1>
      <p className="text-slate-500 mt-1">Procedimiento: <span className="font-semibold text-slate-700">{p.name}</span> ({p.code})</p>

      <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5 mt-6">
        <p className="text-sm font-semibold text-indigo-900 mb-2">Requisitos a adjuntar:</p>
        <ul className="text-sm text-indigo-800 space-y-1 list-disc list-inside">
          {p.requirements.map((r, i) => <li key={i}>{r}</li>)}
        </ul>
        <p className="text-xs text-indigo-700 mt-3">Costo: {p.cost > 0 ? `S/ ${p.cost.toFixed(2)}` : "Gratuito"} · Plazo: {p.duration_days} días hábiles</p>
      </div>

      {error && <div className="mt-4 text-sm bg-red-50 text-red-700 border border-red-200 rounded-xl px-4 py-3">{error}</div>}

      <form onSubmit={submit} className="mt-6 bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
        <div>
          <label className="text-sm font-medium">Motivo de la solicitud *</label>
          <textarea required rows={3} value={motivo} onChange={(e) => setMotivo(e.target.value)}
            placeholder="Describe brevemente el motivo del trámite..."
            className="w-full mt-1 px-4 py-2.5 rounded-xl border border-slate-300 focus:border-indigo-500 outline-none" />
        </div>
        <div>
          <label className="text-sm font-medium">Documentos de respaldo (PDF, máx. 5 MB c/u)</label>
          <input type="file" multiple accept=".pdf,.jpg,.png"
            onChange={(e) => setFiles([...e.target.files])}
            className="w-full mt-1 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-indigo-600 file:text-white file:px-4 file:py-2 file:cursor-pointer" />
          {files.length > 0 && (
            <ul className="text-xs text-slate-500 mt-2 space-y-1">
              {files.map((f, i) => <li key={i}>📎 {f.name} ({(f.size / 1024).toFixed(0)} KB)</li>)}
            </ul>
          )}
        </div>
        <div className="flex gap-3">
          <button disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2.5 rounded-xl disabled:opacity-50">
            {loading ? "Enviando..." : "Enviar solicitud"}
          </button>
          <button type="button" onClick={() => nav(-1)} className="border border-slate-300 px-6 py-2.5 rounded-xl text-sm">Cancelar</button>
        </div>
      </form>
    </div>
  );
}

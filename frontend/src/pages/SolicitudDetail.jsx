import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import StatusBadge from "../components/StatusBadge";

const STEPS = [
  ["submitted", "Enviada"],
  ["under_review", "En revisión"],
  ["approved", "Aprobada"],
  ["delivered", "Entregada"],
];

export default function SolicitudDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [r, setR] = useState(null);
  const [error, setError] = useState("");
  const [file, setFile] = useState(null);
  const fileRef = useRef();

  const load = () => api.request(id).then(setR).catch((e) => setError(e.message));
  useEffect(() => { load(); }, [id]);

  if (error) return <div className="max-w-3xl mx-auto px-4 py-16 text-red-600">{error}</div>;
  if (!r) return <div className="max-w-3xl mx-auto px-4 py-16 text-slate-500">Cargando...</div>;

  const stepIndex = STEPS.findIndex(([k]) => k === r.state);
  const isStaff = user.role === "office" || user.role === "admin";

  const upload = async (e) => {
    e.preventDefault();
    if (!file) return;
    await api.uploadDoc(r.id, file);
    setFile(null); fileRef.current.value = "";
    load();
  };

  const changeStatus = async (state, observations) => {
    await api.updateStatus(r.id, state, observations);
    load();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex flex-wrap justify-between items-start gap-3">
        <div>
          <span className="text-xs font-mono text-slate-400">{r.code}</span>
          <h1 className="text-3xl font-bold">{r.procedure_name}</h1>
          <p className="text-sm text-slate-500 mt-1">
            {r.user_name} ({r.user_code}) · {r.user_email} · Oficina: {r.office_name}
          </p>
        </div>
        <StatusBadge state={r.state} label={r.state_label} />
      </div>

      {stepIndex >= 0 && (
        <div className="flex items-center mt-8 mb-2">
          {STEPS.map(([key, label], i) => (
            <div key={key} className="flex-1 flex flex-col items-center relative">
              {i > 0 && <div className={`absolute top-3 right-1/2 w-full h-0.5 ${i <= stepIndex ? "bg-emerald-500" : "bg-slate-200"}`} />}
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs z-10 ${i <= stepIndex ? "bg-emerald-500 text-white" : "bg-slate-200 text-slate-500"}`}>{i < stepIndex ? "✓" : i + 1}</div>
              <span className="text-xs mt-1 text-slate-600">{label}</span>
            </div>
          ))}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6 mt-8">
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 className="font-bold mb-3">Información</h2>
          <p className="text-sm text-slate-600"><b>Motivo:</b> {r.data?.motivo || "—"}</p>
          <p className="text-sm text-slate-600 mt-2"><b>Registrado:</b> {new Date(r.created_at).toLocaleString("es-PE")}</p>
          <p className="text-sm text-slate-600 mt-2"><b>Última actualización:</b> {new Date(r.updated_at).toLocaleString("es-PE")}</p>
          {r.observations && (
            <div className="mt-4 bg-orange-50 border border-orange-200 rounded-xl p-3 text-sm text-orange-800">
              <b>Observaciones:</b> {r.observations}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 className="font-bold mb-3">Documentos ({r.documents.length})</h2>
          {r.documents.length === 0 && <p className="text-sm text-slate-500">Sin documentos adjuntos.</p>}
          <ul className="space-y-2">
            {r.documents.map((d) => (
              <li key={d.id} className="text-sm flex justify-between items-center bg-slate-50 rounded-lg px-3 py-2">
                <span className="truncate">📎 {d.doc_name}</span>
                <span className={`text-xs font-semibold ${d.verified ? "text-emerald-600" : "text-amber-600"}`}>
                  {d.verified ? "Verificado" : "Pendiente"}
                </span>
              </li>
            ))}
          </ul>
          <form onSubmit={upload} className="mt-4 flex gap-2">
            <input ref={fileRef} type="file" accept=".pdf,.jpg,.png" onChange={(e) => setFile(e.target.files[0])}
              className="text-xs flex-1" />
            <button className="text-xs bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg font-medium">Subir</button>
          </form>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 mt-6">
        <h2 className="font-bold mb-4">Historial del trámite</h2>
        <ul className="space-y-3">
          {[...r.history].reverse().map((h) => (
            <li key={h.id} className="flex gap-3 text-sm">
              <span className="w-2 h-2 rounded-full bg-indigo-500 mt-2 shrink-0" />
              <div>
                <span className="font-semibold capitalize">{h.to_state.replaceAll("_", " ")}</span>
                <span className="text-slate-400"> · {new Date(h.created_at).toLocaleString("es-PE")}</span>
                {h.comment && <p className="text-slate-600">{h.comment}</p>}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {isStaff && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 mt-6">
          <h2 className="font-bold mb-4">Acciones de la oficina</h2>
          <div className="flex flex-wrap gap-2">
            {r.state === "submitted" && (
              <button onClick={() => changeStatus("under_review")} className="bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold px-4 py-2 rounded-xl">Iniciar revisión</button>
            )}
            {r.state === "under_review" && (
              <>
                <button onClick={() => changeStatus("approved")} className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-4 py-2 rounded-xl">Aprobar</button>
                <button onClick={() => {
                  const obs = prompt("Motivo del rechazo:");
                  if (obs) changeStatus("rejected", obs);
                }} className="bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-4 py-2 rounded-xl">Rechazar</button>
                <button onClick={() => {
                  const obs = prompt("Describa las observaciones:");
                  if (obs) changeStatus("observed", obs);
                }} className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-4 py-2 rounded-xl">Observar</button>
              </>
            )}
            {r.state === "observed" && (
              <button onClick={() => changeStatus("under_review")} className="bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold px-4 py-2 rounded-xl">Volver a revisión</button>
            )}
            {r.state === "approved" && (
              <button onClick={() => changeStatus("delivered")} className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold px-4 py-2 rounded-xl">Marcar como entregada</button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

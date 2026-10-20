import { useEffect, useState } from "react";
import { api } from "../services/api";

export default function Notificaciones() {
  const [list, setList] = useState([]);

  const load = () => api.notifications().then(setList).catch(() => {});
  useEffect(() => { load(); }, []);

  const markAll = async () => { await api.readAll(); load(); };
  const markOne = async (n) => { if (!n.is_read) { await api.readNotification(n.id); load(); } };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Notificaciones</h1>
        <button onClick={markAll} className="text-sm text-indigo-600 font-medium hover:underline">Marcar todas como leídas</button>
      </div>

      {list.length === 0 ? (
        <p className="mt-10 text-slate-500">No tienes notificaciones.</p>
      ) : (
        <div className="mt-8 space-y-3">
          {list.map((n) => (
            <button key={n.id} onClick={() => markOne(n)}
              className={`w-full text-left rounded-2xl border p-5 transition ${n.is_read ? "bg-white border-slate-200" : "bg-indigo-50 border-indigo-200"}`}>
              <div className="flex justify-between items-start gap-3">
                <div>
                  <p className={`text-sm ${n.is_read ? "text-slate-700" : "font-semibold text-slate-900"}`}>{n.title}</p>
                  <p className="text-sm text-slate-500 mt-1">{n.message}</p>
                  <p className="text-xs text-slate-400 mt-2">{new Date(n.created_at).toLocaleString("es-PE")}</p>
                </div>
                {!n.is_read && <span className="bg-indigo-600 text-white text-xs rounded-full px-2 py-0.5 shrink-0">Nuevo</span>}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

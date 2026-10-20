import { useEffect, useState } from "react";
import { api } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const EMPTY = { code: "", name: "", description: "", office_id: "", cost: 0, duration_days: 5, requirements: [] };

export default function ProcedimientosAdmin() {
  const { user } = useAuth();
  const [list, setList] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editing, setEditing] = useState(null);
  const [reqText, setReqText] = useState("");
  const [msg, setMsg] = useState("");

  const load = () => api.adminProcedures().then(setList).catch(() => {});
  useEffect(() => { load(); }, []);

  const isAdmin = user.role === "admin";

  const save = async (e) => {
    e.preventDefault();
    setMsg("");
    const payload = {
      ...form,
      office_id: Number(form.office_id) || null,
      requirements: reqText.split("\n").map((r) => r.trim()).filter(Boolean),
    };
    try {
      if (editing) await api.updateProcedure(editing, payload);
      else await api.createProcedure(payload);
      setForm(EMPTY); setReqText(""); setEditing(null);
      setMsg("✓ Procedimiento guardado correctamente.");
      load();
    } catch (err) {
      setMsg("Error: " + err.message);
    }
  };

  const edit = (p) => {
    setEditing(p.id);
    setForm({ code: p.code, name: p.name, description: p.description, office_id: p.office_id || "", cost: p.cost, duration_days: p.duration_days });
    setReqText(p.requirements.join("\n"));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggle = async (p) => {
    await api.updateProcedure(p.id, { is_active: !p.is_active });
    load();
  };

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold">Gestión de procedimientos</h1>
      <p className="text-slate-500 mt-1">Alta, edición y baja de procedimientos del catálogo TUPA</p>

      {isAdmin && (
        <form onSubmit={save} className="bg-white rounded-2xl border border-slate-200 p-6 mt-8 space-y-4">
          <h2 className="font-bold">{editing ? "Editar procedimiento" : "Nuevo procedimiento"}</h2>
          {msg && <div className={`text-sm rounded-xl px-4 py-2 ${msg.startsWith("✓") ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>{msg}</div>}
          <div className="grid md:grid-cols-3 gap-4">
            <input required placeholder="Código (TUPA-00X)" value={form.code} onChange={set("code")} disabled={!!editing}
              className="px-4 py-2.5 rounded-xl border border-slate-300 focus:border-indigo-500 outline-none disabled:bg-slate-100" />
            <input required placeholder="Nombre" value={form.name} onChange={set("name")}
              className="md:col-span-2 px-4 py-2.5 rounded-xl border border-slate-300 focus:border-indigo-500 outline-none" />
          </div>
          <textarea rows={2} placeholder="Descripción" value={form.description} onChange={set("description")}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-indigo-500 outline-none" />
          <div className="grid md:grid-cols-3 gap-4">
            <select value={form.office_id} onChange={set("office_id")} className="px-4 py-2.5 rounded-xl border border-slate-300 outline-none bg-white">
              <option value="">Oficina responsable...</option>
              {[1, 2, 3, 4].map((id) => (
                <option key={id} value={id}>{api && ["OGR", "DAE", "DAP", "Bienestar"][id - 1]}</option>
              ))}
            </select>
            <input type="number" step="0.01" min="0" placeholder="Costo (S/)" value={form.cost} onChange={set("cost")}
              className="px-4 py-2.5 rounded-xl border border-slate-300 outline-none" />
            <input type="number" min="1" placeholder="Plazo (días)" value={form.duration_days} onChange={set("duration_days")}
              className="px-4 py-2.5 rounded-xl border border-slate-300 outline-none" />
          </div>
          <textarea rows={4} placeholder={"Requisitos (uno por línea)...\nSolicitud dirigida al Decano\nCarné de identidad (copia)"} value={reqText} onChange={(e) => setReqText(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 outline-none" />
          <div className="flex gap-3">
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2.5 rounded-xl text-sm">Guardar</button>
            {editing && (
              <button type="button" onClick={() => { setEditing(null); setForm(EMPTY); setReqText(""); }}
                className="border border-slate-300 px-6 py-2.5 rounded-xl text-sm">Cancelar edición</button>
            )}
          </div>
        </form>
      )}
      {!isAdmin && <p className="mt-4 text-sm text-slate-500">Solo el administrador puede modificar el catálogo.</p>}

      <div className="mt-10 space-y-3">
        {list.map((p) => (
          <div key={p.id} className={`bg-white rounded-2xl border p-5 flex flex-wrap justify-between items-center gap-3 ${p.is_active ? "border-slate-200" : "border-slate-200 opacity-60"}`}>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded">{p.code}</span>
                {!p.is_active && <span className="text-xs bg-slate-200 text-slate-600 px-2 py-0.5 rounded">Inactivo</span>}
              </div>
              <h3 className="font-semibold mt-1">{p.name}</h3>
              <p className="text-xs text-slate-500">{p.office_name} · S/ {Number(p.cost).toFixed(2)} · {p.duration_days} días</p>
            </div>
            {isAdmin && (
              <div className="flex gap-2">
                <button onClick={() => edit(p)} className="text-sm border border-slate-300 px-3 py-1.5 rounded-lg hover:bg-slate-50">Editar</button>
                <button onClick={() => toggle(p)} className={`text-sm px-3 py-1.5 rounded-lg ${p.is_active ? "bg-red-50 text-red-700 border border-red-200" : "bg-emerald-50 text-emerald-700 border border-emerald-200"}`}>
                  {p.is_active ? "Desactivar" : "Activar"}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

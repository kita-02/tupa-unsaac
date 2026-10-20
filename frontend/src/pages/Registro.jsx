import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Registro() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ code: "", full_name: "", email: "", password: "" });
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await register(form);
      nav("/mis-tramites");
    } catch (err) {
      setError(err.message);
    }
  };

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
        <h1 className="text-2xl font-bold">Crear cuenta</h1>
        <p className="text-sm text-slate-500 mt-1">Registro de estudiante de la UNSAAC</p>

        {error && <div className="mt-4 text-sm bg-red-50 text-red-700 border border-red-200 rounded-xl px-4 py-3">{error}</div>}

        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium">Código de estudiante</label>
            <input required value={form.code} onChange={set("code")} placeholder="Ej: 20231234"
              className="w-full mt-1 px-4 py-2.5 rounded-xl border border-slate-300 focus:border-indigo-500 outline-none" />
          </div>
          <div>
            <label className="text-sm font-medium">Nombres y apellidos</label>
            <input required value={form.full_name} onChange={set("full_name")} placeholder="Juan Pérez López"
              className="w-full mt-1 px-4 py-2.5 rounded-xl border border-slate-300 focus:border-indigo-500 outline-none" />
          </div>
          <div>
            <label className="text-sm font-medium">Correo institucional</label>
            <input type="email" required value={form.email} onChange={set("email")} placeholder="nombre@alum.unsaac.edu.pe"
              className="w-full mt-1 px-4 py-2.5 rounded-xl border border-slate-300 focus:border-indigo-500 outline-none" />
          </div>
          <div>
            <label className="text-sm font-medium">Contraseña</label>
            <input type="password" required minLength={6} value={form.password} onChange={set("password")} placeholder="Mínimo 6 caracteres"
              className="w-full mt-1 px-4 py-2.5 rounded-xl border border-slate-300 focus:border-indigo-500 outline-none" />
          </div>
          <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-xl">Registrarme</button>
        </form>

        <p className="text-sm text-slate-500 mt-4 text-center">
          ¿Ya tienes cuenta? <Link to="/login" className="text-indigo-600 font-semibold">Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
}

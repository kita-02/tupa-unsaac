import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const user = await login(form.email, form.password);
      nav(user.role === "student" ? "/mis-tramites" : "/admin");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
        <h1 className="text-2xl font-bold">Iniciar sesión</h1>
        <p className="text-sm text-slate-500 mt-1">Accede a tu cuenta de la plataforma TUPA</p>

        {error && <div className="mt-4 text-sm bg-red-50 text-red-700 border border-red-200 rounded-xl px-4 py-3">{error}</div>}

        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium">Correo institucional</label>
            <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full mt-1 px-4 py-2.5 rounded-xl border border-slate-300 focus:border-indigo-500 outline-none" placeholder="correo@unsaac.edu.pe" />
          </div>
          <div>
            <label className="text-sm font-medium">Contraseña</label>
            <input type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full mt-1 px-4 py-2.5 rounded-xl border border-slate-300 focus:border-indigo-500 outline-none" placeholder="••••••••" />
          </div>
          <button disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-xl disabled:opacity-50">
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>

        <p className="text-sm text-slate-500 mt-4 text-center">
          ¿No tienes cuenta? <Link to="/registro" className="text-indigo-600 font-semibold">Regístrate aquí</Link>
        </p>

        <div className="mt-6 border-t border-slate-100 pt-4 text-xs text-slate-400">
          <p className="font-semibold text-slate-500 mb-1">Cuentas de demostración:</p>
          <p>Estudiante: juan.hamann@alum.unsaac.edu.pe / estudiante123</p>
          <p>Oficina: oficina.ogr@unsaac.edu.pe / oficina123</p>
          <p>Admin: admin@unsaac.edu.pe / admin123</p>
        </div>
      </div>
    </div>
  );
}

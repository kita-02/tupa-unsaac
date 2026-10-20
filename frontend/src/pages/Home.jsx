import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import ProcedureCard from "../components/ProcedureCard";

export default function Home() {
  const [procedures, setProcedures] = useState([]);
  const [search, setSearch] = useState("");
  const { user } = useAuth();
  const nav = useNavigate();

  useEffect(() => {
    api.procedures().then(setProcedures).catch(() => {});
  }, []);

  const goSearch = (e) => {
    e.preventDefault();
    nav(`/procedimientos${search ? `?q=${encodeURIComponent(search)}` : ""}`);
  };

  return (
    <div>
      <section className="bg-gradient-to-br from-indigo-700 via-indigo-600 to-violet-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
            Trámites del TUPA<br />100% en línea
          </h1>
          <p className="mt-4 text-indigo-100 max-w-2xl mx-auto">
            Consulta requisitos y costos, registra tus solicitudes y sigue el estado de tus trámites
            administrativos de la UNSAAC sin filas ni consultas presenciales.
          </p>
          <form onSubmit={goSearch} className="mt-8 max-w-xl mx-auto flex gap-2 bg-white rounded-2xl p-2 shadow-lg">
            <input
              value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar: constancia, certificado, beca..."
              className="flex-1 px-4 py-3 text-slate-800 rounded-xl outline-none"
            />
            <button className="bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-xl font-semibold">Buscar</button>
          </form>
          {!user && (
            <p className="mt-4 text-sm text-indigo-200">
              ¿Ya tienes cuenta? <Link to="/login" className="underline font-semibold">Inicia sesión</Link> para registrar trámites.
            </p>
          )}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-14">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            ["Consulta en línea", "Requisitos, costos y plazos de cada procedimiento del TUPA, siempre actualizados."],
            ["Seguimiento en tiempo real", "Recibe notificaciones del estado de tu trámite: enviada, en revisión, aprobada o entregada."],
            ["Sin filas", "Registra tu solicitud y adjunta documentos digitales desde cualquier dispositivo, 24/7."],
          ].map(([t, d]) => (
            <div key={t} className="bg-white rounded-2xl border border-slate-200 p-6">
              <div className="w-10 h-10 bg-indigo-100 text-indigo-700 rounded-xl flex items-center justify-center font-bold">✓</div>
              <h3 className="font-semibold mt-3">{t}</h3>
              <p className="text-sm text-slate-500 mt-1">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 pb-14">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Procedimientos más consultados</h2>
          <Link to="/procedimientos" className="text-indigo-600 text-sm font-medium">Ver catálogo completo →</Link>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {procedures.slice(0, 3).map((p) => <ProcedureCard key={p.id} p={p} />)}
        </div>
      </section>
    </div>
  );
}

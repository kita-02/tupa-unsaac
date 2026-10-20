import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";

export default function Navbar() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(0);

  useState(() => {
    if (user) api.unreadCount().then((d) => setUnread(d.count)).catch(() => {});
  });

  const isStaff = user && (user.role === "office" || user.role === "admin");
  const link = ({ isActive }) => `px-3 py-2 rounded-lg text-sm font-medium transition ${isActive ? "bg-indigo-100 text-indigo-700" : "text-slate-600 hover:bg-slate-100"}`;

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-indigo-700 text-lg">
          <span className="bg-indigo-600 text-white w-9 h-9 rounded-xl flex items-center justify-center text-sm">T</span>
          TUPA <span className="text-slate-400 font-normal">UNSAAC</span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          <NavLink to="/" className={link} end>Inicio</NavLink>
          <NavLink to="/procedimientos" className={link}>Procedimientos</NavLink>
          {user && (
            <NavLink to="/mis-tramites" className={link}>Mis trámites</NavLink>
          )}
          {user && (
            <NavLink to="/notificaciones" className={link}>
              Notificaciones{unread > 0 && <span className="ml-1 bg-red-500 text-white text-xs rounded-full px-1.5">{unread}</span>}
            </NavLink>
          )}
          {isStaff && (
            <>
              <NavLink to="/admin" className={link} end>Panel</NavLink>
              <NavLink to="/admin/procedimientos" className={link}>Gestión TUPA</NavLink>
              <NavLink to="/admin/reportes" className={link}>Reportes</NavLink>
            </>
          )}
        </div>

        <div className="hidden md:flex items-center gap-2">
          {user ? (
            <>
              <span className="text-sm text-slate-600">{user.full_name.split(" ")[0]} · {user.role === "student" ? "Estudiante" : user.role === "admin" ? "Admin" : "Oficina"}</span>
              <button onClick={() => { logout(); nav("/"); }} className="text-sm border border-slate-300 rounded-lg px-3 py-1.5 hover:bg-slate-50">Salir</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm border border-slate-300 rounded-lg px-3 py-1.5 hover:bg-slate-50">Iniciar sesión</Link>
              <Link to="/registro" className="text-sm bg-indigo-600 text-white rounded-lg px-3 py-1.5 hover:bg-indigo-700">Registrarse</Link>
            </>
          )}
        </div>

        <button className="md:hidden p-2" onClick={() => setOpen(!open)}>☰</button>
      </div>

      {open && (
        <div className="md:hidden border-t border-slate-200 px-4 py-3 space-y-1 bg-white">
          <NavLink to="/" className="block py-2 text-sm" end onClick={() => setOpen(false)}>Inicio</NavLink>
          <NavLink to="/procedimientos" className="block py-2 text-sm" onClick={() => setOpen(false)}>Procedimientos</NavLink>
          {user && <NavLink to="/mis-tramites" className="block py-2 text-sm" onClick={() => setOpen(false)}>Mis trámites</NavLink>}
          {user && <NavLink to="/notificaciones" className="block py-2 text-sm" onClick={() => setOpen(false)}>Notificaciones</NavLink>}
          {isStaff && <NavLink to="/admin" className="block py-2 text-sm" onClick={() => setOpen(false)}>Panel administrativo</NavLink>}
          {isStaff && <NavLink to="/admin/reportes" className="block py-2 text-sm" onClick={() => setOpen(false)}>Reportes</NavLink>}
          {user ? (
            <button onClick={() => { logout(); nav("/"); setOpen(false); }} className="block py-2 text-sm text-red-600">Cerrar sesión</button>
          ) : (
            <>
              <NavLink to="/login" className="block py-2 text-sm" onClick={() => setOpen(false)}>Iniciar sesión</NavLink>
              <NavLink to="/registro" className="block py-2 text-sm" onClick={() => setOpen(false)}>Registrarse</NavLink>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

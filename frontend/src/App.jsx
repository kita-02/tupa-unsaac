import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Procedimientos from "./pages/Procedimientos";
import ProcedimientoDetail from "./pages/ProcedimientoDetail";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import MisTramites from "./pages/MisTramites";
import NuevaSolicitud from "./pages/NuevaSolicitud";
import SolicitudDetail from "./pages/SolicitudDetail";
import Notificaciones from "./pages/Notificaciones";
import Dashboard from "./pages/admin/Dashboard";
import Bandeja from "./pages/admin/Bandeja";
import ProcedimientosAdmin from "./pages/admin/ProcedimientosAdmin";
import Reportes from "./pages/admin/Reportes";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/procedimientos" element={<Procedimientos />} />
          <Route path="/procedimientos/:id" element={<ProcedimientoDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/mis-tramites" element={<ProtectedRoute><MisTramites /></ProtectedRoute>} />
          <Route path="/nueva-solicitud/:id" element={<ProtectedRoute roles={["student"]}><NuevaSolicitud /></ProtectedRoute>} />
          <Route path="/tramites/:id" element={<ProtectedRoute><SolicitudDetail /></ProtectedRoute>} />
          <Route path="/notificaciones" element={<ProtectedRoute><Notificaciones /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute roles={["office", "admin"]}><Dashboard /></ProtectedRoute>} />
          <Route path="/admin/bandeja" element={<ProtectedRoute roles={["office", "admin"]}><Bandeja /></ProtectedRoute>} />
          <Route path="/admin/procedimientos" element={<ProtectedRoute roles={["office", "admin"]}><ProcedimientosAdmin /></ProtectedRoute>} />
          <Route path="/admin/reportes" element={<ProtectedRoute roles={["office", "admin"]}><Reportes /></ProtectedRoute>} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-10 grid md:grid-cols-3 gap-8 text-sm">
        <div>
          <p className="font-bold text-white mb-2">TUPA UNSAAC</p>
          <p>Plataforma web para la optimización de la gestión del Texto Único de Procedimientos Administrativos.</p>
        </div>
        <div>
          <p className="font-bold text-white mb-2">Enlaces</p>
          <p><a href="/procedimientos" className="hover:text-white">Catálogo de procedimientos</a></p>
          <p><a href="/registro" className="hover:text-white">Crear cuenta</a></p>
        </div>
        <div>
          <p className="font-bold text-white mb-2">Contacto</p>
          <p>Universidad Nacional de San Antonio Abad del Cusco</p>
          <p>Av. El Sol, Cusco — Perú</p>
        </div>
      </div>
      <div className="border-t border-slate-700 py-4 text-center text-xs text-slate-500">
        Desarrollo de Software I · Semestre 2026-2 · Proyecto académico
      </div>
    </footer>
  );
}

import React from 'react';

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-slate-100 flex font-sans">
      
      {/* Menú Lateral (Sidebar) */}
      <aside className="w-64 bg-slate-900 text-white p-6 hidden md:block shadow-xl">
        <h2 className="text-2xl font-black text-red-500 mb-8 tracking-wider">PSC ADMIN</h2>
        <nav className="flex flex-col gap-4">
          <a href="#" className="p-3 bg-red-600 rounded-lg font-bold shadow-md">Dashboard</a>
          <a href="#" className="p-3 hover:bg-slate-800 rounded-lg transition-colors">📰 Noticias</a>
          <a href="#" className="p-3 hover:bg-slate-800 rounded-lg transition-colors">🚨 Alertas</a>
          <a href="#" className="p-3 hover:bg-slate-800 rounded-lg transition-colors">💰 Patrocinadores</a>
          <a href="#" className="p-3 hover:bg-slate-800 rounded-lg transition-colors">🤖 RSS Automático</a>
        </nav>
      </aside>

      {/* Contenido Principal */}
      <main className="flex-1 p-10">
        <header className="flex justify-between items-center mb-10 border-b border-slate-300 pb-4">
          <h1 className="text-3xl font-bold text-slate-800">Panel de Control</h1>
          <div className="bg-slate-800 text-white px-4 py-2 rounded-full text-sm font-bold">
            Administrador Activo
          </div>
        </header>

        {/* Tarjetas de Resumen */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 border-l-4 border-l-blue-500">
            <h3 className="text-slate-500 text-sm font-bold mb-1">NOTICIAS PUBLICADAS</h3>
            <p className="text-4xl font-black text-slate-800">0</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 border-l-4 border-l-red-500">
            <h3 className="text-slate-500 text-sm font-bold mb-1">ALERTAS ACTIVAS</h3>
            <p className="text-4xl font-black text-slate-800">0</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 border-l-4 border-l-green-500">
            <h3 className="text-slate-500 text-sm font-bold mb-1">PATROCINADORES</h3>
            <p className="text-4xl font-black text-slate-800">0</p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-xl font-bold mb-4 text-slate-800">Bienvenido a la sala de redacción</h2>
          <p className="text-slate-600">Selecciona un módulo en el menú lateral para comenzar a gestionar el contenido de Fabulosa Play y PSC INFORMA.</p>
        </div>
      </main>

    </div>
  );
}
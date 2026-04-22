"use client";
import React, { useState } from 'react';

export default function AdminRSS() {
  const [status, setStatus] = useState('SISTEMA LISTO');

  const ejecutarRobot = async (tipo) => {
    setStatus(`🤖 RASTREANDO ${tipo.toUpperCase()}...`);
    const res = await fetch('/api/rss-bot', { 
      method: 'POST', 
      body: JSON.stringify({ tipo }) 
    });
    const data = await res.json();
    setStatus(data.mensaje || '✅ PROCESO COMPLETADO');
  };

  return (
    <div className="p-10 bg-white rounded-[3rem] shadow-2xl border-4 border-black text-black">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-black italic uppercase tracking-tighter">Corresponsal IA 24/7</h2>
        <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.3em] mt-2">Estado: <span className="text-red-600 animate-pulse">{status}</span></p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <button onClick={() => ejecutarRobot('nacional')} className="bg-blue-600 text-white p-8 rounded-3xl font-black text-xl shadow-[0_10px_0_rgb(30,58,138)] active:translate-y-2 active:shadow-none transition-all uppercase">
          🇨🇷 Noticias Nacionales
        </button>
        <button onClick={() => ejecutarRobot('internacional')} className="bg-black text-white p-8 rounded-3xl font-black text-xl shadow-[0_10px_0_rgb(31,41,55)] active:translate-y-2 active:shadow-none transition-all uppercase">
          🌎 Noticias Mundo
        </button>
      </div>
      <p className="text-center mt-10 text-[10px] font-bold text-slate-400 uppercase tracking-widest">El robot buscará fotos reales y las publicará al instante</p>
    </div>
  );
}
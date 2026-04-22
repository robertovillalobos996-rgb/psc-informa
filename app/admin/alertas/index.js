"use client";
import React, { useState } from 'react';
import { supabase } from '../../../lib/supabase';

export default function AdminAlertas() {
  const [mensaje, setMensaje] = useState('');
  const [status, setStatus] = useState('LISTO');

  const ejecutarRobot = async (...args) => {
    const miTipo = args[0] || 'nacionales';
    setStatus(`🤖 RASTREANDO...`);
    try {
      await fetch('/api/rss-bot', { method: 'POST', body: JSON.stringify({ tipo: miTipo }) });
      setStatus(`✅ TERMINADO`);
    } catch (e) { setStatus('❌ ERROR'); }
  };

  return (
    <div className="p-10 text-black bg-white rounded-3xl shadow-xl mt-10 max-w-xl mx-auto">
      <h2 className="text-2xl font-black mb-6 uppercase italic">Panel de Control</h2>
      <div className="grid grid-cols-2 gap-4 mb-10">
        <button onClick={() => ejecutarRobot('nacionales')} className="p-5 bg-blue-600 text-white font-bold rounded-xl">NOTICIAS CR</button>
        <button onClick={() => ejecutarRobot('internacionales')} className="p-5 bg-indigo-600 text-white font-bold rounded-xl">MUNDO</button>
      </div>
      <p className="text-center font-bold text-red-600">{status}</p>
    </div>
  );
}
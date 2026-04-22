"use client";
import React, { useState } from 'react';
import { supabase } from '../../../lib/supabase';

export default function AdminAlertas() {
  const [mensaje, setMensaje] = useState('');
  const [color, setColor] = useState('rojo');
  const [status, setStatus] = useState('SISTEMA LISTO');

  // Así Vercel no puede encontrar ningún error de "tipo"
  const ejecutarRobot = async (...args) => {
    const miTipo = args[0] || 'nacionales';
    setStatus(`🤖 RASTREANDO...`);
    try {
      await fetch('/api/rss-bot', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tipo: miTipo }) 
      });
      setStatus(`✅ PROCESO TERMINADO`);
    } catch (e) {
      setStatus('❌ ERROR');
    }
  };

  const enviarAlerta = async (e) => {
    e.preventDefault();
    setStatus('📡 ENVIANDO...');
    try {
      await supabase.from('alertas').insert([{ mensaje, color }]);
      setStatus('🚨 ALERTA EN VIVO');
      setMensaje('');
    } catch (err) {
      setStatus('❌ FALLO');
    }
  };

  return (
    <div className="p-10 text-black bg-white rounded-3xl shadow-xl max-w-2xl mx-auto mt-10">
      <h2 className="text-2xl font-black mb-6 uppercase italic">Alertas y Robot</h2>
      <div className="grid grid-cols-2 gap-4 mb-10">
        <button type="button" onClick={() => ejecutarRobot('nacionales')} className="p-5 bg-blue-600 text-white font-bold rounded-xl shadow-lg">NOTICIAS CR</button>
        <button type="button" onClick={() => ejecutarRobot('internacionales')} className="p-5 bg-indigo-600 text-white font-bold rounded-xl shadow-lg">MUNDO</button>
      </div>
      <form onSubmit={enviarAlerta} className="space-y-4">
        <input value={mensaje} onChange={(e) => setMensaje(e.target.value)} className="w-full p-4 border-2 rounded-xl font-bold" placeholder="MENSAJE DE ALERTA" required />
        <button className="w-full p-5 bg-red-600 text-white font-bold rounded-xl shadow-lg">LANZAR ALERTA</button>
      </form>
      <p className="text-center mt-5 font-black text-red-600 animate-pulse uppercase text-xs">{status}</p>
    </div>
  );
}
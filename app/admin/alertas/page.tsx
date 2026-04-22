"use client";
import React, { useState } from 'react';
import { supabase } from '../../../lib/supabase';

export default function AdminAlertas() {
  const [mensaje, setMensaje] = useState('');
  const [color, setColor] = useState('rojo');
  const [status, setStatus] = useState('SISTEMA LISTO');

  const ejecutarRobot = async (...args: any[]) => {
    const tipo = args[0] || 'nacionales';
    setStatus(`🤖 RASTREANDO...`);
    try {
      await fetch('/api/rss-bot', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tipo }) 
      });
      setStatus(`✅ PROCESO TERMINADO`);
    } catch (e) {
      setStatus('❌ ERROR');
    }
  };

  const enviarAlerta = async (e: any) => {
    e.preventDefault();
    setStatus('📡 ENVIANDO...');
    await supabase.from('alertas').insert([{ mensaje, color }]);
    setStatus('🚨 ALERTA EN VIVO');
    setMensaje('');
  };

  return (
    <div className="p-10 text-black bg-white rounded-3xl">
      <div className="grid grid-cols-2 gap-4 mb-10">
        <button onClick={() => ejecutarRobot('nacionales')} className="p-5 bg-blue-600 text-white font-bold rounded-xl">NOTICIAS CR</button>
        <button onClick={() => ejecutarRobot('internacionales')} className="p-5 bg-indigo-600 text-white font-bold rounded-xl">MUNDO</button>
      </div>
      <form onSubmit={enviarAlerta} className="space-y-4">
        <input value={mensaje} onChange={(e: any) => setMensaje(e.target.value)} className="w-full p-4 border-2 rounded-xl" placeholder="MENSAJE DE ALERTA" />
        <button className="w-full p-5 bg-red-600 text-white font-bold rounded-xl">LANZAR ALERTA</button>
      </form>
      <p className="text-center mt-5 font-bold">{status}</p>
    </div>
  );
}
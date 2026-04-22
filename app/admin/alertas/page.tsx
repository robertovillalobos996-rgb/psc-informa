"use client";
import React, { useState } from 'react';
import { supabase } from '../../../lib/supabase';

export default function AdminAlertas() {
  const [mensaje, setMensaje] = useState('');
  const [color, setColor] = useState('rojo');
  const [status, setStatus] = useState('');

  const enviarAlerta = async () => {
    setStatus('🚨 LANZANDO...');
    const { error } = await supabase.from('alertas').insert([{ mensaje, color, activa: true }]);
    if (!error) { setStatus('🚨 ALERTA EN EL AIRE'); setMensaje(''); }
  };

  return (
    <div className="p-10 bg-slate-950 rounded-[3rem] border-4 border-red-600">
      <h2 className="text-3xl font-black text-white uppercase italic text-center mb-8 italic">Centro de Emergencias</h2>
      
      <div className="flex gap-4 mb-6">
        <button onClick={() => setColor('rojo')} className={`flex-1 py-4 rounded-2xl font-black ${color === 'rojo' ? 'bg-red-600 ring-4 ring-white' : 'bg-red-900 text-white/50'}`}>ALERTA ROJA (POLICÍA)</button>
        <button onClick={() => setColor('amarillo')} className={`flex-1 py-4 rounded-2xl font-black text-black ${color === 'amarillo' ? 'bg-yellow-400 ring-4 ring-white' : 'bg-yellow-900 text-black/30'}`}>ALERTA AMARILLA</button>
      </div>

      <textarea value={mensaje} onChange={(e) => setMensaje(e.target.value)} className="w-full bg-black border-2 border-zinc-800 rounded-3xl p-6 text-white text-center text-xl font-bold mb-6" placeholder="Escriba el reporte de última hora..." />
      
      <button onClick={enviarAlerta} className="w-full bg-red-600 text-white py-8 rounded-3xl text-3xl font-black shadow-2xl hover:bg-red-500 transition-all uppercase">Disparar Sirena 🚨</button>
      {status && <p className="text-center font-black text-white mt-4 animate-pulse">{status}</p>}
    </div>
  );
}
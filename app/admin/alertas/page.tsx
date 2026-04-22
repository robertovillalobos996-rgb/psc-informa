"use client";
import React, { useState } from 'react';
import { supabase } from '../../../lib/supabase';

export default function AdminAlertas() {
  const [mensaje, setMensaje] = useState('');
  const [color, setColor] = useState('rojo');
  const [status, setStatus] = useState('SISTEMA LISTO');

  // PARCHE: Agregamos ": any" a la variable "tipo"
  const ejecutarRobot = async (tipo: any) => {
    setStatus(`🤖 RASTREANDO ${tipo.toUpperCase()}...`);
    try {
      const res = await fetch('/api/rss-bot', { 
        method: 'POST', 
        body: JSON.stringify({ tipo }) 
      });
      const data = await res.json();
      setStatus(`✅ ROBOT: ${data.mensaje || 'PROCESO TERMINADO'}`);
    } catch (err) {
      setStatus('❌ ERROR EN EL ROBOT');
    }
  };

  const enviarAlerta = async (e: any) => {
    e.preventDefault();
    setStatus('📡 LANZANDO ALERTA...');
    const { error } = await supabase.from('alertas').insert([{ mensaje, color }]);
    if (error) setStatus('❌ FALLO AL LANZAR');
    else {
      setStatus('🚨 ALERTA EN VIVO');
      setMensaje('');
    }
  };

  return (
    <div className="space-y-6">
      {/* BOTONES DEL ROBOT */}
      <div className="grid grid-cols-2 gap-4">
        <button onClick={() => ejecutarRobot('nacionales')} className="bg-blue-600 p-6 rounded-2xl font-black text-white hover:bg-blue-700 transition-all shadow-xl">🤖 RASTREAR NOTICIAS CR</button>
        <button onClick={() => ejecutarRobot('internacionales')} className="bg-indigo-600 p-6 rounded-2xl font-black text-white hover:bg-indigo-700 transition-all shadow-xl">🌍 RASTREAR MUNDO</button>
      </div>

      {/* FORMULARIO DE ALERTA */}
      <div className="p-8 bg-white rounded-[2rem] text-black shadow-2xl border-4 border-slate-100">
        <h2 className="text-xl font-black mb-6 uppercase italic border-l-4 border-yellow-500 pl-4">Alertas de Último Minuto</h2>
        <form onSubmit={enviarAlerta} className="space-y-4">
          <input value={mensaje} onChange={(e: any) => setMensaje(e.target.value)} className="w-full p-4 border-2 rounded-xl font-bold" placeholder="EJ: CHOQUE EN RUTA 32..." required />
          <div className="flex gap-4">
            <button type="button" onClick={() => setColor('rojo')} className={`flex-1 p-3 rounded-xl font-black ${color === 'rojo' ? 'bg-red-600 text-white' : 'bg-slate-100'}`}>ROJO</button>
            <button type="button" onClick={() => setColor('amarillo')} className={`flex-1 p-3 rounded-xl font-black ${color === 'amarillo' ? 'bg-yellow-500 text-black' : 'bg-slate-100'}`}>AMARILLO</button>
          </div>
          <button className="w-full bg-red-600 text-white py-5 rounded-2xl font-black uppercase shadow-xl">LANZAR ALERTA AHORA</button>
        </form>
        <p className="text-center font-black mt-4 text-[10px] text-slate-400 uppercase tracking-widest">{status}</p>
      </div>
    </div>
  );
}
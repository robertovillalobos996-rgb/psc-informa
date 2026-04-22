"use client";
import React, { useState, useEffect } from 'react';

export const NotificationCard = () => {
  const [permission, setPermission] = useState('default');

  useEffect(() => {
    if (typeof window !== "undefined") {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    const result = await Notification.requestPermission();
    setPermission(result);
    if (result === 'granted') {
      const audio = new Audio('/alarma.mp3');
      audio.volume = 0.2;
      audio.play(); // Prueba de sonido inicial
    }
  };

  return (
    <div className="bg-zinc-900 border-2 border-red-600 p-8 rounded-[2.5rem] shadow-[0_0_40px_rgba(220,38,38,0.2)] max-w-md w-full text-center">
      <div className="text-5xl mb-4">🚨</div>
      <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-2">Sistema PSC INFORMA</h3>
      <p className="text-slate-400 text-xs mb-6 font-bold uppercase tracking-widest">
        {permission === 'granted' ? '✅ SONIDO E INTERFAZ ACTIVADOS' : '⚠️ EL SONIDO ESTÁ DESACTIVADO'}
      </p>
      
      <button 
        onClick={requestPermission}
        className={`w-full py-4 rounded-2xl font-black transition-all uppercase text-xs tracking-[0.2em] ${
          permission === 'granted' 
          ? 'bg-zinc-800 text-slate-500 cursor-default' 
          : 'bg-red-600 text-white hover:bg-red-500 shadow-lg active:scale-95'
        }`}
      >
        {permission === 'granted' ? 'SISTEMA LISTO' : 'ACTIVAR ALERTAS Y SONIDO'}
      </button>
    </div>
  );
};
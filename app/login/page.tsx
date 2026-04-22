"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

// ESTA LÍNEA ES LA CLAVE:
export default function LoginPage() {
  const [pass, setPass] = useState('');
  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault();
    if (pass === 'Rvmf2121') {
      localStorage.setItem('admin_session', 'active');
      // Después de loguear, te enviamos directo al HUB (Tu nueva App Todo-en-Uno)
      router.push('/hub');
    } else {
      alert('Contraseña Incorrecta');
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center font-sans">
      <form onSubmit={handleLogin} className="bg-zinc-900 p-12 rounded-[3rem] border border-red-600/30 shadow-2xl w-full max-w-md">
        <div className="text-center mb-10">
          <img src="/logo-psc.png" className="h-16 mx-auto mb-6" style={{mixBlendMode:'screen'}}/>
          <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase">PSC <span className="text-red-600">ADMIN</span></h1>
          <p className="text-slate-500 text-[10px] mt-2 uppercase tracking-[0.3em] font-bold">Ingreso al Centro de Mando</p>
        </div>
        
        <input 
          type="password" 
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          placeholder="CONTRASEÑA"
          className="w-full bg-black border-2 border-zinc-800 rounded-2xl p-5 text-white text-center text-xl font-bold focus:border-red-600 outline-none mb-6 placeholder:opacity-20"
          autoFocus
        />
        
        <button className="w-full bg-red-600 hover:bg-red-500 text-white font-black py-5 rounded-2xl text-xl shadow-lg active:scale-95 transition-all uppercase tracking-widest">
          Entrar al Hub
        </button>
      </form>
    </div>
  );
}
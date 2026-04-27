"use client";
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Home() {
  const [noticias, setNoticias] = useState([]);
  const [manuales, setManuales] = useState([]);
  const [sponsors, setSponsors] = useState([]);
  const [idx, setIdx] = useState(0);
  const [abrirCard, setAbrirCard] = useState(null);
  const [abrirNoticia, setAbrirNoticia] = useState(null);

  useEffect(() => { cargarTodo(); }, []);

  const cargarTodo = async () => {
    const { data: news } = await supabase.from('noticias').select('*').order('created_at', { ascending: false });
    const { data: spon } = await supabase.from('patrocinadores').select('*').order('created_at', { ascending: false });
    
    if (news) {
      // Filtramos para que salgan las fotos según el tipo
      setNoticias(news.filter(n => n.categoria === 'vertical' || n.layout === 'vertical'));
      setManuales(news.filter(n => n.categoria === 'horizontal' || n.layout === 'horizontal'));
    }
    if (spon) setSponsors(spon);
  };

  useEffect(() => {
    if (manuales.length > 0) {
      const timer = setInterval(() => { setIdx((prev) => (prev + 1) % manuales.length); }, 8000);
      return () => clearInterval(timer);
    }
  }, [manuales]);

  return (
    <div className="min-h-screen bg-black text-white font-sans overflow-x-hidden">
      <header className="bg-zinc-950 border-b border-red-600/30 py-4 px-6 flex items-center gap-3">
         <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center font-black text-2xl italic">P</div>
         <h1 className="text-2xl font-black uppercase italic"><span className="text-red-600">PSC</span> INFORMA</h1>
      </header>

      <div className="bg-red-600 py-2 overflow-hidden whitespace-nowrap border-y border-white/10">
        <div className="inline-block animate-marquee font-black uppercase italic text-sm">
          🔴 LÍDERES EN INFORMACIÓN 24/7 ★★★ PSC INFORMA ★★★ COBERTURA TOTAL &nbsp;&nbsp;&nbsp;&nbsp; 🔴 LÍDERES EN INFORMACIÓN 24/7
        </div>
      </div>

      <main className="max-w-[1600px] mx-auto p-4 lg:p-8 flex flex-col lg:flex-row gap-8">
        {/* COLUMNA IZQUIERDA: NOTICIAS */}
        <div className="flex-1 space-y-8">
          {manuales.length > 0 && (
            <div onClick={() => setAbrirNoticia(manuales[idx])} className="relative h-[400px] md:h-[550px] rounded-[3rem] overflow-hidden border-2 border-white/5 cursor-pointer shadow-2xl">
              <img src={manuales[idx].imagen_url} className="w-full h-full object-cover" alt="noticia principal" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
              <div className="absolute bottom-10 left-10 right-10">
                <h2 className="text-3xl md:text-5xl font-black uppercase italic leading-tight">{manuales[idx].titulo}</h2>
              </div>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {noticias.map((n) => (
              <div key={n.id} onClick={() => setAbrirNoticia(n)} className="bg-zinc-900/50 border border-white/5 rounded-[2.5rem] p-6 flex gap-6 cursor-pointer hover:bg-zinc-800 transition-all">
                <img src={n.imagen_url} className="w-24 h-24 rounded-[1.5rem] object-cover border border-white/10" alt="miniatura" />
                <div className="flex flex-col justify-center">
                  <h3 className="text-lg font-black uppercase leading-tight">{n.titulo}</h3>
                  <p className="text-red-500 text-[10px] font-black uppercase mt-1">Ver Reporte</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* COLUMNA DERECHA: PUBLICIDAD PEQUEÑA */}
        <div className="w-full lg:w-[350px] flex flex-col gap-6">
          <h3 className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-4">Patrocinadores</h3>
          {sponsors.map((sp) => (
            <div key={sp.id} onClick={() => setAbrirCard(sp)} className="cursor-pointer bg-zinc-900 rounded-[2.5rem] overflow-hidden border border-white/5 hover:border-red-600/50 transition-all shadow-xl">
               <div className="aspect-video bg-black relative">
                  <img src={sp.video_url} className="w-full h-full object-cover opacity-80" alt="publicidad" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center shadow-lg">
                       <div className="border-l-[8px] border-l-white border-y-[5px] border-y-transparent ml-1" />
                    </div>
                  </div>
               </div>
               <div className="p-4 text-center bg-zinc-900 border-t border-white/5">
                  <p className="text-[10px] font-black uppercase italic text-zinc-400">{sp.nombre}</p>
               </div>
            </div>
          ))}
        </div>
      </main>

      {/* MODALES DE DETALLE */}
      {abrirNoticia && (
        <div className="fixed inset-0 z-[999] bg-black/95 flex items-center justify-center p-4 backdrop-blur-sm">
           <div className="w-full max-w-4xl bg-zinc-950 border-2 border-red-600 rounded-[3rem] overflow-hidden overflow-y-auto max-h-[90vh] shadow-2xl">
              <button onClick={() => setAbrirNoticia(null)} className="absolute top-6 right-6 z-50 bg-red-600 text-white w-10 h-10 rounded-full font-black text-xl">X</button>
              <img src={abrirNoticia.imagen_url} className="w-full h-64 object-cover" alt="detalle noticia" />
              <div className="p-8">
                <h2 className="text-3xl font-black uppercase italic mb-6 leading-tight">{abrirNoticia.titulo}</h2>
                <div className="w-16 h-1 bg-red-600 mb-6" />
                <p className="text-zinc-300 text-lg leading-relaxed whitespace-pre-wrap">{abrirNoticia.contenido}</p>
              </div>
           </div>
        </div>
      )}

      {abrirCard && (
        <div className="fixed inset-0 z-[999] bg-black/98 flex items-center justify-center p-4">
           <div className="relative w-full max-w-3xl bg-zinc-950 border-2 border-red-600 rounded-[3rem] overflow-hidden shadow-2xl">
              <button onClick={() => setAbrirCard(null)} className="absolute top-6 right-6 z-50 bg-red-600 text-white w-10 h-10 rounded-full font-black">X</button>
              <div className="w-full h-[60vh] bg-black flex items-center justify-center">
                {abrirCard.video_url?.includes('.mp4') ? (
                   <video src={abrirCard.video_url} controls autoPlay className="w-full h-full object-contain" />
                ) : (
                   <img src={abrirCard.video_url} className="w-full h-full object-contain" alt="publicidad detalle" />
                )}
              </div>
              <div className="p-6 text-center bg-zinc-900 border-t border-white/5">
                 <h2 className="text-xl font-black uppercase italic text-red-600">{abrirCard.nombre}</h2>
              </div>
           </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-marquee { display: inline-block; animation: marquee 30s linear infinite; }
      `}</style>
    </div>
  );
}
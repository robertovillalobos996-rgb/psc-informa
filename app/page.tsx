"use client";
import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '../lib/supabase';

export default function Home() {
  const [noticias, setNoticias] = useState([]);
  const [manuales, setManuales] = useState([]);
  const [sponsors, setSponsors] = useState([]);
  const [alertas, setAlertas] = useState([]);
  const [ticker, setTicker] = useState("🔴 PSC INFORMA: TRANSMISIÓN CONTINUA 24/7 ★★★ COBERTURA NACIONAL");
  const [activado, setActivado] = useState(false);
  const [idx, setIdx] = useState(0);
  const [abrirCard, setAbrirCard] = useState(null);
  const [abrirNoticia, setAbrirNoticia] = useState(null);

  // REFERENCIA BLINDADA: Evita que el carrusel se trabe al borrar noticias
  const manualesRef = useRef([]);

  const cargarRSS = async () => {
    try {
      const res = await fetch('/api/rss-news');
      const data = await res.json();
      if (data.texto) setTicker(data.texto);
    } catch (e) {
      console.log("Error de RSS");
    }
  };

  // FUNCION MAESTRA QUE JALA LOS DATOS
  const cargarTodo = async () => {
    const { data: news } = await supabase.from('noticias').select('*').order('id', { ascending: false });
    const { data: ads } = await supabase.from('patrocinadores').select('*').order('id', { ascending: false });
    
    setNoticias(news || []);
    setSponsors(ads || []);
    
    const filtrados = news?.filter(n => n.manual) || [];
    setManuales(filtrados);
    manualesRef.current = filtrados; // Guarda la lista fresca para el carrusel
  };

  useEffect(() => {
    cargarTodo();
    cargarRSS();

    // 📡 RADAR DE SINCRONIZACIÓN: Revisa la base de datos cada 10 segundos
    // Si usted borra algo en el panel, la pantalla lo quitará sola en máximo 10s.
    const syncTimer = setInterval(cargarTodo, 10000);
    
    const rssTimer = setInterval(cargarRSS, 60000);

    // Alertas con Sirena
    const canal = supabase.channel('alertas')
      .on('postgres_changes', { event: 'INSERT', table: 'alertas' }, (p) => {
        setAlertas(prev => [p.new, ...prev]);
        if(activado) {
          const audio = new Audio('/alarma.mp3');
          audio.play().catch(()=>{});
        }
      }).subscribe();

    // Carrusel Rotativo
    const t = setInterval(() => {
      setIdx(p => {
        const cantidad = manualesRef.current.length;
        if (cantidad === 0) return 0;
        return (p + 1) % cantidad;
      });
    }, 8000);

    return () => { 
      supabase.removeChannel(canal); 
      clearInterval(t); 
      clearInterval(rssTimer); 
      clearInterval(syncTimer); 
    };
  }, [activado]);

  return (
    <main className="bg-black text-white min-h-screen font-sans overflow-x-hidden">
      
      {/* ALERTAS SUPERIORES */}
      <div className="fixed top-0 left-0 w-full z-[9999] pointer-events-none flex flex-col">
        {alertas.map(al => (
          <div key={al.id} className={`pointer-events-auto w-full p-4 flex justify-between items-center border-b-2 shadow-2xl animate-pulse
            ${al.color === 'rojo' ? 'bg-red-600 border-red-400' : 'bg-yellow-500 text-black border-yellow-300'}`}>
            <p className="text-xl md:text-3xl font-black uppercase italic">🚨 {al.mensaje} 🚨</p>
            <button onClick={() => setAlertas(prev => prev.filter(a => a.id !== al.id))} className="bg-black text-white w-10 h-10 rounded-full font-black text-xl hover:scale-110">X</button>
          </div>
        ))}
      </div>

      {/* ACTIVADOR */}
      {!activado && (
        <div className="fixed inset-0 bg-black/95 z-[5000] flex items-center justify-center p-8 backdrop-blur-sm">
          <div className="text-center">
            <img src="/logo-psc.png" className="h-24 mx-auto mb-8 animate-pulse" />
            <button onClick={() => setActivado(true)} className="bg-red-600 px-12 py-6 rounded-full font-black text-2xl uppercase shadow-[0_0_30px_rgba(220,38,38,0.8)]">
              ACTIVAR PSC INFORMA 🚨
            </button>
          </div>
        </div>
      )}

      {/* HEADER */}
      <nav className="p-4 bg-black border-b border-white/10 flex justify-between items-center sticky top-0 z-[100]">
        <div className="flex items-center gap-4">
          <img src="/logo-psc.png" className="h-10" />
          <h1 className="text-xl font-black italic tracking-tighter uppercase">PSC <span className="text-red-600">INFORMA</span></h1>
        </div>
      </nav>

      {/* CARRUSEL DE NOTICIAS PRINCIPALES */}
      {manuales.length > 0 && (
        <section className="relative h-[60vh] w-full border-b-[6px] border-red-600 overflow-hidden bg-zinc-900">
          {manuales[idx]?.imagen_url?.includes('.mp4') ? (
            <video src={manuales[idx]?.imagen_url} className="w-full h-full object-cover opacity-60" autoPlay muted loop />
          ) : (
            <img src={manuales[idx]?.imagen_url || '/logo-psc.png'} className="w-full h-full object-cover opacity-60" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
          <div className="absolute bottom-12 left-10 md:left-20 max-w-4xl">
            <h2 className="text-4xl md:text-6xl font-black uppercase italic leading-tight drop-shadow-2xl">
              {manuales[idx]?.titulo}
            </h2>
          </div>
        </section>
      )}

      {/* BARRA ROJA RSS */}
      <div className="bg-red-700 py-3 overflow-hidden border-b-2 border-black relative z-50">
        <style>{`
          @keyframes scrollRSS { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } }
          .rss-run { display: inline-block; white-space: nowrap; animation: scrollRSS 120s linear infinite; font-weight: 900; text-transform: uppercase; font-style: italic; font-size: 16px; color: white;}
        `}</style>
        <div className="rss-run">{ticker}</div>
      </div>

      {/* GRILLA PRINCIPAL */}
      <div className="max-w-[1600px] mx-auto p-10 grid grid-cols-1 lg:grid-cols-4 gap-10">
        
        {/* NOTICIAS */}
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-8">
          {noticias.map(n => (
            <article key={n.id} onClick={() => setAbrirNoticia(n)} className="bg-zinc-950 rounded-[2.5rem] overflow-hidden border border-zinc-900 shadow-xl cursor-pointer hover:border-red-600 transition-all group">
               <div className="h-64 bg-zinc-900 relative">
                  {n.imagen_url?.includes('.mp4') ? (
                     <video src={n.imagen_url} className="w-full h-full object-cover" muted loop autoPlay />
                  ) : (
                     <img src={n.imagen_url || '/logo-psc.png'} className="w-full h-full object-cover" />
                  )}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <span className="bg-red-600 text-white px-4 py-2 rounded-full font-black text-xs uppercase">Leer Noticia Completa</span>
                  </div>
               </div>
               <div className="p-8">
                 <h3 className="text-2xl font-black mb-3 uppercase italic leading-tight group-hover:text-red-500 transition-colors">{n.titulo}</h3>
                 <p className="text-zinc-400 text-sm line-clamp-3">{n.contenido}</p>
               </div>
            </article>
          ))}
        </div>

        {/* CARDS COMERCIALES */}
        <aside className="space-y-6">
          <h4 className="text-center text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">PUBLICIDAD VIP</h4>
          {sponsors.filter(s => s.layout === 'vertical').map(s => (
            <div key={s.id} onClick={() => setAbrirCard(s)} className="bg-zinc-900 p-3 rounded-2xl border border-white/5 shadow-lg cursor-pointer hover:border-red-600 transition-all group">
               <div className="relative h-32 overflow-hidden rounded-xl bg-black">
                  {s.video_url?.includes('.mp4') ? (
                    <video src={s.video_url} className="w-full h-full object-cover opacity-70 group-hover:opacity-100" muted loop autoPlay />
                  ) : (
                    <img src={s.video_url || '/logo-psc.png'} className="w-full h-full object-cover opacity-70 group-hover:opacity-100" />
                  )}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <span className="bg-red-600 text-white px-3 py-1 rounded-full font-black text-[9px] uppercase">VER</span>
                  </div>
               </div>
               <p className="text-center font-black uppercase italic mt-3 text-[10px]">{s.nombre}</p>
            </div>
          ))}
        </aside>
      </div>

      {/* --- MODAL DE NOTICIAS --- */}
      {abrirNoticia && (
        <div className="fixed inset-0 z-[9999] bg-black/98 flex items-center justify-center p-4">
           <div className="relative w-full max-w-5xl bg-zinc-950 border-2 border-red-600 rounded-[2rem] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
              <button onClick={() => setAbrirNoticia(null)} className="absolute top-4 right-4 z-50 bg-red-600 text-white w-10 h-10 rounded-full font-black text-lg hover:bg-white hover:text-red-600">X</button>
              
              <div className="w-full h-[45vh] bg-black flex-shrink-0">
                {abrirNoticia.imagen_url?.includes('.mp4') ? (
                   <video src={abrirNoticia.imagen_url} controls autoPlay className="w-full h-full object-contain" />
                ) : (
                   <img src={abrirNoticia.imagen_url || '/logo-psc.png'} className="w-full h-full object-contain" />
                )}
              </div>
              
              <div className="p-10 overflow-y-auto bg-zinc-900 border-t border-zinc-800">
                 <h2 className="text-3xl font-black uppercase italic text-white mb-6">{abrirNoticia.titulo}</h2>
                 <p className="text-zinc-300 text-lg leading-relaxed whitespace-pre-wrap">{abrirNoticia.contenido}</p>
              </div>
           </div>
        </div>
      )}

      {/* --- MODAL DE PUBLICIDAD --- */}
      {abrirCard && (
        <div className="fixed inset-0 z-[9999] bg-black/98 flex items-center justify-center p-4">
           <div className="relative w-full max-w-4xl bg-zinc-950 border-2 border-red-600 rounded-[2rem] overflow-hidden shadow-2xl">
              <button onClick={() => setAbrirCard(null)} className="absolute top-4 right-4 z-50 bg-red-600 text-white w-10 h-10 rounded-full font-black text-lg hover:bg-white hover:text-red-600">X</button>
              
              <div className="w-full h-[60vh] bg-black flex items-center justify-center">
                {abrirCard.video_url?.includes('.mp4') ? (
                   <video src={abrirCard.video_url} controls autoPlay className="w-full h-full object-contain" />
                ) : (
                   <img src={abrirCard.video_url || '/logo-psc.png'} className="w-full h-full object-contain" />
                )}
              </div>
              
              <div className="p-6 text-center bg-zinc-900 border-t border-zinc-800">
                 <h2 className="text-2xl font-black uppercase italic text-white">{abrirCard.nombre}</h2>
                 <p className="text-zinc-500 text-xs mt-2 uppercase tracking-widest">Espacio Patrocinado</p>
              </div>
           </div>
        </div>
      )}

    </main>
  );
}
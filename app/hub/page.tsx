"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import AdminNoticias from '../admin/noticias/page';
import AdminAlertas from '../admin/alertas/page';
import AdminSponsors from '../admin/patrocinadores/page';

export default function MasterHub() {
  const [tab, setTab] = useState('noticias');
  const [isLogged, setIsLogged] = useState(false);
  const [noticias, setNoticias] = useState([]);
  const [clientes, setClientes] = useState([]);

  useEffect(() => {
    if (localStorage.getItem('admin_session') === 'active') {
      setIsLogged(true);
      cargarTodo();
    }
  }, []);

  const cargarTodo = async () => {
    const { data: n } = await supabase.from('noticias').select('*').order('id', { ascending: false });
    const { data: c } = await supabase.from('patrocinadores').select('*').order('id', { ascending: false });
    setNoticias(n || []);
    setClientes(c || []);
  };

  // 🔴 CIRUGÍA: MOTOR DE BORRADO REAL 🔴
  const borrarItem = async (tabla, id) => {
    if(confirm('¿Seguro que desea eliminar esto de la base de datos?')) {
      try {
        // Le pedimos a Supabase que borre y nos DEVUELVA lo que borró (.select)
        const { data, error } = await supabase.from(tabla).delete().eq('id', id).select();
        
        if (error) throw error;
        
        if (!data || data.length === 0) {
           alert("⚠️ Supabase bloqueó el borrado. Vaya a Supabase y desactive el Row Level Security (RLS).");
           return;
        }

        // Si llegó hasta aquí, se borró de verdad. Recargamos la lista fresca.
        cargarTodo();
        
      } catch (err) {
        alert("❌ Error crítico al borrar: " + err.message);
      }
    }
  };

  if (!isLogged) return <div className="h-screen bg-black text-white flex items-center justify-center font-black">ACCESO DENEGADO</div>;

  return (
    <div className="h-screen w-full bg-slate-100 flex overflow-hidden font-sans">
      
      <aside className="w-20 hover:w-64 bg-black transition-all duration-300 flex flex-col items-center py-8 z-50 group">
        <img src="/logo-psc.png" className="h-10 mb-10" style={{mixBlendMode:'screen'}}/>
        <nav className="flex flex-col gap-6 w-full px-4 text-white">
          <button onClick={() => setTab('noticias')} className={`p-4 rounded-2xl flex items-center gap-4 ${tab === 'noticias' ? 'bg-red-600' : 'hover:bg-zinc-900'}`}>📰 <span className="font-bold hidden group-hover:block uppercase text-[10px]">Noticias</span></button>
          <button onClick={() => setTab('alertas')} className={`p-4 rounded-2xl flex items-center gap-4 ${tab === 'alertas' ? 'bg-red-600' : 'hover:bg-zinc-900'}`}>🚨 <span className="font-bold hidden group-hover:block uppercase text-[10px]">Alertas</span></button>
          <button onClick={() => setTab('sponsors')} className={`p-4 rounded-2xl flex items-center gap-4 ${tab === 'sponsors' ? 'bg-red-600' : 'hover:bg-zinc-900'}`}>💰 <span className="font-bold hidden group-hover:block uppercase text-[10px]">Clientes</span></button>
        </nav>
      </aside>

      <section className="flex-1 overflow-y-auto p-8 text-black">
        {tab === 'noticias' && (
          <div className="max-w-4xl mx-auto space-y-8">
            <AdminNoticias />
            <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-slate-200">
              <h3 className="font-black uppercase mb-6 text-slate-500 text-xs tracking-widest border-l-4 border-red-600 pl-4">Noticias Publicadas</h3>
              <div className="space-y-3">
                {noticias.map(n => (
                  <div key={n.id} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border hover:border-red-200">
                    <span className="font-bold text-sm truncate w-80">{n.titulo}</span>
                    <button onClick={() => borrarItem('noticias', n.id)} className="bg-red-100 text-red-600 w-8 h-8 rounded-full font-black hover:bg-red-600 hover:text-white transition-all flex items-center justify-center">X</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {tab === 'alertas' && <AdminAlertas />}
        
        {tab === 'sponsors' && (
          <div className="max-w-4xl mx-auto space-y-8">
            <AdminSponsors />
            <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-slate-200">
              <h3 className="font-black uppercase mb-6 text-slate-500 text-xs tracking-widest border-l-4 border-red-600 pl-4">Anuncios Activos</h3>
              <div className="space-y-3">
                {clientes.map(c => (
                  <div key={c.id} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border hover:border-red-200">
                    <span className="font-bold text-sm truncate w-80">{c.nombre}</span>
                    <button onClick={() => borrarItem('patrocinadores', c.id)} className="bg-red-100 text-red-600 w-8 h-8 rounded-full font-black hover:bg-red-600 hover:text-white transition-all flex items-center justify-center">X</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>

      <section className="hidden xl:block w-[450px] bg-black border-l-4 border-slate-900 relative">
        <div className="absolute top-0 w-full p-2 bg-zinc-900 text-[10px] text-center font-black text-red-600 uppercase tracking-widest z-10">Vista en Vivo - PSC Informa</div>
        <iframe src="/" className="w-full h-full border-none pt-8"></iframe>
      </section>
      
    </div>
  );
}
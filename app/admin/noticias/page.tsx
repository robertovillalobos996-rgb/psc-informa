"use client";
import React, { useState } from 'react';
import { supabase } from '../../../lib/supabase';

export default function AdminNoticias() {
  const [titulo, setTitulo] = useState('');
  const [contenido, setContenido] = useState('');
  const [archivo, setArchivo] = useState(null);
  const [status, setStatus] = useState('');

  const publicar = async (e) => {
    e.preventDefault();
    setStatus('📡 SUBIENDO ARCHIVO...');
    try {
      let finalUrl = '';
      if (archivo) {
        const nombre = `${Date.now()}-${archivo.name}`;
        const { error: upErr } = await supabase.storage.from('noticias').upload(nombre, archivo);
        if (upErr) throw upErr;
        const { data } = supabase.storage.from('noticias').getPublicUrl(nombre);
        finalUrl = data.publicUrl;
      }
      const { error } = await supabase.from('noticias').insert([{ 
        titulo, contenido, imagen_url: finalUrl, manual: true 
      }]);
      if (error) throw error;
      setStatus('✅ PUBLICADO EN PORTADA');
      setTitulo(''); setContenido(''); setArchivo(null);
    } catch (err) { setStatus('❌ ERROR: ' + err.message); }
  };

  return (
    <div className="p-8 bg-white rounded-[2rem] text-black shadow-2xl border-4 border-slate-100">
      <h2 className="text-xl font-black mb-6 uppercase italic">📢 REDACTOR PSC INFORMA</h2>
      <form onSubmit={publicar} className="space-y-4">
        <input value={titulo} onChange={(e)=>setTitulo(e.target.value)} className="w-full p-4 border-2 rounded-xl font-bold" placeholder="TITULAR DE LA NOTICIA" required />
        <div className="p-6 border-4 border-dashed rounded-2xl bg-slate-50">
           <label className="block mb-2 font-black text-xs uppercase">Seleccionar Foto o Video de mi PC:</label>
           <input type="file" onChange={(e)=>setArchivo(e.target.files[0])} className="w-full" required />
        </div>
        <textarea value={contenido} onChange={(e)=>setContenido(e.target.value)} className="w-full p-4 border-2 rounded-xl h-32" placeholder="DETALLES..." />
        <button className="w-full bg-red-600 text-white py-5 rounded-2xl font-black uppercase shadow-xl hover:bg-black transition-all">PUBLICAR NOTICIA</button>
        {status && <p className="text-center font-bold mt-4 animate-pulse">{status}</p>}
      </form>
    </div>
  );
}
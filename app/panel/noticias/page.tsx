"use client";
import React, { useState } from 'react';
import { supabase } from '../../../lib/supabase';

export default function AdminNoticias() {
  const [titulo, setTitulo] = useState('');
  const [contenido, setContenido] = useState('');
  const [archivo, setArchivo] = useState<any>(null);
  const [status, setStatus] = useState('');
  const [manual, setManual] = useState(false);

  const publicar = async (e: any) => {
    e.preventDefault();
    setStatus('📡 SUBIENDO ARCHIVO...');
    
    try {
      let finalUrl = '';
      if (archivo) {
        const nombreFile = `${Date.now()}-${archivo.name}`;
        const { error: upErr } = await supabase.storage.from('noticias').upload(nombreFile, archivo);
        if (upErr) throw upErr;
        const { data } = supabase.storage.from('noticias').getPublicUrl(nombreFile);
        finalUrl = data.publicUrl;
      }

      const { error } = await supabase.from('noticias').insert([{ 
        titulo, 
        contenido, 
        imagen_url: finalUrl, 
        manual 
      }]);
      
      if (error) throw error;
      
      setStatus('✅ PUBLICADO CON ÉXITO');
      setTitulo(''); setContenido(''); setArchivo(null);
    } catch (err: any) {
      setStatus('❌ ERROR: ' + err.message);
    }
  };

  return (
    <div className="p-8 bg-white rounded-[2rem] text-black shadow-2xl border-4 border-slate-100">
      <h2 className="text-xl font-black mb-6 uppercase italic border-l-4 border-red-600 pl-4">Redacción de Noticias</h2>
      <form onSubmit={publicar} className="space-y-4">
        <input value={titulo} onChange={(e: any) => setTitulo(e.target.value)} className="w-full p-4 border-2 rounded-xl font-bold" placeholder="TITULAR DE LA NOTICIA" required />
        <textarea value={contenido} onChange={(e: any) => setContenido(e.target.value)} className="w-full p-4 border-2 rounded-xl font-medium h-32" placeholder="CUERPO DE LA NOTICIA..." required />
        
        <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border-2">
           <input type="checkbox" checked={manual} onChange={(e: any) => setManual(e.target.checked)} className="w-6 h-6" />
           <label className="font-black text-xs uppercase italic">Mostrar en Carrusel Principal (Banner Ancho)</label>
        </div>

        <div className="p-6 border-4 border-dashed rounded-2xl bg-slate-50 text-center">
           <label className="block mb-2 font-black text-[10px] uppercase tracking-widest text-slate-400">Adjuntar Foto o Video (MP4):</label>
           <input type="file" onChange={(e: any) => setArchivo(e.target.files[0])} className="w-full text-xs" />
        </div>

        <button className="w-full bg-black text-white py-5 rounded-2xl font-black uppercase shadow-xl hover:bg-red-600 transition-all">SUBIR A PSC INFORMA</button>
        {status && <p className="text-center font-bold mt-4 animate-pulse text-red-600 text-xs">{status}</p>}
      </form>
    </div>
  );
}
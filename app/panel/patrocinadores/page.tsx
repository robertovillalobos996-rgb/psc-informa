"use client";
import React, { useState } from 'react';
import { supabase } from '../../../lib/supabase';

export default function AdminSponsors() {
  const [nombre, setNombre] = useState('');
  const [layout, setLayout] = useState('vertical');
  const [archivo, setArchivo] = useState<any>(null);
  const [status, setStatus] = useState('');

  const registrarSponsor = async (e: any) => {
    e.preventDefault();
    setStatus('📡 SUBIENDO ANUNCIO...');
    
    try {
      let finalUrl = '';
      if (archivo) {
        const nombreFile = `${Date.now()}-${archivo.name}`;
        const { error: upErr } = await supabase.storage.from('noticias').upload(nombreFile, archivo);
        if (upErr) throw upErr;
        const { data } = supabase.storage.from('noticias').getPublicUrl(nombreFile);
        finalUrl = data.publicUrl;
      }

      const fechaExp = new Date();
      fechaExp.setDate(fechaExp.getDate() + 30);

      const { error } = await supabase.from('patrocinadores').insert([{ 
        nombre, 
        video_url: finalUrl, 
        layout, 
        fecha_expiracion: fechaExp.toISOString() 
      }]);
      
      if (error) throw error;
      
      setStatus('✅ ANUNCIO PUBLICADO');
      setNombre(''); setArchivo(null);
    } catch (err: any) {
      setStatus('❌ ERROR: ' + err.message);
    }
  };

  return (
    <div className="p-8 bg-white rounded-[2rem] text-black shadow-2xl border-4 border-slate-100">
      <h2 className="text-xl font-black mb-6 uppercase italic border-l-4 border-red-600 pl-4">Gestor de Publicidad VIP</h2>
      <form onSubmit={registrarSponsor} className="space-y-4">
        <input value={nombre} onChange={(e: any) => setNombre(e.target.value)} className="w-full p-4 border-2 rounded-xl font-bold" placeholder="NOMBRE DEL CLIENTE / MARCA" required />
        
        <div className="grid grid-cols-2 gap-4">
          <label className={`p-4 border-2 rounded-xl flex items-center justify-center font-black cursor-pointer text-[10px] ${layout === 'horizontal' ? 'bg-black text-white' : 'bg-slate-50 text-slate-400'}`}>
            <input type="radio" name="layout" className="hidden" checked={layout === 'horizontal'} onChange={() => setLayout('horizontal')} />
            BANNER (ANCHO)
          </label>
          <label className={`p-4 border-2 rounded-xl flex items-center justify-center font-black cursor-pointer text-[10px] ${layout === 'vertical' ? 'bg-black text-white' : 'bg-slate-50 text-slate-400'}`}>
            <input type="radio" name="layout" className="hidden" checked={layout === 'vertical'} onChange={() => setLayout('vertical')} />
            CARD (LATERAL)
          </label>
        </div>

        <div className="p-6 border-4 border-dashed rounded-2xl bg-slate-50 text-center">
           <label className="block mb-2 font-black text-[10px] uppercase tracking-widest text-slate-400">Subir Video o Imagen desde PC:</label>
           <input type="file" onChange={(e: any) => setArchivo(e.target.files[0])} className="w-full text-xs" required />
        </div>

        <button className="w-full bg-red-600 text-white py-5 rounded-2xl font-black uppercase shadow-xl hover:bg-black transition-all">PUBLICAR ANUNCIO</button>
        {status && <p className="text-center font-bold mt-4 animate-pulse text-red-600 text-xs">{status}</p>}
      </form>
    </div>
  );
}
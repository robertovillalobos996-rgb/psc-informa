"use client";
import React, { useState } from 'react';
import { supabase } from '../../../lib/supabase';

export default function AdminSponsors() {
  const [nombre, setNombre] = useState('');
  const [layout, setLayout] = useState('vertical');
  const [archivo, setArchivo] = useState(null);
  const [status, setStatus] = useState('');

  const registrarSponsor = async (e) => {
    e.preventDefault();
    setStatus('📡 SUBIENDO ANUNCIO...');
    
    try {
      let finalUrl = '';
      
      // Usamos el mismo motor exacto de las Noticias que ya sabemos que funciona
      if (archivo) {
        const nombreFile = `${Date.now()}-${archivo.name}`;
        // Lo subimos a la carpeta de noticias porque ya es pública y tiene los permisos abiertos
        const { error: upErr } = await supabase.storage.from('noticias').upload(nombreFile, archivo);
        if (upErr) throw upErr;
        const { data } = supabase.storage.from('noticias').getPublicUrl(nombreFile);
        finalUrl = data.publicUrl;
      }

      // Calculamos 30 días de vigencia
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
    } catch (err) {
      setStatus('❌ ERROR: ' + err.message);
    }
  };

  return (
    <div className="p-8 bg-white rounded-[2rem] text-black shadow-2xl border-4 border-slate-100">
      <h2 className="text-xl font-black mb-6 uppercase italic">💰 GESTOR DE PUBLICIDAD VIP</h2>
      <form onSubmit={registrarSponsor} className="space-y-4">
        <input value={nombre} onChange={(e) => setNombre(e.target.value)} className="w-full p-4 border-2 rounded-xl font-bold" placeholder="NOMBRE DEL CLIENTE" required />
        
        <div className="grid grid-cols-2 gap-4">
          <label className={`p-4 border-2 rounded-xl flex items-center justify-center font-black cursor-pointer ${layout === 'horizontal' ? 'bg-black text-white' : 'bg-slate-50'}`}>
            <input type="radio" name="layout" className="hidden" checked={layout === 'horizontal'} onChange={() => setLayout('horizontal')} />
            BANNER (CARRUSEL)
          </label>
          <label className={`p-4 border-2 rounded-xl flex items-center justify-center font-black cursor-pointer ${layout === 'vertical' ? 'bg-black text-white' : 'bg-slate-50'}`}>
            <input type="radio" name="layout" className="hidden" checked={layout === 'vertical'} onChange={() => setLayout('vertical')} />
            CARD (LATERAL)
          </label>
        </div>

        <div className="p-6 border-4 border-dashed rounded-2xl bg-slate-50 text-center">
           <label className="block mb-2 font-black text-xs uppercase">Subir Foto o Video (MP4) desde mi PC:</label>
           <input type="file" onChange={(e) => setArchivo(e.target.files[0])} className="w-full" required />
        </div>

        <button className="w-full bg-red-600 text-white py-5 rounded-2xl font-black uppercase shadow-xl hover:bg-black transition-all">PUBLICAR ANUNCIO</button>
        {status && <p className="text-center font-bold mt-4 animate-pulse">{status}</p>}
      </form>
    </div>
  );
}
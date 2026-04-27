"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function AdminPanel() {
  const [tab, setTab] = useState('noticias'); 
  const [form, setForm] = useState({ titulo: '', contenido: '', layout: 'horizontal' });
  const [archivo, setArchivo] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [status, setStatus] = useState('');
  const [ultimoLink, setUltimoLink] = useState('');

  useEffect(() => { cargarDatos(); }, [tab]);

  async function cargarDatos() {
    const tabla = tab === 'noticias' ? 'noticias' : 'patrocinadores';
    const { data } = await supabase.from(tabla).select('*').order('created_at', { ascending: false });
    if (data) setItems(data);
  }

  async function manejarEnvio(e: any) {
    e.preventDefault();
    if (!archivo || !form.titulo) return alert("⚠️ Falta título o archivo");
    
    // Limite de 50MB para el plan gratuito
    if (archivo.size > 50 * 1024 * 1024) return alert("❌ El archivo es muy grande. Máximo 50MB.");

    setStatus('📡 SUBIENDO...');
    try {
      const nombreFile = `${Date.now()}-${archivo.name.replace(/\s/g, '_')}`;
      const { error: upErr } = await supabase.storage.from('noticias').upload(nombreFile, archivo);
      if (upErr) throw upErr;

      const { data: urlData } = supabase.storage.from('noticias').getPublicUrl(nombreFile);
      const urlFinal = urlData.publicUrl;
      
      const tabla = tab === 'noticias' ? 'noticias' : 'patrocinadores';
      const insertData: any = tab === 'noticias' ? {
        titulo: form.titulo,
        contenido: form.contenido,
        imagen_url: urlFinal,
        categoria: form.layout // Corregido: noticias usa 'categoria'
      } : {
        nombre: form.titulo,
        video_url: urlFinal,
        layout: form.layout // Patrocinadores usa 'layout'
      };

      const { data: resData, error: dbErr } = await supabase.from(tabla).insert([insertData]).select();
      if (dbErr) throw dbErr;

      setStatus('✅ PUBLICADO');
      if (tab === 'noticias' && resData?.[0]) setUltimoLink(`https://psc-informa.vercel.app/?id=${resData[0].id}`);
      setForm({ titulo: '', contenido: '', layout: 'horizontal' });
      setArchivo(null);
      cargarDatos();
    } catch (err: any) { alert(err.message); setStatus('❌ ERROR'); }
  }

  async function borrar(id: any, url: string) {
    if (!confirm("¿Borrar definitivamente?")) return;
    try {
      const tabla = tab === 'noticias' ? 'noticias' : 'patrocinadores';
      await supabase.from(tabla).delete().eq('id', id);
      
      // Corregido: Evita el error de 'split' si la URL no es válida
      if (url && typeof url === 'string' && url.includes('/')) {
        const nombreArchivo = url.split('/').pop();
        if (nombreArchivo) await supabase.storage.from('noticias').remove([nombreArchivo]);
      }
      
      alert("🗑️ Eliminado");
      cargarDatos();
    } catch (error: any) { alert("Error al borrar: " + error.message); }
  }

  return (
    <div style={{minHeight:'100vh', background:'#000', color:'#fff', padding:'20px', fontFamily:'sans-serif'}}>
      <div style={{maxWidth:'800px', margin:'0 auto'}}>
        <div style={{display:'flex', gap:'10px', marginBottom:'20px'}}>
          <button onClick={() => setTab('noticias')} style={{flex:1, padding:'15px', background: tab==='noticias'?'#ff0000':'#222', color:'#fff', borderRadius:'10px', fontWeight:'bold', cursor:'pointer', border:'none'}}>📰 NOTICIAS</button>
          <button onClick={() => setTab('publicidad')} style={{flex:1, padding:'15px', background: tab==='publicidad'?'#ff0000':'#222', color:'#fff', borderRadius:'10px', fontWeight:'bold', cursor:'pointer', border:'none'}}>🎬 PUBLICIDAD</button>
        </div>
        
        {ultimoLink && (
          <div style={{background:'#1a472a', border:'2px solid #2ecc71', padding:'15px', borderRadius:'10px', marginBottom:'20px', textAlign:'center'}}>
            <p style={{color:'#2ecc71', fontWeight:'bold'}}>🚀 Link Facebook: {ultimoLink}</p>
          </div>
        )}

        <form onSubmit={manejarEnvio} style={{background:'#111', padding:'25px', borderRadius:'20px', border:'1px solid #333'}}>
          <input required value={form.titulo} onChange={e => setForm({...form, titulo: e.target.value})} placeholder="Título / Nombre Comercial" style={{width:'100%', padding:'12px', marginBottom:'15px', background:'#000', border:'1px solid #444', color:'#fff', borderRadius:'8px'}} />
          
          <select value={form.layout} onChange={e => setForm({...form, layout: e.target.value})} style={{width:'100%', padding:'12px', marginBottom:'15px', background:'#000', border:'1px solid #444', color:'#fff', borderRadius:'8px'}}>
            <option value="horizontal">BANNER GRANDE (HORIZONTAL)</option>
            <option value="vertical">CARD PEQUEÑA (VERTICAL)</option>
          </select>

          {tab === 'noticias' && <textarea required placeholder="Escriba la noticia aquí..." value={form.contenido} onChange={e => setForm({...form, contenido: e.target.value})} style={{width:'100%', padding:'12px', marginBottom:'15px', background:'#000', border:'1px solid #444', color:'#fff', height:'120px', borderRadius:'8px'}} />}
          
          <div style={{background:'#000', padding:'20px', border:'2px dashed #333', borderRadius:'15px', marginBottom:'20px', textAlign:'center'}}>
            <input type="file" onChange={(e: any) => setArchivo(e.target.files[0])} />
          </div>
          
          <button type="submit" disabled={status.includes('SUBIENDO')} style={{width:'100%', padding:'18px', background:'#ff0000', color:'#fff', border:'none', borderRadius:'12px', fontWeight:'bold', cursor:'pointer'}}>
            {status || `PUBLICAR`}
          </button>
        </form>

        <div style={{marginTop:'30px'}}>
          <h3 style={{color:'#666', fontSize:'12px', marginBottom:'15px', textTransform:'uppercase'}}>Gestionar contenido:</h3>
          {items.map((item: any) => (
            <div key={item.id} style={{display:'flex', justifyContent:'space-between', alignItems:'center', background:'#111', padding:'12px', borderRadius:'12px', marginBottom:'10px', border:'1px solid #222'}}>
              <span style={{fontSize:'14px', fontWeight:'bold'}}>{tab === 'noticias' ? item.titulo : item.nombre}</span>
              <button onClick={() => borrar(item.id, tab === 'noticias' ? item.imagen_url : item.video_url)} style={{background:'none', border:'none', color:'#ff4444', fontWeight:'bold', cursor:'pointer'}}>BORRAR</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
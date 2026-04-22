import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export async function POST(req) {
  try {
    const { tipo } = await req.json();
    const url = tipo === 'nacional' ? 'https://www.nacion.com/arc/outboundfeeds/rss/?outputType=xml' : 'https://feeds.bbci.co.uk/mundo/rss.xml';
    
    const res = await fetch(url);
    const xml = await res.text();
    const items = xml.split('<item>').slice(1, 7);

    const noticias = items.map(item => {
      const titulo = item.match(/<title>(.*?)<\/title>/)?.[1]?.replace('<![CDATA[', '').replace(']]>', '');
      const desc = item.match(/<description>(.*?)<\/description>/)?.[1]?.replace('<![CDATA[', '').replace(']]>', '');
      
      // BUSCADOR DE FOTOS REALES (Busca en enclosure o media:content)
      const foto = item.match(/url=["']([^"']+(?:jpg|png|jpeg|webp))["']/i)?.[1] || 
                   'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800';

      return { 
        titulo, 
        contenido: desc?.replace(/<[^>]*>?/gm, ''), 
        imagen_url: foto, 
        categoria: tipo === 'nacional' ? 'Costa Rica' : 'Mundo', 
        tipo_media: 'image' 
      };
    });

    for (const n of noticias) {
      if(n.titulo) await supabase.from('noticias').insert([n]);
    }

    return NextResponse.json({ mensaje: `✅ ${noticias.length} noticias reales publicadas.` });
  } catch (e) { return NextResponse.json({ error: e.message }); }
}
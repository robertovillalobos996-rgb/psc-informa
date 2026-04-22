import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await fetch('https://www.crhoy.com/site/dist/rss/ultimahora.xml', { cache: 'no-store' });
    const xml = await res.text();
    
    // Buscamos los títulos ignorando etiquetas raras
    const titulos = [];
    const items = xml.split('<item>');
    
    for(let i = 1; i < items.length && i < 15; i++) {
      let t = items[i].split('<title>')[1]?.split('</title>')[0] || "";
      t = t.replace('<![CDATA[', '').replace(']]>', '').trim();
      if (t.length > 5) titulos.push(`🔴 ${t.toUpperCase()} (HACE INSTANTES)`);
    }

    const textoFinal = titulos.length > 0 ? titulos.join('  ★★★  ') : "📡 ACTUALIZANDO TITULARES DE COSTA RICA... ★★★ PSC INFORMA 24/7";
    return NextResponse.json({ texto: textoFinal + '  ★★★  ' });
  } catch (e) {
    return NextResponse.json({ texto: "⚠️ RECONECTANDO CON LA RED DE NOTICIAS... ★★★" });
  }
}
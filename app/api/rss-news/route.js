import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await fetch('https://news.google.com/rss/search?q=Costa+Rica+noticias&hl=es-419&gl=CR&ceid=CR:es-419', { cache: 'no-store' });
    const xml = await res.text();
    const items = xml.split('<item>');
    const titulos = items.slice(1, 15).map(item => {
      let t = item.split('<title>')[1]?.split('</title>')[0] || "";
      return `🔴 ${t.replace('<![CDATA[', '').replace(']]>', '').split(' - ')[0].toUpperCase()}`;
    }).filter(t => t.length > 5).join('  ★★★  ');

    return NextResponse.json({ texto: titulos + '  ★★★  PSC INFORMA 24/7  ★★★  ' });
  } catch (e) {
    return NextResponse.json({ texto: "📡 SINCRONIZANDO SEÑAL DE NOTICIAS... ★★★ PSC INFORMA ★★★" });
  }
}
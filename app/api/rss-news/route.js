import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Motor invencible de Google Noticias enfocado SOLO EN SUCESOS de Costa Rica
    const res = await fetch('https://news.google.com/rss/search?q=sucesos+costa+rica+última+hora&hl=es-419&gl=CR&ceid=CR:es-419', { cache: 'no-store' });
    const xml = await res.text();
    
    // Extraemos solo los títulos limpios
    const items = xml.split('<item>');
    const titulos = items.slice(1, 15).map(item => {
      let t = item.split('<title>')[1]?.split('</title>')[0] || "";
      // Limpiamos códigos raros y quitamos el nombre del periódico al final
      t = t.replace('<![CDATA[', '').replace(']]>', '').split(' - ')[0].trim();
      return `🔴 ${t.toUpperCase()} (HACE INSTANTES)`;
    }).filter(t => t.length > 5).join('  ★★★  ');

    const textoFinal = titulos.length > 0 ? titulos : "📡 ACTUALIZANDO SUCESOS DE COSTA RICA...";
    return NextResponse.json({ texto: textoFinal + '  ★★★  PSC INFORMA 24/7  ★★★  ' });
  } catch (e) {
    return NextResponse.json({ texto: "⚠️ RECONECTANDO CON LA RED DE SUCESOS... ★★★ PSC INFORMA 24/7 ★★★" });
  }
}
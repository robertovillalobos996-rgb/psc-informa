"use client";
import React from 'react';
import Link from 'next/link';

export default function HubMaestro() {
  return (
    <div className="min-h-screen bg-slate-900 p-6 text-white font-sans">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-black mb-8 border-b-4 border-red-600 pb-4 italic uppercase">
          Panel Maestro - Fabulosa Play
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/admin/alertas" className="bg-red-600 p-8 rounded-3xl shadow-2xl hover:scale-105 transition-transform text-center">
             <span className="text-4xl block mb-2">🚨</span>
             <span className="font-black uppercase italic">Alertas y Robot</span>
          </Link>
          <Link href="/admin/noticias" className="bg-blue-600 p-8 rounded-3xl shadow-2xl hover:scale-105 transition-transform text-center">
             <span className="text-4xl block mb-2">📰</span>
             <span className="font-black uppercase italic">Publicar Noticias</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
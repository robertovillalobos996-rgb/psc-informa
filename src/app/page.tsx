import { NotificationCard } from "@/components/news/NotificationCard";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-10 bg-black">
      <h1 className="text-4xl font-bold text-red-600 mb-8 tracking-widest">FABULOSA PLAY</h1>
      <p className="text-white mb-10 text-xl text-center">Bienvenido a la nueva era de PSC INFORMA</p>
      
      {/* Esta es tu Card de Notificaciones */}
      <NotificationCard />
      
    </main>
  );
}
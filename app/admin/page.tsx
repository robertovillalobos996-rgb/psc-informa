// Añade esto justo antes de cerrar el </nav>
<button 
  onClick={() => { localStorage.removeItem('admin_session'); window.location.href='/login'; }}
  className="p-4 hover:bg-red-900 text-red-500 rounded-2xl transition-all flex items-center gap-3 font-bold mt-10 border border-red-900/30"
>
  🚪 Cerrar Sesión
</button>
import { Dumbbell, Utensils, TrendingUp, User } from 'lucide-react';

export function MainLayout({ children, title, currentTab, onTabChange }) {
  return (
    // 1. Contenedor Maestro: Fondo negro completo para pantallas de PC
    <div className="min-h-screen bg-[#020202] flex justify-center w-full font-sans text-white">
      
      
      <div className="w-full max-w-md bg-background min-h-screen shadow-2xl relative flex flex-col overflow-hidden border-x border-zinc-900/30">

        {/* HEADER */}
        <header className="p-6 pt-10 pb-4 flex justify-between items-center sticky top-0 bg-background/90 backdrop-blur-md z-30">
          <h1 className="text-2xl font-black italic text-white uppercase tracking-wider">
            {title}
          </h1>
        </header>

        {/* CONTENIDO PRINCIPAL */}
        <main className="flex-1 overflow-y-auto px-6 pb-28 custom-scrollbar">
          {children}
        </main>

        {/* BOTTOM NAV (Barra de pestañas) */}
        {currentTab && onTabChange && (
          <nav className="absolute bottom-0 w-full max-w-md bg-surface/95 backdrop-blur-lg border-t border-zinc-900 px-8 py-5 flex justify-between items-center z-40">
            <button 
              onClick={() => onTabChange('dashboard')} 
              className={`transition-colors ${currentTab === 'dashboard' ? 'text-primary scale-110' : 'text-zinc-600 hover:text-zinc-400'}`}
            >
              <Dumbbell size={24} strokeWidth={currentTab === 'dashboard' ? 3 : 2} />
            </button>
            <button 
              onClick={() => onTabChange('nutrition')} 
              className={`transition-colors ${currentTab === 'nutrition' ? 'text-primary scale-110' : 'text-zinc-600 hover:text-zinc-400'}`}
            >
              <Utensils size={24} strokeWidth={currentTab === 'nutrition' ? 3 : 2} />
            </button>
            <button 
              onClick={() => onTabChange('progress')} 
              className={`transition-colors ${currentTab === 'progress' ? 'text-primary scale-110' : 'text-zinc-600 hover:text-zinc-400'}`}
            >
              <TrendingUp size={24} strokeWidth={currentTab === 'progress' ? 3 : 2} />
            </button>
            <button 
              onClick={() => onTabChange('profile')} 
              className={`transition-colors ${currentTab === 'profile' ? 'text-primary scale-110' : 'text-zinc-600 hover:text-zinc-400'}`}
            >
              <User size={24} strokeWidth={currentTab === 'profile' ? 3 : 2} />
            </button>
          </nav>
        )}
      </div>
    </div>
  );
}
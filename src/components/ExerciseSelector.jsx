import { useState } from 'react';
import { MainLayout } from '../layouts/MainLayout'; 
import { SecureImage } from './SecureImage';

export function ExerciseSelector({ exercises, loading, onSelect, onBack }) {
  const [searchTerm, setSearchTerm] = useState('');

  // 1. MEJORA DEL BUSCADOR: Busca por Nombre o por Músculo
  const filteredExercises = (exercises || []).filter(ex => {
    const term = searchTerm.toLowerCase();
    const matchName = ex.nombre.toLowerCase().includes(term);
    const matchMuscle = ex.grupo_muscular.toLowerCase().includes(term);
    return matchName || matchMuscle; // Si coincide con cualquiera de los dos, lo muestra
  });

  return (
    <MainLayout title="Ejercicios">
      <div className="flex flex-col h-[80vh] mt-2 animate-in fade-in slide-in-from-bottom-4 duration-300">
        
        {/* Header Sticky con Buscador */}
        <div className="sticky top-0 bg-background/95 backdrop-blur-md z-20 pb-4 space-y-4 pt-2">
          <button 
            onClick={onBack} 
            className="text-zinc-500 font-black text-[12px] tracking-widest uppercase hover:text-primary transition-colors flex items-center gap-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-left-icon lucide-arrow-left"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
             VOLVER AL ENTRENAMIENTO
          </button>
          
          <div className="relative">
            <input 
              type="text" 
              placeholder="Buscar por nombre o músculo (ej. abs, lats)" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-surface border border-zinc-800 p-4 pl-5 rounded-2xl text-white font-medium focus:border-primary outline-none transition-all placeholder:text-zinc-600 shadow-[0_0_15px_rgba(168,85,247,0.05)] focus:shadow-[0_0_20px_rgba(168,85,247,0.2)]"
            />
            <span className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-500 font-bold"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-search-icon lucide-search"><path d="m21 21-4.34-4.34"/><circle cx="11" cy="11" r="8"/></svg></span>
          </div>
        </div>
        
        {/* Lista de ejercicios */}
        <div className="flex-1 overflow-y-auto pb-20 pr-2 mt-2 space-y-3 custom-scrollbar">
          {loading ? (
            <div className="text-center text-primary animate-pulse py-10 font-bold uppercase text-xs tracking-widest">
              Cargando base de datos...
            </div>
          ) : filteredExercises.length === 0 ? (
            <div className="text-center text-zinc-600 py-10 italic">
              No se encontraron ejercicios con "{searchTerm}".
            </div>
          ) : (
            filteredExercises.map((ex) => (
              <button 
                key={ex.id}
                onClick={() => onSelect(ex)}
                className="w-full bg-surface border border-zinc-900 p-4 rounded-2xl flex justify-between items-center text-left hover:border-primary/50 transition-all active:scale-95 group"
              >
                <div className="flex items-center gap-4 flex-1 pr-4 overflow-hidden">
                  
                  {/* 2. IMAGEN DEL EJERCICIO (Ahora usando la etiqueta <img> normal) */}
                  <div className="w-14 h-14 shrink-0 bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden flex items-center justify-center">
                    {ex.imagen ? (
                      <img 
                        src={ex.imagen} 
                        alt={ex.nombre}
                        className="w-full h-full object-cover mix-blend-screen opacity-80 group-hover:opacity-100 transition-opacity"
                        loading="lazy" 
                      />
                    ) : (
                      <span className="text-zinc-700 font-bold text-xs">N/A</span>
                    )}
                  </div>

                  {/* Textos */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-black italic text-lg text-white uppercase group-hover:text-primary transition-colors truncate">
                      {ex.nombre}
                    </h3>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-0.5">
                      {ex.grupo_muscular}
                    </p>
                  </div>
                </div>

                <div className="w-8 h-8 shrink-0 rounded-full bg-zinc-900 flex items-center justify-center border border-zinc-800 group-hover:border-primary transition-colors">
                  <span className="text-primary font-bold text-lg">+</span>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </MainLayout>
  );
}
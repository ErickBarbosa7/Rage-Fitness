import { useState } from 'react';

export function ExerciseSelector({ exercises, loading, onSelect, onBack }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredExercises = (exercises || []).filter(ex => 
    ex.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col h-[80vh] mt-2 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="sticky top-0 bg-background/95 backdrop-blur-md z-20 pb-4 space-y-4 pt-2">
        <button 
          onClick={onBack} 
          className="text-zinc-500 font-black text-[10px] tracking-widest uppercase hover:text-primary transition-colors flex items-center gap-1"
        >
           VOLVER AL ENTRENAMIENTO
        </button>
        
        <div className="relative">
          <input 
            type="text" 
            placeholder="Buscar ejercicio..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-surface border border-zinc-800 p-4 pl-5 rounded-2xl text-white font-medium focus:border-primary outline-none transition-all placeholder:text-zinc-600 shadow-[0_0_15px_rgba(168,85,247,0.05)] focus:shadow-[0_0_20px_rgba(168,85,247,0.2)]"
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto pb-20 pr-2 mt-2 space-y-3 custom-scrollbar">
        {loading ? (
          <div className="text-center text-primary animate-pulse py-10 font-bold uppercase text-xs tracking-widest">
            Cargando base de datos...
          </div>
        ) : filteredExercises.map((ex) => (
          <button 
            key={ex.id}
            onClick={() => onSelect(ex)}
            className="w-full bg-surface border border-zinc-900 p-5 rounded-2xl flex justify-between items-center text-left hover:border-primary/50 transition-all active:scale-95 group"
          >
            <div className="pr-4">
              <h3 className="font-black italic text-lg text-white uppercase group-hover:text-primary transition-colors line-clamp-1">{ex.nombre}</h3>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{ex.grupo_muscular}</p>
            </div>
            <div className="w-8 h-8 shrink-0 rounded-full bg-zinc-900 flex items-center justify-center border border-zinc-800 group-hover:border-primary transition-colors">
              <span className="text-primary font-bold text-lg">+</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
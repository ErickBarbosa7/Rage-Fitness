import { useState, useEffect, useMemo } from 'react';
import { exerciseService } from '../features/exercises/exerciseService';
import { Button } from './Button';
import { Plus, CheckCircle2, Timer, Dumbbell } from 'lucide-react';
import rageLogo from '../assets/rage.png';

export function ActiveWorkout({ session, onAddExercise, onFinish }) {
  const [logs, setLogs] = useState([]);
  const [seconds, setSeconds] = useState(0);
  const [showModal, setShowModal] = useState(false); 

  // --- CRONÓMETRO ---
  useEffect(() => {
    if (!session) return;
    const startTime = session.localStartTime || new Date(session.created_at).getTime();
    
    const updateTimer = () => {
      const now = Date.now();
      let diff = Math.floor((now - startTime) / 1000);
      if (diff < 0) diff = 0; 
      setSeconds(isNaN(diff) ? 0 : diff);
    };

    updateTimer(); 
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [session]);

  // --- CARGA DE DATOS ---
  useEffect(() => {
    let ignore = false;
    async function loadLogs() {
      try {
        const data = await exerciseService.getSessionLogs(session.id);
        if (!ignore) setLogs(data || []);
      } catch (error) {
        console.error("Error al cargar tus series:", error.message);
      }
    }
    loadLogs();
    return () => { ignore = true; };
  }, [session.id]);

  // --- MAGIA DE INGENIERO: AGRUPAR SERIES ---
  // Usamos useMemo para que solo se recalcule cuando 'logs' cambie
  const groupedExercises = useMemo(() => {
    const grupos = logs.reduce((acumulador, log) => {
      // Identificamos el nombre real del ejercicio
      const nombre = log.ejercicios?.nombre || log.nombre_ejercicio_api || 'Ejercicio';
      
      // Si el ejercicio no existe en nuestro acumulador, lo creamos
      if (!acumulador[nombre]) {
        acumulador[nombre] = {
          id: log.id, // Usamos el ID de la primera serie como llave única
          nombre: nombre,
          totalSeries: 0,
          totalReps: 0,
          maxLastre: 0
        };
      }
      
      // Sumamos los datos de esta serie al grupo
      acumulador[nombre].totalSeries += 1;
      acumulador[nombre].totalReps += log.reps;
      
      // Si el peso de esta serie es mayor al que teníamos, lo actualizamos (Récord)
      if ((log.lastre_kg || 0) > acumulador[nombre].maxLastre) {
        acumulador[nombre].maxLastre = log.lastre_kg;
      }
      
      return acumulador;
    }, {});

    // Convertimos el objeto en un array para poder hacerle .map() en el HTML
    return Object.values(grupos);
  }, [logs]);

  // --- FORMATO DE TIEMPO ---
  const formatTime = (totalSeconds) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hrs > 0 ? hrs + ':' : ''}${mins < 10 ? '0' + mins : mins}:${secs < 10 ? '0' + secs : secs}`;
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      
      {/* Header: Cronómetro */}
      <div className="bg-surface p-6 rounded-3xl border border-zinc-900 shadow-[0_0_30px_rgba(168,85,247,0.1)] flex justify-between items-start">
        <div className="space-y-1">
          <h2 className="text-zinc-500 text-[12px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
            <Timer size={16} className="text-primary" /> Session Timer
          </h2>
          <p className="text-5xl font-black italic text-white tracking-tighter">
            {formatTime(seconds)}
          </p>
        </div>
        <div className="flex flex-col items-end">
          <span className="flex items-center gap-2 text-primary text-[11px] font-black uppercase tracking-widest animate-pulse">
            <span className="w-3 h-3 bg-primary rounded-full shadow-[0_0_8px_#a855f7]" /> 
            MODO RAGE
          </span>
        </div>
      </div>

      {/* Lista de Ejercicios Agrupados */}
      <div className="space-y-4">
        <div className="flex justify-between items-center px-2">
          <h3 className="text-zinc-600 text-[12px] font-black uppercase tracking-widest">
            Resumen de Entrenamiento
          </h3>
          <span className="text-[10px] bg-zinc-900 text-zinc-400 px-2 py-1 rounded-md font-bold">
            {groupedExercises.length} EJERCICIOS
          </span>
        </div>
        
        <div className="space-y-3">
          {groupedExercises.length === 0 ? (
            <div className="bg-surface/50 border-2 border-dashed border-zinc-900 rounded-2xl p-10 text-center">
              <p className="text-zinc-600 italic text-sm mb-2">Sin registros aún.</p>
              <p className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold">Toca "Añadir Ejercicio" para empezar</p>
            </div>
          ) : (
            groupedExercises.map((grupo) => (
              <div key={grupo.id} className="bg-surface p-5 rounded-2xl border border-zinc-800 flex justify-between items-center group hover:border-primary/50 transition-all duration-300 relative overflow-hidden">
                {/* Pequeño destello de fondo */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                
                <div className="flex items-center gap-4 relative z-10">
                  <div className="w-12 h-12 shrink-0 bg-zinc-900 rounded-xl flex flex-col items-center justify-center border border-zinc-800 group-hover:border-primary transition-colors">
                    <span className="text-primary font-black text-lg leading-none">{grupo.totalSeries}</span>
                    <span className="text-[8px] text-zinc-500 uppercase font-bold tracking-wider">Series</span>
                  </div>
                  
                  <div>
                    <p className="font-black italic text-white uppercase text-lg leading-tight group-hover:text-primary transition-colors line-clamp-1">
                      {grupo.nombre}
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                      <p className="text-xs text-zinc-400 font-medium flex items-center gap-1">
                        <CheckCircle2 size={12} className="text-zinc-500" />
                        <span className="text-zinc-200 font-bold">{grupo.totalReps}</span> reps totales
                      </p>
                      {grupo.maxLastre > 0 && (
                        <p className="text-xs text-zinc-400 font-medium flex items-center gap-1 border-l border-zinc-800 pl-3">
                          <Dumbbell size={12} className="text-primary" />
                          Top: <span className="text-primary font-bold">{grupo.maxLastre}kg</span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Acciones (Añadir y Finalizar) */}
      <div className="grid grid-cols-1 gap-3 sticky bottom-4 pt-4 bg-gradient-to-t from-background via-background to-transparent pb-4 z-10">
        <Button 
          variant="outline" 
          onClick={onAddExercise} 
          className="flex items-center justify-center gap-3 py-8 border-zinc-800 text-zinc-400 hover:border-primary hover:text-primary group transition-all bg-surface/80 backdrop-blur-md"
        >
          <Plus size={24} className="group-hover:scale-110 transition-transform" />
          <span className="font-black uppercase tracking-widest text-sm">Añadir Ejercicio</span>
        </Button>
        
        <Button 
          onClick={() => setShowModal(true)}
          className="bg-primary text-white font-black italic uppercase py-6 shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:scale-[1.02] transition-all"
        >
          Finalizar Sesión
        </Button>
      </div>

      {/* MODAL GIGANTE Y CENTRADO */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md px-6">
            <div className="bg-surface border border-primary p-8 rounded-[2.5rem] shadow-[0_0_50px_rgba(168,85,247,0.3)] animate-in zoom-in-95 duration-200 relative overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-primary blur-sm"></div>
              
              <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center border border-primary mx-auto mb-6 shadow-[0_0_20px_rgba(168,85,247,0.2)] overflow-hidden">
                <img 
                  src={rageLogo} 
                  alt="Rage Logo" 
                  className="w-full h-full object-contain " 
                />
              </div>
              
              <h3 className="text-3xl font-black italic text-white uppercase text-center mb-2">
                ¿Terminar Sesión?
              </h3>
              
              <p className="text-zinc-400 text-center text-xs font-bold uppercase tracking-widest mb-10 px-4">
                Asegúrate de haber registrado todas tus series de hoy.
              </p>

              <div className="flex flex-col gap-4">
                <Button 
                  onClick={() => {
                    setShowModal(false);
                    onFinish(); 
                  }} 
                  className="w-full bg-primary text-white font-black italic uppercase py-6 text-xl shadow-[0_0_20px_rgba(168,85,247,0.3)]"
                >
                  Sí, Finalizar
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={() => setShowModal(false)}
                  className="w-full border-zinc-800 text-zinc-500 py-5 uppercase font-bold text-xs tracking-widest hover:text-white"
                >
                  Seguir Entrenando
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
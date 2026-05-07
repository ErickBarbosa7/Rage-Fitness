import { useState, useEffect } from 'react';
import { exerciseService } from '../features/exercises/exerciseService';
import { Button } from './Button';
import { Plus, CheckCircle2, Timer,  } from 'lucide-react';
import { toast } from 'sonner';

export function ActiveWorkout({ session, onAddExercise, onFinish }) {
  const [logs, setLogs] = useState([]);
  const [seconds, setSeconds] = useState(0);

  // 1. Cronómetro de la Sesión
  useEffect(() => {
  // Verificación de seguridad para evitar el NaN
  if (!session?.created_at) return;

  const startTime = new Date(session.created_at).getTime();
  
  const updateTimer = () => {
    const now = new Date().getTime();
    const diff = Math.floor((now - startTime) / 1000);
    // Si el cálculo falla, por defecto ponemos 0
    setSeconds(isNaN(diff) ? 0 : diff);
  };

  updateTimer();
  const interval = setInterval(updateTimer, 1000);
  return () => clearInterval(interval);
}, [session]);

  // 2. Carga de datos con manejo de errores y Toast
  useEffect(() => {
    let ignore = false;
    async function loadLogs() {
      try {
        const data = await exerciseService.getSessionLogs(session.id);
        if (!ignore) setLogs(data);
      } catch (error) {
        toast.error("Error al sincronizar datos: " + error.message);
      }
    }
    loadLogs();
    return () => { ignore = true; };
  }, [session.id]);

  const formatTime = (totalSeconds) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hrs > 0 ? hrs + ':' : ''}${mins < 10 ? '0' + mins : mins}:${secs < 10 ? '0' + secs : secs}`;
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header con el nuevo color Primary (Morado) */}
      <div className="bg-surface p-6 rounded-3xl border border-zinc-900 shadow-[0_0_30px_rgba(168,85,247,0.1)] flex justify-between items-start">
        <div className="space-y-1">
          <h2 className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
            <Timer size={12} className="text-primary" /> Session Timer
          </h2>
          <p className="text-5xl font-black italic text-white tracking-tighter">
            {formatTime(seconds)}
          </p>
        </div>
        <div className="flex flex-col items-end">
          <span className="flex items-center gap-2 text-primary text-[10px] font-black uppercase tracking-widest animate-pulse">
            <span className="w-2 h-2 bg-primary rounded-full shadow-[0_0_8px_#a855f7]" /> 
            Active Mode
          </span>
        </div>
      </div>

      {/* Lista de Logs */}
      <div className="space-y-4">
        <div className="flex justify-between items-center px-2">
          <h3 className="text-zinc-600 text-[10px] font-black uppercase tracking-widest">
            Ejercicios Completados
          </h3>
          <span className="text-[10px] bg-zinc-900 text-zinc-400 px-2 py-1 rounded-md font-bold">
            {logs.length} SERIES
          </span>
        </div>
        
        <div className="space-y-3">
          {logs.length === 0 ? (
            <div className="bg-surface/50 border-2 border-dashed border-zinc-900 rounded-2xl p-10 text-center">
              <p className="text-zinc-600 italic text-sm">Sin registros aún.</p>
            </div>
          ) : (
            logs.map((log) => (
              <div 
                key={log.id} 
                className="bg-surface p-5 rounded-2xl border border-zinc-800 flex justify-between items-center group hover:border-primary/50 transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-zinc-900 rounded-full flex items-center justify-center border border-zinc-800 group-hover:border-primary transition-colors">
                    <CheckCircle2 size={18} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-black italic text-white uppercase text-lg leading-tight group-hover:text-primary transition-colors">
                      {log.ejercicios?.nombre || 'Ejercicio'}
                    </p>
                    <p className="text-xs text-zinc-500 font-medium">
                      <span className="text-zinc-200">{log.reps}</span> reps — <span className="text-zinc-200">{log.lastre_kg}kg</span>
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Footer Actions con Primary Purple */}
      <div className="grid grid-cols-1 gap-3 sticky bottom-4">
        <Button 
          variant="outline" 
          onClick={onAddExercise} 
          className="flex items-center justify-center gap-3 py-8 border-zinc-800 text-zinc-400 hover:border-primary hover:text-primary group transition-all"
        >
          <Plus size={24} className="group-hover:scale-110 transition-transform" />
          <span className="font-black uppercase tracking-widest text-sm">Añadir Ejercicio</span>
        </Button>
        
        <Button 
          onClick={() => {
            toast('¿Terminar el entrenamiento?', {
              description: 'Asegúrate de haber registrado todas tus series.',
              action: {
                label: 'Finalizar',
                onClick: () => onFinish() // Llama a la función principal
              },
              cancel: {
                label: 'Cancelar',
              },
              style: {
                background: '#18181b', // zinc-900
                border: '1px solid #a855f7', // primary border
              }
            });
          }} 
          className="bg-primary text-white font-black italic uppercase py-6 shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:scale-[1.02] transition-all"
        >
          Finalizar Sesión
        </Button>
      </div>
    </div>
  );
}
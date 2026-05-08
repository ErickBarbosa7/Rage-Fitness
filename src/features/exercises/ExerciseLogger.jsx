import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { ArrowLeft, History } from 'lucide-react';
import { exerciseService } from './exerciseService'; // Ajusta la ruta si es necesario

// Asumo que tienes un componente Button genérico, si no lo tienes, puedes usar un <button> normal de HTML
import { Button } from '../../components/Button'; 

export function ExerciseLogger({ exercise, sessionId, onBack }) {
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');
  const [loading, setLoading] = useState(false);
  
  // === NUEVOS ESTADOS PARA EL HISTORIAL ===
  const [historyLogs, setHistoryLogs] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  // Cargar las series previas de este ejercicio al abrir la pantalla
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const allLogs = await exerciseService.getSessionLogs(sessionId);
        // Filtramos para que solo muestre las series del ejercicio actual
        const thisExerciseLogs = allLogs.filter(log => log.nombre_ejercicio_api === exercise.nombre);
        setHistoryLogs(thisExerciseLogs);
      } catch (error) {
        console.error('Error cargando historial:', error);
      } finally {
        setLoadingHistory(false);
      }
    };

    if (sessionId) {
      fetchLogs();
    }
  }, [sessionId, exercise.nombre]);

  const handleSave = async () => {
    if (!reps) {
      toast.error('Faltan datos', { description: 'Ingresa al menos las repeticiones.' });
      return;
    }

    setLoading(true);
    try {
      // 1. Guardar en Mongo a través de tu API
      const newLog = await exerciseService.logSet(exercise, reps, weight, sessionId);
      
      // 2. Adaptar el nombre para la interfaz gráfica
      const logAdaptado = {
        ...newLog,
        nombre_ejercicio_api: newLog.ejercicio_nombre
      };
      
      // 3. Añadir la nueva serie al inicio de la lista visual (sin necesidad de recargar la página)
      setHistoryLogs(prev => [logAdaptado, ...prev]); 

      toast.success('Serie Registrada ⚡', { description: `${reps} reps guardadas.` });
      
      // 4. Limpiar solo las reps para la siguiente serie (el peso suele ser el mismo, así que se lo dejamos)
      setReps('');
    } catch (error) {
      toast.error('Error', { description: 'No se pudo guardar la serie.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full animate-in slide-in-from-right-4 duration-300">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="p-2 bg-surface rounded-xl border border-zinc-800 text-zinc-400 hover:text-white transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white">
            {exercise.nombre}
          </h2>
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">
            {exercise.musculo_objetivo || 'Registro de Serie'}
          </p>
        </div>
      </div>

      {/* Formulario de Registro */}
      <div className="bg-surface border border-zinc-800 rounded-3xl p-6 mb-8 shadow-xl">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-[10px] text-zinc-500 uppercase font-bold tracking-widest mb-2">Reps</label>
            <input 
              type="number" 
              value={reps}
              onChange={(e) => setReps(e.target.value)}
              className="w-full bg-[#0f0a1a] border border-zinc-800 p-4 rounded-2xl text-white text-center text-2xl font-black focus:border-primary outline-none transition-all placeholder:text-zinc-700"
              placeholder="0"
            />
          </div>
          <div>
            <label className="block text-[10px] text-zinc-500 uppercase font-bold tracking-widest mb-2">Peso (KG) - Opcional</label>
            <input 
              type="number" 
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full bg-[#0f0a1a] border border-zinc-800 p-4 rounded-2xl text-white text-center text-2xl font-black focus:border-primary outline-none transition-all placeholder:text-zinc-700"
              placeholder="0"
            />
          </div>
        </div>

        <Button 
          onClick={handleSave} 
          disabled={loading}
          className="w-full bg-primary text-white font-black italic uppercase py-5 rounded-2xl shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:scale-[1.02] transition-all disabled:opacity-50"
        >
          {loading ? 'Guardando...' : 'Registrar Serie'}
        </Button>
      </div>

      {/* === NUEVA SECCIÓN: HISTORIAL DE SERIES === */}
      <div className="flex-1 pb-20">
        <div className="flex items-center gap-2 mb-4">
          <History size={16} className="text-primary" />
          <h3 className="text-xs text-zinc-500 uppercase font-bold tracking-widest">Tus Series</h3>
        </div>

        {loadingHistory ? (
          <p className="text-zinc-600 text-sm italic text-center py-4">Cargando series...</p>
        ) : historyLogs.length === 0 ? (
          <div className="bg-surface/50 border border-zinc-800/50 rounded-2xl p-6 text-center border-dashed">
            <p className="text-zinc-600 text-sm italic">Aún no hay series. ¡Rompe el hielo!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Mapeamos el array para renderizar cada cajita */}
            {historyLogs.map((log, index) => (
              <div key={log.id || index} className="flex justify-between items-center bg-surface border border-zinc-800 rounded-2xl p-4 animate-in fade-in zoom-in duration-300">
                <div className="flex items-center gap-4">
                  {/* Círculo con el número de serie */}
                  <div className="w-8 h-8 rounded-full bg-zinc-900 border border-primary/30 flex items-center justify-center">
                    {/* El backend nos manda la lista al revés (más nuevas primero), así que calculamos el número real */}
                    <span className="text-primary font-bold text-xs">{historyLogs.length - index}</span>
                  </div>
                  <span className="text-white font-bold">{log.reps} Reps</span>
                </div>
                <div className="text-zinc-500 font-medium text-sm">
                  {log.lastre_kg > 0 ? `+${log.lastre_kg} kg` : 'Corporal'}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
import { useState } from 'react'
import { exerciseService } from './exerciseService'
import { Button } from '../../components/Button'
import { ChevronLeft, Zap } from 'lucide-react'
import { toast } from 'sonner'

export function ExerciseLogger({ exercise, sessionId, onBack }) {
  const [reps, setReps] = useState('')
  const [weight, setWeight] = useState('0')
  const [sending, setSending] = useState(false)

  const handleSubmit = async () => {
    if (!reps || reps <= 0) {
      return toast.error("¡Pon las reps, Guerrero!")
    }
    
    try {
      setSending(true)
      // Agregamos sessionId para que Supabase sepa a qué entrenamiento pertenece
      await exerciseService.logSet(exercise.id, reps, weight, sessionId)
      
      toast.success(`${exercise.nombre} registrado`, {
        description: `${reps} reps con ${weight}kg. ¡Sigue así!`,
        icon: <Zap size={16} className="text-primary" />
      })
      
      setReps('') // Limpiamos para la siguiente serie
    } catch (err) {
      toast.error("Error: " + err.message)
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      {/* Botón Volver con hover morado */}
      <button 
        onClick={onBack} 
        className="flex items-center text-zinc-500 gap-2 hover:text-primary transition-colors font-bold uppercase text-xs tracking-widest"
      >
        <ChevronLeft size={20} /> Volver al entrenamiento
      </button>

      {/* Header del Ejercicio */}
      <div className="relative">
        <div className="absolute -left-4 top-0 w-1 h-full bg-primary shadow-[0_0_15px_#a855f7]" />
        <h2 className="text-4xl font-black italic uppercase text-white leading-none">
          {exercise.nombre}
        </h2>
        <p className="text-primary font-bold text-xs uppercase tracking-widest mt-1 opacity-80">
          {exercise.grupo_muscular}
        </p>
      </div>

      <div className="grid gap-8 bg-surface/30 p-6 rounded-3xl border border-zinc-900">
        {/* Input de Repeticiones */}
        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase text-zinc-500 tracking-[0.2em]">
            Repeticiones
          </label>
          <input 
            type="number"
            inputMode="numeric"
            placeholder="0"
            value={reps}
            onChange={(e) => setReps(e.target.value)}
            className="w-full bg-transparent border-b-4 border-zinc-800 text-6xl font-black text-white focus:border-primary outline-none transition-all placeholder:text-zinc-900"
          />
        </div>

        {/* Input de Peso */}
        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase text-zinc-500 tracking-[0.2em]">
            Peso / Lastre (kg)
          </label>
          <input 
            type="number"
            inputMode="decimal"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="w-full bg-transparent border-b-4 border-zinc-800 text-6xl font-black text-white focus:border-secondary outline-none transition-all"
          />
        </div>

        <Button 
          onClick={handleSubmit} 
          disabled={sending}
          className="py-8 text-xl shadow-[0_10px_30px_rgba(168,85,247,0.2)]"
        >
          {sending ? 'Sincronizando...' : 'REGISTRAR SERIE'}
        </Button>
      </div>
    </div>
  )
}
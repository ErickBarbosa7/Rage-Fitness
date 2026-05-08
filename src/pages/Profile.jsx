import { Button } from '../components/Button'
import { User, LogOut, Settings, Award } from 'lucide-react'

// Recibimos la función 'onLogout' que ya programamos en App.jsx
export function Profile({ user, onLogout }) {
  
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header de Perfil */}
      <div className="flex flex-col items-center text-center space-y-4">
        {/* Actualicé el color de la sombra para que sea el morado de Rage en lugar del rojo anterior */}
        <div className="w-24 h-24 bg-surface border-2 border-primary rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.2)]">
          <User size={48} className="text-primary" />
        </div>
        <div>
          {/* Ahora mostramos el nombre de usuario real de MongoDB */}
          <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">
            {user?.username || 'Guerrero'}
          </h2>
          <p className="text-zinc-500 text-sm font-medium mt-1">{user?.email}</p>
        </div>
      </div>

      {/* Stats Rápidas */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-surface p-4 rounded-2xl border border-zinc-900 flex flex-col items-center">
          <Award className="text-primary mb-2" size={20} />
          <p className="text-[10px] text-zinc-500 uppercase font-bold">Nivel</p>
          {/* Ahora leemos el rango real desde tu base de datos */}
          <p className="font-black italic text-lg text-white uppercase">
            {user?.rango || 'NOVATO'}
          </p>
        </div>
        <div className="bg-surface p-4 rounded-2xl border border-zinc-900 flex flex-col items-center opacity-50">
          <Settings className="text-zinc-500 mb-2" size={20} />
          <p className="text-[10px] text-zinc-500 uppercase font-bold">Ajustes</p>
          <p className="font-black italic text-lg text-white">PRÓXIMAMENTE</p>
        </div>
      </div>

      {/* Acción de Cierre de Sesión */}
      <div className="pt-8">
        <Button 
          variant="outline" 
          onClick={onLogout} // Llamamos directamente a la prop
          className="w-full flex items-center justify-center gap-3 border-zinc-900 text-zinc-500 hover:border-primary hover:text-primary transition-all py-6"
        >
          <LogOut size={18} />
          <span className="font-bold uppercase tracking-widest text-xs">Cerrar Sesión</span>
        </Button>
      </div>
    </div>
  )
}
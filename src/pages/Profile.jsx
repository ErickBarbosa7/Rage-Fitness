import { supabase } from '../services/supabase'
import { Button } from '../components/Button'
import { toast } from 'sonner'
import { User, LogOut, Settings, Award } from 'lucide-react'

export function Profile({ user }) {
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      toast.error('Error al cerrar sesión')
    } else {
      toast.success('Sesión cerrada. Vuelve pronto :)!')
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header de Perfil */}
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="w-24 h-24 bg-surface border-2 border-primary rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(225,29,72,0.2)]">
          <User size={48} className="text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-black italic uppercase tracking-tighter">Mi Perfil</h2>
          <p className="text-zinc-500 text-sm font-medium">{user.email}</p>
        </div>
      </div>

      {/* Stats Rápidas (Placeholders para tu lógica futura) */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-surface p-4 rounded-2xl border border-zinc-900 flex flex-col items-center">
          <Award className="text-primary mb-2" size={20} />
          <p className="text-[10px] text-zinc-500 uppercase font-bold">Nivel</p>
          <p className="font-black italic text-lg text-white">GUERRERO</p>
        </div>
        <div className="bg-surface p-4 rounded-2xl border border-zinc-900 flex flex-col items-center">
          <Settings className="text-zinc-500 mb-2" size={20} />
          <p className="text-[10px] text-zinc-500 uppercase font-bold">Ajustes</p>
          <p className="font-black italic text-lg text-white">CONFIG</p>
        </div>
      </div>

      {/* Acción de Cierre de Sesión */}
      <div className="pt-8">
        <Button 
          variant="outline" 
          onClick={handleLogout}
          className="flex items-center justify-center gap-3 border-zinc-900 text-zinc-500 hover:border-primary hover:text-primary transition-all"
        >
          <LogOut size={18} />
          Cerrar Sesión
        </Button>
      </div>
    </div>
  )
}
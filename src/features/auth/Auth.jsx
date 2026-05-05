import { useState } from 'react'
import { supabase } from '../../services/supabase'
import { Button } from '../../components/Button'
import { toast } from 'sonner'

export function Auth() {
  const [loading, setLoading] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validación de seguridad básica en el cliente
    if (!email || password.length < 6) {
      return toast.error('La contraseña debe tener al menos 6 caracteres')
    }

    setLoading(true)

    try {
      if (isRegistering) {
        // Lógica de Registro
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        toast.success('¡Cuenta creada! Ya puedes iniciar sesión.')
        setIsRegistering(false) // Regresar al modo login tras éxito
      } else {
        // Lógica de Login
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        toast.success('Bienvenido a RAGE')
      }
    } catch (error) {
      // Manejo de errores de Supabase (ej. credenciales inválidas o 422)
      toast.error(error.message || 'Ocurrió un error en la autenticación')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 animate-in fade-in duration-700">
      <div className="w-full max-w-sm space-y-10">
        
        {/* Cabecera Rage */}
        <div className="text-center">
          <h1 className="text-7xl font-black italic text-primary tracking-tighter uppercase leading-none">
            RAGE
          </h1>
          <p className="text-zinc-500 uppercase text-[10px] font-black tracking-[0.3em] mt-4">
            {isRegistering ? 'Crea tu perfil de guerrero' : 'Identifícate para entrenar'}
          </p>
        </div>

        {/* Formulario de Acceso */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-3">
            <input
              type="email"
              placeholder="Email"
              required
              className="w-full bg-surface border border-zinc-900 p-4 rounded-2xl focus:border-primary outline-none text-white transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Contraseña"
              required
              className="w-full bg-surface border border-zinc-900 p-4 rounded-2xl focus:border-primary outline-none text-white transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          <Button type="submit" disabled={loading}>
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Procesando...
              </span>
            ) : (
              isRegistering ? 'Registrarme ahora' : 'Entrar'
            )}
          </Button>

          {/* Toggle de Modo (Login/Registro) */}
          <div className="text-center pt-6">
            <button 
              type="button" 
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-zinc-600 text-[10px] uppercase font-black tracking-widest hover:text-zinc-400 transition-colors"
            >
              {isRegistering 
                ? '¿Ya tienes cuenta? Inicia Sesión' 
                : '¿Eres nuevo? Crea una cuenta aquí'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
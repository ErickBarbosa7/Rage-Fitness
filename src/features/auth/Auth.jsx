import { useState } from 'react';
import { toast } from 'sonner';

export function Auth({ onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState(''); // Solo para registro
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const endpoint = isLogin ? '/auth/login' : '/auth/register';
    const payload = isLogin 
      ? { email, password } 
      : { email, password, username };

    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error de autenticación');
      }

      // ¡ÉXITO! Guardamos el token y los datos del usuario en la memoria local
      localStorage.setItem('rage_token', data.token);
      localStorage.setItem('rage_user', JSON.stringify(data.user));

      toast.success(isLogin ? '¡Bienvenido de vuelta!' : '¡Cuenta creada, Guerrero!');
      
      // Le avisamos a App.jsx que ya entramos
      if (onLoginSuccess) onLoginSuccess(data.user);

    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-[80vh] px-6 animate-in fade-in zoom-in duration-500">
      <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center border border-primary mb-8 shadow-[0_0_30px_rgba(168,85,247,0.3)]">
        <span className="text-3xl">⚡</span>
      </div>
      
      <h2 className="text-5xl font-black italic text-white uppercase tracking-tighter mb-2">
        RAGE
      </h2>
      <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs mb-10">
        {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
      </p>

      <form onSubmit={handleSubmit} className="w-full space-y-4">
        {!isLogin && (
          <input 
            type="text" 
            placeholder="Nombre de Guerrero" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full bg-surface border border-zinc-800 p-4 rounded-2xl text-white focus:border-primary outline-none transition-all placeholder:text-zinc-600"
            required
          />
        )}
        
        <input 
          type="email" 
          placeholder="Correo Electrónico" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-surface border border-zinc-800 p-4 rounded-2xl text-white focus:border-primary outline-none transition-all placeholder:text-zinc-600"
          required
        />
        
        <input 
          type="password" 
          placeholder="Contraseña" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-surface border border-zinc-800 p-4 rounded-2xl text-white focus:border-primary outline-none transition-all placeholder:text-zinc-600"
          required
        />

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-primary text-white font-black italic uppercase py-5 rounded-2xl shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:scale-[1.02] transition-all mt-4 disabled:opacity-50"
        >
          {loading ? 'Cargando...' : (isLogin ? 'ENTRAR AL RAGE MODE' : 'UNIRSE A LA BATALLA')}
        </button>
      </form>

      <button 
        onClick={() => setIsLogin(!isLogin)}
        className="mt-8 text-zinc-500 font-bold text-xs uppercase tracking-widest hover:text-white transition-colors"
      >
        {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
      </button>
    </div>
  );
}
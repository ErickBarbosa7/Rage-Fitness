import { useState, useEffect } from 'react';
import { supabase } from './services/supabase';
import { Toaster, toast } from 'sonner';

// Layouts y Auth
import { MainLayout } from './layouts/MainLayout';
import { Auth } from './features/auth/Auth';

// Hooks y Servicios
import { useExercises } from './hooks/useExercises';
import { exerciseService } from './features/exercises/exerciseService';

// Componentes y Páginas
import { ActiveWorkout } from './components/ActiveWorkout';
import { ExerciseLogger } from './features/exercises/ExerciseLogger';
import { Button } from './components/Button';
import { Profile } from './pages/Profile';

export default function App() {
  // --- 1. ESTADOS DE IDENTIDAD Y SESIÓN ---
  const [session, setSession] = useState(null);
  const [currentTab, setCurrentTab] = useState('dashboard');

  // --- 2. ESTADOS DE ENTRENAMIENTO ---
  const { exercises, loading: loadingExercises } = useExercises();
  const [activeSession, setActiveSession] = useState(null);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [isSelectingExercise, setIsSelectingExercise] = useState(false);

  // --- 3. CICLO DE VIDA: AUTENTICACIÓN ---
  useEffect(() => {
    // Verificar sesión al cargar
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Escuchar cambios de Auth (Login/Logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) {
        // Limpieza al cerrar sesión
        setActiveSession(null);
        setCurrentTab('dashboard');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // --- 4. CONTROLADORES (HANDLERS) ---
  const handleStartWorkout = async () => {
    try {
      const sessionData = await exerciseService.startSession();
      setActiveSession(sessionData);
      toast.success('RAGE MODE: ACTIVADO', {
        description: 'Dale con todo, Guerrero.',
      });
    } catch (err) {
      toast.error('Error de acceso: Revisa los permisos RLS');
      console.error(err);
    }
  };

  const handleFinishWorkout = () => {
    if (window.confirm("¿Terminar el entrenamiento de hoy?")) {
      setActiveSession(null);
      setIsSelectingExercise(false);
      setSelectedExercise(null);
      toast.success('Entrenamiento finalizado y guardado');
    }
  };

  // --- 5. RENDERIZADO POR CAPAS ---

  // CAPA A: Autenticación (Si no hay sesión)
  if (!session) {
    return (
      <>
        <Toaster position="top-center" theme="dark" richColors />
        <MainLayout title="Rage">
          <Auth />
        </MainLayout>
      </>
    );
  }

  // CAPA B: Registro de Serie (Overlay sobre el entrenamiento)
  if (selectedExercise) {
    return (
      <MainLayout title="Log Set" currentTab={currentTab} onTabChange={setCurrentTab}>
        <ExerciseLogger 
          exercise={selectedExercise} 
          sessionId={activeSession?.id} // <--- Verifica que esta línea exista
          onBack={() => setSelectedExercise(null)} 
        />
      </MainLayout>
    );
  }

  // CAPA C: Selector de Ejercicios
  if (isSelectingExercise) {
    return (
      <MainLayout title="Seleccionar" currentTab={currentTab} onTabChange={setCurrentTab}>
        <div className="space-y-4 mt-4">
          <button 
            onClick={() => setIsSelectingExercise(false)} 
            className="text-zinc-500 font-black text-[10px] tracking-widest uppercase hover:text-primary transition-colors"
          >
            ← VOLVER
          </button>
          
          <div className="grid gap-3">
            {exercises.map((ex) => (
              <button 
                key={ex.id}
                onClick={() => {
                  setSelectedExercise(ex);
                  setIsSelectingExercise(false);
                }}
                className="bg-surface border border-zinc-900 p-5 rounded-2xl flex justify-between items-center text-left hover:border-primary/50 transition-all active:scale-95"
              >
                <div>
                  <h3 className="font-black italic text-lg text-white uppercase">{ex.nombre}</h3>
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{ex.grupo_muscular}</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center border border-zinc-800">
                  <span className="text-primary font-bold">+</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </MainLayout>
    );
  }

  // CAPA D: Contenido Principal (Tabs)
  const renderTabContent = () => {
    switch (currentTab) {
      case 'profile':
        return <Profile user={session.user} />;
      
      case 'nutrition':
        return (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
            <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center border border-primary/20">
              <span className="text-primary text-2xl">⚡</span>
            </div>
            <p className="text-zinc-500 font-bold uppercase text-xs tracking-widest">Módulo de Nutrición</p>
            <p className="text-zinc-700 italic text-sm">Próximamente para el nivel Guerrero...</p>
          </div>
        );

      default:
        // Lógica de Dashboard / ActiveWorkout
        if (activeSession) {
          return (
            <ActiveWorkout 
              session={activeSession}
              onAddExercise={() => setIsSelectingExercise(true)}
              onFinish={handleFinishWorkout}
            />
          );
        }
        
        return (
          <div className="space-y-8 mt-4">
            <section className="bg-surface p-8 rounded-[2.5rem] border border-zinc-900 text-center shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
              <h2 className="text-zinc-600 uppercase text-[10px] font-black tracking-[0.3em] mb-4 italic">
                Ready to bleed?
              </h2>
              <p className="text-7xl font-black italic tracking-tighter mb-10 text-white">
                RAGE <span className="text-primary shadow-primary">MODE</span>
              </p>
              <Button onClick={handleStartWorkout} className="py-8 text-xl shadow-[0_0_30px_rgba(168,85,247,0.3)]">
                Empezar Sesión
              </Button>
            </section>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-surface p-6 rounded-3xl border border-zinc-900">
                <p className="text-zinc-600 text-[10px] font-black uppercase tracking-widest mb-1">Racha</p>
                <p className="text-4xl font-black italic text-primary">0 DÍAS</p>
              </div>
              <div className="bg-surface p-6 rounded-3xl border border-zinc-900">
                <p className="text-zinc-600 text-[10px] font-black uppercase tracking-widest mb-1">Rango</p>
                <p className="text-2xl font-black italic text-white uppercase">Novato</p>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <>
      <Toaster 
        position="top-center" 
        theme="dark" 
        richColors 
        toastOptions={{
          style: { background: '#0f0a1a', border: '1px solid #27272a', color: 'white' }
        }}
      />
      <MainLayout 
        title={currentTab === 'dashboard' ? 'Rage' : currentTab} 
        currentTab={currentTab} 
        onTabChange={setCurrentTab}
      >
        {renderTabContent()}
      </MainLayout>
    </>
  );
}
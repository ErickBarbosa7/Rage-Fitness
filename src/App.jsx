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
  const [searchTerm, setSearchTerm] = useState(''); // Estado para el buscador móvil

  // --- 3. CICLO DE VIDA: AUTENTICACIÓN ---
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) {
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
    // Ya no usamos window.confirm aquí, se maneja desde el Toast en ActiveWorkout
    setActiveSession(null);
    setIsSelectingExercise(false);
    setSelectedExercise(null);
    toast.success('Entrenamiento guardado en la base de datos.', {
      description: '¡Buen trabajo, fiera!',
    });
  };

  // --- 5. RENDERIZADO POR CAPAS ---

  // CAPA A: Autenticación
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

  // CAPA B: Registro de Serie (Logger)
  if (selectedExercise) {
    return (
      <MainLayout title="Log Set" currentTab={currentTab} onTabChange={setCurrentTab}>
        <ExerciseLogger 
          exercise={selectedExercise} 
          sessionId={activeSession?.id} 
          onBack={() => setSelectedExercise(null)} 
        />
      </MainLayout>
    );
  }

  // CAPA C: Selector de Ejercicios (Optimizado para Celular)
  if (isSelectingExercise) {
    // Filtramos la lista de forma segura
    const safeExercises = exercises || [];
    const filteredExercises = safeExercises.filter(ex => 
      ex.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <MainLayout title="Ejercicios" currentTab={currentTab} onTabChange={setCurrentTab}>
        <div className="flex flex-col h-[80vh] mt-2 animate-in fade-in slide-in-from-bottom-4 duration-300">
          
          {/* Header Sticky con Buscador */}
          <div className="sticky top-0 bg-background/95 backdrop-blur-md z-20 pb-4 space-y-4 pt-2">
            <button 
              onClick={() => {
                setIsSelectingExercise(false);
                setSearchTerm('');
              }} 
              className="text-zinc-500 font-black text-[10px] tracking-widest uppercase hover:text-primary transition-colors flex items-center gap-1"
            >
              ← VOLVER AL ENTRENAMIENTO
            </button>
            
            <div className="relative">
              <input 
                type="text" 
                placeholder="Buscar ejercicio..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-surface border border-zinc-800 p-4 pl-5 rounded-2xl text-white font-medium focus:border-primary outline-none transition-all placeholder:text-zinc-600 shadow-[0_0_15px_rgba(168,85,247,0.05)] focus:shadow-[0_0_20px_rgba(168,85,247,0.2)]"
              />
              <span className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-500 font-bold">
                🔍
              </span>
            </div>
          </div>
          
          {/* Lista Scrolleable */}
          <div className="flex-1 overflow-y-auto pb-20 pr-2 mt-2 space-y-3 custom-scrollbar">
            {loadingExercises ? (
              <div className="text-center text-primary animate-pulse py-10 font-bold uppercase text-xs tracking-widest">
                Cargando base de datos...
              </div>
            ) : filteredExercises.length === 0 ? (
              <div className="text-center text-zinc-600 py-10 italic">
                {searchTerm ? 'No se encontraron resultados.' : 'Lista vacía.'}
              </div>
            ) : (
              filteredExercises.map((ex) => (
                <button 
                  key={ex.id}
                  onClick={() => {
                    setSelectedExercise(ex);
                    setIsSelectingExercise(false);
                    setSearchTerm(''); // Limpiamos al seleccionar
                  }}
                  className="w-full bg-surface border border-zinc-900 p-5 rounded-2xl flex justify-between items-center text-left hover:border-primary/50 transition-all active:scale-95 group"
                >
                  <div className="pr-4">
                    <h3 className="font-black italic text-lg text-white uppercase group-hover:text-primary transition-colors line-clamp-1">
                      {ex.nombre}
                    </h3>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                      {ex.grupo_muscular}
                    </p>
                  </div>
                  <div className="w-8 h-8 shrink-0 rounded-full bg-zinc-900 flex items-center justify-center border border-zinc-800 group-hover:border-primary transition-colors">
                    <span className="text-primary font-bold text-lg">+</span>
                  </div>
                </button>
              ))
            )}
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

      case 'progress':
        return (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
            <p className="text-zinc-500 font-bold uppercase text-xs tracking-widest">Progreso</p>
            <p className="text-zinc-700 italic text-sm">Gráficas en construcción...</p>
          </div>
        );

      default:
        // Dashboard / ActiveWorkout
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
          <div className="space-y-8 mt-4 animate-in fade-in duration-500">
            <section className="bg-surface p-8 rounded-[2.5rem] border border-zinc-900 text-center shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-primary blur-sm"></div>
              <h2 className="text-zinc-600 uppercase text-[10px] font-black tracking-[0.3em] mb-4 italic">
                Ready to bleed?
              </h2>
              <p className="text-7xl font-black italic tracking-tighter mb-10 text-white relative z-10">
                RAGE <span className="text-primary drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]">MODE</span>
              </p>
              <Button onClick={handleStartWorkout} className="py-8 text-xl shadow-[0_0_30px_rgba(168,85,247,0.3)] w-full">
                Empezar Sesión
              </Button>
            </section>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-surface p-6 rounded-3xl border border-zinc-900 flex flex-col items-center text-center">
                <p className="text-zinc-600 text-[10px] font-black uppercase tracking-widest mb-1">Racha</p>
                <p className="text-4xl font-black italic text-primary">0 DÍAS</p>
              </div>
              <div className="bg-surface p-6 rounded-3xl border border-zinc-900 flex flex-col items-center text-center">
                <p className="text-zinc-600 text-[10px] font-black uppercase tracking-widest mb-1">Rango</p>
                <p className="text-2xl font-black italic text-white uppercase mt-2">Novato</p>
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
          style: { background: '#0f0a1a', border: '1px solid #a855f7', color: 'white' }
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
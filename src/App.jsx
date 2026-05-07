// src/App.jsx
import { useState, useEffect } from 'react';
import { supabase } from './services/supabase';
import { Toaster, toast } from 'sonner';

// Layouts y Componentes Principales
import { MainLayout } from './layouts/MainLayout';
import { Auth } from './features/auth/Auth';
import { ActiveWorkout } from './components/ActiveWorkout';
import { ExerciseLogger } from './features/exercises/ExerciseLogger';
import { Profile } from './pages/Profile';

// Componentes Extraídos (¡Nuevos!)
import { DashboardTab } from './components/tabs/DashboardTab';
import { ExerciseSelector } from './components/ExerciseSelector';

// Hooks y Servicios
import { useExercises } from './hooks/useExercises';
import { exerciseService } from './features/exercises/exerciseService';

export default function App() {
  const [session, setSession] = useState(null);
  const [currentTab, setCurrentTab] = useState('dashboard');

  const { exercises, loading: loadingExercises } = useExercises();
  const [activeSession, setActiveSession] = useState(null);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [isSelectingExercise, setIsSelectingExercise] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) {
        setActiveSession(null);
        setCurrentTab('dashboard');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleStartWorkout = async () => {
    try {
      const sessionData = await exerciseService.startSession();
      setActiveSession(sessionData);
      toast.success('RAGE MODE: ACTIVADO', { description: 'Dale con todo, Guerrero.' });
    } catch (err) {
      toast.error('Error de acceso: Revisa los permisos RLS');
    }
  };

  const handleFinishWorkout = () => {
    setActiveSession(null);
    setIsSelectingExercise(false);
    setSelectedExercise(null);
    toast.success('Entrenamiento guardado.', { description: '¡Buen trabajo, fiera!' });
  };

  // --- RENDERIZADO ---
  if (!session) {
    return (
      <>
        <Toaster position="top-center" theme="dark" richColors />
        <MainLayout title="Rage"><Auth /></MainLayout>
      </>
    );
  }

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

  if (isSelectingExercise) {
    return (
      <ExerciseSelector 
        exercises={exercises}
        loading={loadingExercises}
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        onBack={() => setIsSelectingExercise(false)}
        onSelect={(ex) => {
          setSelectedExercise(ex);
          setIsSelectingExercise(false);
        }}
      />
    );
  }

  const renderTabContent = () => {
    switch (currentTab) {
      case 'profile':
        return <Profile user={session.user} />;
      case 'nutrition':
        return (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
            <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center border border-primary/20">⚡</div>
            <p className="text-zinc-500 font-bold uppercase text-xs tracking-widest">Módulo de Nutrición</p>
          </div>
        );
      case 'progress':
        return (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
            <p className="text-zinc-500 font-bold uppercase text-xs tracking-widest">Progreso</p>
          </div>
        );
      default:
        if (activeSession) {
          return <ActiveWorkout session={activeSession} onAddExercise={() => setIsSelectingExercise(true)} onFinish={handleFinishWorkout} />;
        }
        return <DashboardTab onStartWorkout={handleStartWorkout} />;
    }
  };

  return (
    <>
      <Toaster position="top-center" theme="dark" richColors toastOptions={{ style: { background: '#0f0a1a', border: '1px solid #a855f7', color: 'white' } }} />
      <MainLayout title={currentTab === 'dashboard' ? 'Rage' : currentTab} currentTab={currentTab} onTabChange={setCurrentTab}>
        {renderTabContent()}
      </MainLayout>
    </>
  );
}
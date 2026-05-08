import { useState } from 'react';
import { Toaster, toast } from 'sonner';
import { MainLayout } from './layouts/MainLayout';
import { Auth } from './features/auth/Auth';
import { Profile } from './pages/Profile';
import { DashboardTab } from './components/tabs/DashboardTab';
import { ActiveWorkout } from './components/ActiveWorkout';
import { ExerciseSelector } from './components/ExerciseSelector';
import { ExerciseLogger } from './features/exercises/ExerciseLogger';
import { useExercises } from './hooks/useExercises';
import { exerciseService } from './features/exercises/exerciseService'; 

export default function App() {
  // 1. ESTADO DE SESIÓN (Lee de localStorage al iniciar la app)
  const [session, setSession] = useState(() => {
    const savedUser = localStorage.getItem('rage_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  
  // 2. ESTADOS DE NAVEGACIÓN Y APP
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [activeSession, setActiveSession] = useState(null);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [isSelectingExercise, setIsSelectingExercise] = useState(false);

  // 3. HOOKS Y DATOS EXTERNOS
  const { exercises, loading: loadingExercises } = useExercises();

  // --- FUNCIONES DE AUTENTICACIÓN ---
  const handleLogout = () => {
    localStorage.removeItem('rage_token');
    localStorage.removeItem('rage_user');
    setSession(null);
    setCurrentTab('dashboard');
    setActiveSession(null);
    toast.info('Sesión cerrada', { description: 'Nos vemos en la próxima batalla, Guerrero.' });
  };

  // --- FUNCIONES DE ENTRENAMIENTO ---
  const handleStartWorkout = async () => {
    try {
      // 1. Creamos la sesión real en MongoDB
      const sessionData = await exerciseService.startSession();
      
      // 2. Le inyectamos el tiempo local para que el cronómetro funcione perfecto
      sessionData.localStartTime = Date.now(); 
      
      // 3. Activamos la pantalla de entrenamiento
      setActiveSession(sessionData);
      toast.success('RAGE MODE: ACTIVADO', { description: 'Sesión guardada en Mongo. Dale con todo.' });
    } catch (error) {
      toast.error('Error al iniciar', { description: 'Revisa que tu backend esté encendido.' });
    }
  };

  const handleFinishWorkout = () => {
    setActiveSession(null);
    setIsSelectingExercise(false);
    setSelectedExercise(null);
    toast.success('Entrenamiento finalizado.', { description: '¡Buen trabajo, fiera!' });
  };

  
  // --- RENDERIZADO POR CAPAS (Jerarquía visual) ---

  // CAPA 1: Si no hay usuario logueado, forzamos la pantalla de Auth
  if (!session) {
    return (
      <>
        <Toaster position="top-center" theme="dark" richColors toastOptions={{ style: { background: '#0f0a1a', border: '1px solid #a855f7', color: 'white' } }} />
        <MainLayout title="Rage">
          <Auth onLoginSuccess={(user) => setSession(user)} />
        </MainLayout>
      </>
    );
  }

  // CAPA 2: Si está registrando repeticiones/peso (Prioridad máxima en entrenamiento)
  if (selectedExercise) {
    return (
      <>
        <Toaster position="top-center" theme="dark" richColors toastOptions={{ style: { background: '#0f0a1a', border: '1px solid #a855f7', color: 'white' } }} />
        <MainLayout title="Log Set" currentTab={currentTab} onTabChange={setCurrentTab}>
          <ExerciseLogger 
            exercise={selectedExercise} 
            sessionId={activeSession?.id} 
            onBack={() => setSelectedExercise(null)} 
          />
        </MainLayout>
      </>
    );
  }

  // CAPA 3: Si está buscando un ejercicio en la lista gigante
  if (isSelectingExercise) {
    return (
      <>
        <Toaster position="top-center" theme="dark" richColors toastOptions={{ style: { background: '#0f0a1a', border: '1px solid #a855f7', color: 'white' } }} />
        <ExerciseSelector 
          exercises={exercises}
          loading={loadingExercises}
          onSelect={(ex) => {
            setSelectedExercise(ex);
            setIsSelectingExercise(false); // Cierra el buscador y pasa a Capa 2
          }}
          onBack={() => setIsSelectingExercise(false)} // Vuelve al entrenamiento
        />
      </>
    );
  }

  // CAPA 4: Renderizado dinámico de las pestañas (Bottom Navigation)
  const renderTabContent = () => {
    switch (currentTab) {
      case 'profile':
        return <Profile user={session} onLogout={handleLogout} />;
      
      case 'nutrition':
        return (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4 animate-in fade-in zoom-in duration-300">
            <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center border border-primary/20 shadow-[0_0_15px_rgba(168,85,247,0.1)]">
              <span className="text-2xl">🥩</span>
            </div>
            <p className="text-zinc-500 font-bold uppercase text-xs tracking-widest">Módulo de Nutrición</p>
            <p className="text-[10px] text-zinc-700 italic">Conectando a MongoDB próximamente...</p>
          </div>
        );
      
      case 'progress':
        return (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4 animate-in fade-in zoom-in duration-300">
            <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center border border-primary/20 shadow-[0_0_15px_rgba(168,85,247,0.1)]">
              <span className="text-2xl">📈</span>
            </div>
            <p className="text-zinc-500 font-bold uppercase text-xs tracking-widest">Estadísticas</p>
            <p className="text-[10px] text-zinc-700 italic">Analizando datos...</p>
          </div>
        );
      
      case 'dashboard':
      default:
        // Si hay una sesión activa, el dashboard cambia al modo "ActiveWorkout"
        if (activeSession) {
          return (
            <ActiveWorkout 
              session={activeSession} 
              onAddExercise={() => setIsSelectingExercise(true)} 
              onFinish={handleFinishWorkout} 
            />
          );
        }
        // Si no hay entrenamiento activo, muestra el Dashboard normal
        return <DashboardTab onStartWorkout={handleStartWorkout} user={session} />;
    }
  };

  // RENDER PRINCIPAL DE LA APP LOGUEADA
  return (
    <>
      <Toaster position="top-center" theme="dark" richColors toastOptions={{ style: { background: '#0f0a1a', border: '1px solid #a855f7', color: 'white' } }} />
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
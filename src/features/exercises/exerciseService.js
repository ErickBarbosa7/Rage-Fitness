// src/features/exercises/exerciseService.js

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Función auxiliar para inyectar el Token como "pase de seguridad" en cada petición
const getHeaders = () => {
  const token = localStorage.getItem('rage_token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

export const exerciseService = {
  
  // 1. Iniciar Entrenamiento
  async startSession() {
    const response = await fetch(`${API_URL}/workouts/session`, {
      method: 'POST',
      headers: getHeaders()
    });
    
    if (!response.ok) throw new Error('Error al iniciar la sesión');
    
    const data = await response.json();
    data.id = data._id; // Adaptamos el ID de Mongo al formato que espera React
    return data;
  },

  // 2. Finalizar Entrenamiento
  async finishSession(sessionId) {
    const response = await fetch(`${API_URL}/workouts/session/${sessionId}/finish`, {
      method: 'PUT',
      headers: getHeaders()
    });
    
    if (!response.ok) throw new Error('Error al finalizar la sesión');
    return response.json();
  },

  // 3. Registrar una Serie (Lagartijas, dominadas, etc.)
  async logSet(exercise, reps, weight, sessionId) {
    const pesoFinal = weight === '' || isNaN(weight) ? 0 : parseFloat(weight);

    const response = await fetch(`${API_URL}/workouts/log`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        session_id: sessionId,
        ejercicio_nombre: exercise.nombre,
        reps: parseInt(reps),
        lastre_kg: pesoFinal
      })
    });
    
    if (!response.ok) throw new Error('Error al guardar la serie');
    
    const data = await response.json();
    data.id = data._id;
    return data;
  },

  // 4. Obtener el historial de la sesión actual (Para ver qué hemos hecho hoy)
  async getSessionLogs(sessionId) {
    const response = await fetch(`${API_URL}/workouts/session/${sessionId}/logs`, {
      method: 'GET',
      headers: getHeaders()
    });
    
    if (!response.ok) throw new Error('Error al cargar las series');
    
    const data = await response.json();
    // Mapeamos los IDs y estructuramos la respuesta como la espera tu componente ActiveWorkout
    return data.map(log => ({
      ...log,
      id: log._id,
      nombre_ejercicio_api: log.ejercicio_nombre 
    }));
  }
};
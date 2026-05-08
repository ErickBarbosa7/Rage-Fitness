import { useState, useEffect } from 'react';
import { workoutApi } from '../services/workoutApi'; 

export function useExercises() {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;

    async function loadExercises() {
      try {
        setLoading(true);
        
        // 2. LLAMAMOS A WORKOUTX AQUÍ
        const data = await workoutApi.fetchAllExercises(); 
        
        if (!ignore) {
          setExercises(data);
        }
      } catch (err) {
        if (!ignore) setError(err.message);
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    loadExercises();

    return () => { ignore = true; };
  }, []);

  return { exercises, loading, error };
}
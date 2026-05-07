const API_KEY = import.meta.env.VITE_WORKOUTX_KEY;

export const workoutApi = {
  async fetchAllExercises() {
    const url = `https://api.workoutxapp.com/v1/exercises`;
    const options = {
      method: 'GET',
      headers: {
        'X-WorkoutX-Key': 'wx_91ee2f7b5fc4c48b5ace44167ee1db9b0d50b1a5cd15c1afdb9c6aa1'
      }
    };

    const response = await fetch(url, options);
    if (!response.ok) throw new Error(`Error de WorkoutX: ${response.status}`);
    
    const data = await response.json();
    console.log("Respuesta de la API:", data);

   
    let listaReal = [];
    if (Array.isArray(data)) {
      listaReal = data;
    } else if (data.exercises) {
      listaReal = data.exercises;
    } else if (data.data) {
      listaReal = data.data;
    } else if (data.results) {
      listaReal = data.results;
    } else {
      console.error("No se encontró el arreglo de ejercicios. Revisa el console.log");
      return [];
    }

    // Mapeo adaptado
    return listaReal.map(ex => ({
      id: ex.id || ex._id,
      nombre: ex.name || ex.title || 'Ejercicio sin nombre',
      grupo_muscular: ex.target || ex.bodyPart || ex.muscle || 'General'
    }));
  }
};
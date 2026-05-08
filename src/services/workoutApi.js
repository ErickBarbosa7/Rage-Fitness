// src/services/workoutApi.js

export const workoutApi = {
  async fetchAllExercises() {
    const url = `https://oss.exercisedb.dev/api/v1/exercises?limit=1500`;
    
    const options = {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    };

    try {
      console.log("Conectando a la nueva API Open Source...");
      const response = await fetch(url, options);
      
      if (!response.ok) {
        throw new Error(`Error de la API: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Imprimimos el objeto completo para ver su estructura real
      console.log("Respuesta RAW completa:", data);

      // BLINDAJE RESTAURADO: Buscamos dónde viene el arreglo real
      let listaReal = [];
      if (Array.isArray(data)) {
        listaReal = data;
      } else if (data && data.exercises) {
        listaReal = data.exercises;
      } else if (data && data.data) {
        listaReal = data.data;
      } else if (data && data.results) {
        listaReal = data.results;
      } else {
        console.error("No pudimos encontrar el arreglo en la respuesta. Revisa el console.log de Respuesta RAW.");
        return [];
      }

      console.log(`¡Éxito! Se encontraron ${listaReal.length} ejercicios.`);

      // Mapeamos los datos (ahora sí usamos listaReal, que es un Arreglo 100% seguro)
      return listaReal.map(ex => ({
        id: ex.id || Math.random().toString(),
        nombre: ex.name || 'Ejercicio Desconocido',
        grupo_muscular: ex.target || ex.bodyPart || 'General',
        imagen: ex.gifUrl || null 
      }));
      
    } catch (error) {
      console.error("Error en workoutApi:", error.message);
      return []; 
    }
  }
};
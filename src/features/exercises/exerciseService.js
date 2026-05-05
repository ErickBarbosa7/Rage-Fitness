import { supabase } from "../../services/supabase";

export const exerciseService = {
  // Obtener todos los ejercicios que poblamos antes
async logSet(exerciseId, reps, weight, sessionId) {
    const { data: { user } } = await supabase.auth.getUser();

    // Forzamos el parseo a número para evitar el 400 Bad Request
    const { data, error } = await supabase
        .from('logs_series')
        .insert([
        { 
            ejercicio_id: exerciseId, 
            sesion_id: sessionId,
            reps: parseInt(reps), 
            lastre_kg: parseFloat(weight),
            user_id: user.id
        }
        ]);

    if (error) throw error;
    return data;
    },
  async getAll() {
    const { data, error } = await supabase
      .from("ejercicios")
      .select("*")
      .order("nombre", { ascending: true });

    if (error) {
      console.error("Error al obtener ejercicios:", error.message);
      throw error;
    }
    return data;
  },
  // Función para loggear un set de entrenamiento

  async startSession() {
    // Obtenemos el ID del guerrero actual
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from("sesiones_entrenamiento")
      .insert([
        {
          user_id: user.id, // Vínculo obligatorio para el RLS
          fecha: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getSessionLogs(sessionId) {
    const { data, error } = await supabase
      .from("logs_series")
      .select(
        `
        *,
        ejercicios (nombre)
      `,
      )
      .eq("sesion_id", sessionId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  },
  
};

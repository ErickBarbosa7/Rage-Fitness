# ⚡ RAGE | High Performance Tracker

**Rage** es una aplicación de seguimiento de entrenamiento diseñada para atletas de alto rendimiento y entusiastas de la calistenia. Desarrollada con un enfoque en la eficiencia del usuario y la gamificación.

## 🚀 Características Actuales
- **Rage Mode:** Inicio de sesión de entrenamiento con cronómetro sincronizado en tiempo real.
- **Log System:** Registro preciso de repeticiones y lastre (kg) por ejercicio.
- **Auth System:** Gestión de usuarios segura mediante Supabase Auth.
- **Adaptive UI:** Interfaz minimalista "Purple Edition" optimizada para dispositivos móviles (iPhone).
- **Security:** Políticas de Row Level Security (RLS) en base de datos para protección de datos personales.

## 🛠️ Stack Tecnológico
- **Core:** React.js (Vite)
- **Estilos:** Tailwind CSS (Custom Theme: #a855f7)
- **Backend:** Supabase (PostgreSQL)
- **Feedback:** Sonner (Toast Notifications)
- **Metodología:** Inspirado en principios de TSP/PSP para el seguimiento de métricas personales.

## 📊 Sistema de Progresión (Roadmap)
La app implementa un sistema de rangos basado en la consistencia del usuario:
1. **Novato** (Inicio)
2. **Aprendiz**
3. **Guerrero**
4. **Veterano**
5. **Élite**
6. **Campeón**
7. **Titán**
8. **Leyenda**

## 🔧 Instalación
1. Clonar el repositorio:
   ```bash
   git clone [https://github.com/tu-usuario/rage.git](https://github.com/tu-usuario/rage.git)
   npm install

3. Configurar variables de entorno (`.env`):
   ```env
   VITE_SUPABASE_URL=tu_url
   VITE_SUPABASE_ANON_KEY=tu_key
   
Correr en desarrollo:
npm run dev
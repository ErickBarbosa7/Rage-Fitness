// src/utils/rankUtils.js
export const getRank = (totalSessions) => {
  if (totalSessions >= 200) return "Leyenda";
  if (totalSessions >= 150) return "Titán";
  if (totalSessions >= 100) return "Campeón";
  if (totalSessions >= 75) return "Élite";
  if (totalSessions >= 50) return "Veterano";
  if (totalSessions >= 25) return "Guerrero";
  if (totalSessions >= 10) return "Aprendiz";
  return "Novato";
};
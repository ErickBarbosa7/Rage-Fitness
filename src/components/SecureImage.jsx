import { useState, useEffect } from 'react';

export function SecureImage({ src, alt, className }) {
  const [imageSrc, setImageSrc] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    if (!src) return;

    async function fetchImage() {
      try {
        const response = await fetch(src, {
          headers: {
            'X-WorkoutX-Key': import.meta.env.VITE_WORKOUTX_KEY 
          }
        });
        
        if (!response.ok) throw new Error('Error al bajar imagen');
        
        // Convertimos la respuesta cruda en un archivo binario (Blob)
        const blob = await response.blob(); 
        
        // Creamos una URL temporal que vive en la memoria de tu celular
        const localUrl = URL.createObjectURL(blob); 
        
        if (isMounted) setImageSrc(localUrl);
      } catch (err) {
        if (isMounted) setError(true);
      }
    }

    fetchImage();

    // Limpieza de memoria para no saturar el celular
    return () => {
      isMounted = false;
      if (imageSrc) URL.revokeObjectURL(imageSrc);
    };
  }, [src]);

  if (error) {
    return <span className="text-zinc-700 font-bold text-[10px]">Sin IMG</span>;
  }

  if (!imageSrc) {
    return <div className={`animate-pulse bg-zinc-800 ${className}`}></div>; // Esqueleto de carga
  }

  return <img src={imageSrc} alt={alt} className={className} />;
}
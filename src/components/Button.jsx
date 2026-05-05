export function Button({ children, onClick, variant = 'primary', className = '' }) {
  const variants = {
    primary: 'bg-primary hover:bg-red-700 text-white font-black italic',
    outline: 'border-2 border-zinc-800 hover:border-primary text-gray-400 hover:text-white',
    ghost: 'text-zinc-500 hover:text-white'
  };

  return (
    <button 
      onClick={onClick}
      className={`w-full py-4 rounded-xl transition-all active:scale-95 uppercase tracking-tighter ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
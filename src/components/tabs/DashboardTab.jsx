import { Button } from '../Button';

export function DashboardTab({ onStartWorkout }) {
  return (
    <div className="space-y-8 mt-4 animate-in fade-in duration-500">
      <section className="bg-surface p-8 rounded-[2.5rem] border border-zinc-900 text-center shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-primary blur-sm"></div>
        <h2 className="text-zinc-600 uppercase text-[10px] font-black tracking-[0.3em] mb-4 italic">
          Ready to bleed?
        </h2>
        <p className="text-7xl font-black italic tracking-tighter mb-10 text-white relative z-10">
          RAGE <span className="text-primary drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]">MODE</span>
        </p>
        <Button onClick={onStartWorkout} className="py-8 text-xl shadow-[0_0_30px_rgba(168,85,247,0.3)] w-full">
          Empezar Sesión
        </Button>
      </section>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-surface p-6 rounded-3xl border border-zinc-900 flex flex-col items-center text-center">
          <p className="text-zinc-600 text-[10px] font-black uppercase tracking-widest mb-1">Racha</p>
          <p className="text-4xl font-black italic text-primary">0 DÍAS</p>
        </div>
        <div className="bg-surface p-6 rounded-3xl border border-zinc-900 flex flex-col items-center text-center">
          <p className="text-zinc-600 text-[10px] font-black uppercase tracking-widest mb-1">Rango</p>
          <p className="text-2xl font-black italic text-white uppercase mt-2">Novato</p>
        </div>
      </div>
    </div>
  );
}
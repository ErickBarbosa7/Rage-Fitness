import { Activity, Utensils, BarChart3, User } from 'lucide-react';

export function MainLayout({ children, title, currentTab, onTabChange }) {
  const tabs = [
    { id: 'dashboard', icon: Activity },
    { id: 'nutrition', icon: Utensils },
    { id: 'progress', icon: BarChart3 },
    { id: 'profile', icon: User },
  ];

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto bg-background">
      <header className="p-6 sticky top-0 bg-background/80 backdrop-blur-md z-10 flex justify-between items-center">
        <h1 className="text-3xl font-black italic text-primary tracking-tighter uppercase">
          {title}
        </h1>
      </header>

      <main className="flex-1 px-6 pb-28">
        {children}
      </main>

      {/* Tab Bar Dinámica */}
      <nav className="fixed bottom-0 w-full max-w-md bg-surface/90 backdrop-blur-lg border-t border-zinc-900 px-8 py-4 flex justify-between items-center z-20">
        {tabs.map(({ id, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className={`transition-all duration-300 ${
              currentTab === id ? 'text-primary scale-125' : 'text-zinc-600'
            }`}
          >
            <Icon size={24} strokeWidth={currentTab === id ? 3 : 2} />
          </button>
        ))}
      </nav>
    </div>
  );
}
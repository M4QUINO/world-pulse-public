import React, { useEffect, useMemo, useState } from 'react';
import { Clock3, Globe, MessageSquareMore, Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Navbar = ({ lastUpdatedAt }) => {
  const { isDark, toggleTheme } = useTheme();
  const [nextUpdate, setNextUpdate] = useState('');

  const lastUpdatedLabel = useMemo(() => {
    if (!lastUpdatedAt) {
      return '--:--';
    }

    return new Date(lastUpdatedAt).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }, [lastUpdatedAt]);

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date();
      const nextHour = Math.ceil((now.getHours() + now.getMinutes() / 60 + 0.01) / 3) * 3;
      const target = new Date(now);

      target.setHours(nextHour % 24, 0, 0, 0);
      if (nextHour >= 24) {
        target.setDate(target.getDate() + 1);
      }

      const diff = Math.max(0, target.getTime() - now.getTime());
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      setNextUpdate(`${hours}h ${String(mins).padStart(2, '0')}m`);
    };

    calculateTime();
    const interval = setInterval(calculateTime, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <nav className="fixed inset-x-0 top-0 z-50 px-3 py-3 sm:px-4 sm:py-4 md:px-6">
      <div className="mx-auto flex max-w-7xl items-center justify-between rounded-full border border-white/15 bg-white/70 px-4 py-3 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:bg-slate-950/55 sm:px-5">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-blue-500 p-2 shadow-lg shadow-blue-500/25 sm:p-2.5">
            <Globe className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="text-sm font-semibold tracking-tight text-slate-950 dark:text-white sm:text-base md:text-lg">
              World <span className="text-blue-500">Pulse</span>
            </div>
            <div className="hidden text-xs text-slate-500 dark:text-slate-400 md:block">
              Feed infinito, editorial vivo e debates anonimos
            </div>
          </div>
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <div className="flex items-center gap-2 rounded-full bg-slate-950/5 px-4 py-2 text-xs font-medium text-slate-600 dark:bg-white/8 dark:text-slate-200">
            <Clock3 className="h-4 w-4 text-blue-500" />
            <span>Proxima leitura em {nextUpdate}</span>
          </div>
          <div className="rounded-full bg-slate-950/5 px-4 py-2 text-xs font-medium text-slate-600 dark:bg-white/8 dark:text-slate-300">
            Ultima rodada {lastUpdatedLabel}
          </div>
          <div className="flex items-center gap-2 rounded-full bg-slate-950/5 px-4 py-2 text-xs font-medium text-slate-600 dark:bg-white/8 dark:text-slate-300">
            <MessageSquareMore className="h-4 w-4 text-violet-500" />
            <span>debates anonimos abertos</span>
          </div>
        </div>

        <button
          onClick={toggleTheme}
          className="rounded-full border border-slate-200/80 p-2.5 text-slate-700 transition hover:bg-slate-100 dark:border-white/10 dark:text-slate-100 dark:hover:bg-white/10"
          aria-label="Alternar tema"
        >
          {isDark ? <Sun className="h-5 w-5 text-amber-300" /> : <Moon className="h-5 w-5" />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;

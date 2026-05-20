import React from 'react';
import { ExternalLink, Tag, TrendingUp, Star } from 'lucide-react';
import { motion } from 'framer-motion';

const AdCard = ({ item }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="premium-card group relative overflow-hidden h-full min-h-[400px]"
    >
      {/* Background Gradient & Animated Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950/20 to-slate-950 z-0" />
      <div className="absolute -inset-[100%] bg-[conic-gradient(from_90deg_at_50%_50%,#3b82f6_0%,#8b5cf6_50%,#3b82f6_100%)] opacity-0 group-hover:opacity-10 transition-opacity duration-700 animate-[spin_4s_linear_infinite]" />
      
      <div className="relative z-10 p-6 h-full flex flex-col glass dark:glass-dark border-blue-500/20 group-hover:border-blue-500/40 transition-all">
        <div className="flex items-center justify-between mb-4">
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg shadow-blue-500/20">
            <Star className="w-3 h-3 fill-current" /> {item.label}
          </span>
          <span className="text-[10px] font-bold text-blue-500/60 uppercase tracking-widest">Premium Partner</span>
        </div>

        <div className="relative aspect-video mb-6 rounded-2xl overflow-hidden shadow-2xl border border-white/5">
          <img 
            src={item.imageUrl} 
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" />
        </div>

        <h3 className="font-bold text-2xl leading-tight mb-4 dark:text-white text-slate-900 group-hover:text-blue-500 transition-colors">
          {item.title}
        </h3>

        <p className="text-slate-600 dark:text-slate-400 text-sm leading-7 mb-8 flex-grow">
          {item.summary}
        </p>

        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-slate-950 dark:bg-white text-white dark:text-slate-950 py-4 rounded-[1.4rem] font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-blue-500/10"
        >
          Explorar Oferta <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </motion.div>
  );
};

export default AdCard;

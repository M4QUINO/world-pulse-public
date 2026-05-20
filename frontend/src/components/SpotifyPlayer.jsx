import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, X, Save, ExternalLink, User } from 'lucide-react';

const SpotifyPlayer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [spotifyId, setSpotifyId] = useState(() => {
    return localStorage.getItem('world_pulse_spotify_id') || '37i9dQZF1DXcBWIGoYBM3M'; // Playlist 'Today's Top Hits' como padrão
  });
  const [tempId, setTempId] = useState(spotifyId);
  const [isConfiguring, setIsConfiguring] = useState(false);

  // Determina se o ID é uma playlist, usuário ou álbum para montar a URL do Embed
  const getEmbedUrl = (id) => {
    if (id.includes('spotify.com')) {
      // Se for um link completo, extrai o caminho
      const parts = id.split('spotify.com/')[1].split('?')[0];
      return `https://open.spotify.com/embed/${parts}?utm_source=generator&theme=0`;
    }
    // Se for apenas o ID, assume que é uma playlist por padrão
    return `https://open.spotify.com/embed/playlist/${id}?utm_source=generator&theme=0`;
  };

  const handleSave = () => {
    let cleanId = tempId.trim();
    if (cleanId) {
      setSpotifyId(cleanId);
      localStorage.setItem('world_pulse_spotify_id', cleanId);
      setIsConfiguring(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-[110] flex flex-col items-end gap-3 sm:bottom-8 sm:right-8 sm:gap-4">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95, x: 20 }}
            animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
            exit={{ opacity: 0, y: 20, scale: 0.95, x: 20 }}
            className="max-h-[75vh] w-[min(24rem,calc(100vw-2rem))] overflow-y-auto rounded-[2.2rem] border border-white/10 glass shadow-2xl dark:glass-dark sm:w-[350px] md:w-[400px]"
          >
            {/* Header do Spotify */}
            <div className="bg-[#1DB954] p-4 flex items-center justify-between text-black">
              <div className="flex items-center gap-2">
                <Music className="w-5 h-5" />
                <span className="font-black uppercase tracking-widest text-xs">Spotify Pulse</span>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setIsConfiguring(!isConfiguring)}
                  className="p-2 hover:bg-black/10 rounded-full transition-colors"
                  title="Configurar Usuário/Playlist"
                >
                  <User className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-black/10 rounded-full transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Área de Configuração */}
            {isConfiguring && (
              <motion.div 
                initial={{ height: 0 }} 
                animate={{ height: 'auto' }}
                className="p-6 bg-black/5 dark:bg-white/5 border-b border-white/10"
              >
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">
                  ID do Usuário ou Link da Playlist
                </label>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <input 
                    type="text"
                    value={tempId}
                    onChange={(e) => setTempId(e.target.value)}
                    placeholder="Cole o link do Spotify aqui..."
                    className="flex-grow bg-white/50 dark:bg-black/20 border border-white/20 rounded-xl px-4 py-2 text-sm outline-none focus:border-[#1DB954] transition-all"
                  />
                  <button 
                    onClick={handleSave}
                    className="flex items-center justify-center bg-[#1DB954] text-black p-2 rounded-xl hover:scale-105 transition-transform"
                  >
                    <Save className="w-5 h-5" />
                  </button>
                </div>
                <p className="mt-2 text-[9px] text-slate-400">
                  Dica: Você pode colar o link de qualquer playlist, álbum ou perfil de usuário.
                </p>
              </motion.div>
            )}

            {/* Iframe do Spotify */}
            <div className="p-2">
              <iframe
                src={getEmbedUrl(spotifyId)}
                width="100%"
                height="352"
                frameBorder="0"
                allowFullScreen=""
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                className="rounded-[1.8rem]"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Botão de Ativação do Spotify */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-3 rounded-full border border-white/10 p-3 shadow-2xl transition-all sm:p-4 ${
          isOpen ? 'bg-[#1DB954] text-black' : 'bg-slate-950 text-white hover:bg-slate-900'
        }`}
      >
        <div className={`p-1.5 rounded-full ${isOpen ? 'bg-black/20' : 'bg-[#1DB954]'}`}>
          <Music className={`w-5 h-5 ${isOpen ? 'text-black' : 'text-white'}`} />
        </div>
        <span className="hidden pr-2 text-sm font-bold sm:block">Spotify</span>
      </motion.button>
    </div>
  );
};

export default SpotifyPlayer;

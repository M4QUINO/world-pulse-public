import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertTriangle,
  MapPin,
  Music,
  Pause,
  Play,
  Radio,
  RefreshCw,
  Volume2,
  Wifi,
  WifiOff,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const STORAGE_KEY = 'world_pulse_radio_station';

const STATIONS = [
  {
    id: 'bandnews-sp',
    name: 'BandNews FM SP',
    url: 'https://playerservices.streamtheworld.com/api/livestream-redirect/BANDNEWSFM_SPAAC_SC',
    genre: 'Noticias / Jornalismo',
    location: 'Sao Paulo (SP)',
  },
  {
    id: 'cbn-sp',
    name: 'CBN Sao Paulo',
    url: 'https://playerservices.streamtheworld.com/api/livestream-redirect/CBN_SPAAC_SC',
    genre: 'Noticias / Cidade',
    location: 'Sao Paulo (SP)',
  },
  {
    id: 'bandeirantes',
    name: 'Radio Bandeirantes',
    url: 'https://playerservices.streamtheworld.com/api/livestream-redirect/RadioBandeirantesAAC_SC',
    genre: 'Jornalismo / Esportes',
    location: 'Nacional',
  },
  {
    id: 'nova-brasil',
    name: 'Nova Brasil FM',
    url: 'https://playerservices.streamtheworld.com/api/livestream-redirect/NOVABRASIL_SPAAC_SC',
    genre: 'MPB / Musica Brasileira',
    location: 'Nacional',
  },
  {
    id: 'alvorada',
    name: 'Alvorada FM',
    url: 'https://playerservices.streamtheworld.com/api/livestream-redirect/RADIO_ALVORADAAAC_SC',
    genre: 'Pop / Adulto contemporaneo',
    location: 'Belo Horizonte (MG)',
  },
  {
    id: 'bandnews-rj',
    name: 'BandNews FM RJ',
    url: 'https://playerservices.streamtheworld.com/api/livestream-redirect/BANDNEWSFM_RJAAC.aac',
    genre: 'Noticias / Jornalismo',
    location: 'Rio de Janeiro (RJ)',
  },
];

const getStoredStation = () => {
  if (typeof window === 'undefined') {
    return STATIONS[0];
  }

  const storedId = window.localStorage.getItem(STORAGE_KEY);
  return STATIONS.find((station) => station.id === storedId) || STATIONS[0];
};

const RadioPlayer = () => {
  const [currentStation, setCurrentStation] = useState(getStoredStation);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState('booting');
  const [volume, setVolume] = useState(0.72);
  const [needsGesture, setNeedsGesture] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Preparando a radio...');
  const [isMobileBrowser, setIsMobileBrowser] = useState(() => {
    if (typeof window === 'undefined') {
      return false;
    }
    return window.matchMedia('(max-width: 768px), (pointer: coarse)').matches;
  });

  const audioRef = useRef(null);
  const autoplayAttemptedRef = useRef(false);
  const manualPauseRef = useRef(false);
  const unmuteTimerRef = useRef(null);

  const statusTone = useMemo(() => {
    if (status === 'playing') {
      return 'text-orange-400';
    }
    if (status === 'error' || status === 'blocked') {
      return 'text-red-400';
    }
    return 'text-blue-400';
  }, [status]);

  const persistStation = (station) => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, station.id);
    }
  };

  const prepareAudio = (station) => {
    const audio = audioRef.current;
    if (!audio) {
      return null;
    }

    if (audio.dataset.stationId !== station.id) {
      audio.pause();
      audio.src = station.url;
      audio.load();
      audio.dataset.stationId = station.id;
    }

    return audio;
  };

  const clearPendingUnmute = () => {
    if (unmuteTimerRef.current) {
      window.clearTimeout(unmuteTimerRef.current);
      unmuteTimerRef.current = null;
    }
  };

  const startPlayback = async (station = currentStation, options = {}) => {
    const audio = prepareAudio(station);
    if (!audio) {
      return;
    }

    const { source = 'manual', allowMutedBoot = false } = options;

    manualPauseRef.current = false;
    setCurrentStation(station);
    persistStation(station);
    setStatus('loading');
    setStatusMessage(source === 'boot' ? 'Ligando automaticamente...' : `Conectando em ${station.name}...`);
    setNeedsGesture(false);

    try {
      clearPendingUnmute();

      audio.muted = allowMutedBoot;
      audio.volume = allowMutedBoot ? 0 : volume;
      audio.playsInline = true;

      const playPromise = audio.play();
      if (playPromise) {
        await playPromise;
      }

      setIsPlaying(true);
      setStatus('playing');
      setStatusMessage(`No ar agora: ${station.name}`);

      if (allowMutedBoot) {
        unmuteTimerRef.current = window.setTimeout(() => {
          const liveAudio = audioRef.current;
          if (!liveAudio) {
            return;
          }

          liveAudio.muted = false;
          liveAudio.volume = volume;
        }, 450);
      }
    } catch (error) {
      const blockedByBrowser =
        error?.name === 'NotAllowedError' || String(error?.message || '').toLowerCase().includes('gesture');

      setIsPlaying(false);
      setNeedsGesture(blockedByBrowser);
      setStatus(blockedByBrowser ? 'blocked' : 'error');
      setStatusMessage(
        blockedByBrowser
          ? 'O navegador segurou o som. No primeiro clique da pagina eu ativo.'
          : 'Nao consegui abrir esse stream agora. Troque de radio ou tente novamente.',
      );

      if (blockedByBrowser) {
        setIsOpen(true);
      }

      console.error('Falha ao tocar radio:', error);
    }
  };

  const pausePlayback = () => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    manualPauseRef.current = true;
    clearPendingUnmute();
    audio.pause();
    audio.muted = false;
    audio.volume = volume;
    setIsPlaying(false);
    setNeedsGesture(false);
    setStatus('idle');
    setStatusMessage('Radio pausada.');
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      pausePlayback();
      return;
    }

    startPlayback(currentStation, { source: 'manual' });
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      return undefined;
    }

    const handlePlaying = () => {
      setIsPlaying(true);
      setStatus('playing');
      setStatusMessage(`No ar agora: ${currentStation.name}`);
    };

    const handlePause = () => {
      if (!manualPauseRef.current) {
        setIsPlaying(false);
      }
    };

    const handleError = () => {
      setIsPlaying(false);
      setStatus('error');
      setStatusMessage('A radio caiu ou o stream ficou indisponivel.');
    };

    const handleWaiting = () => {
      if (!manualPauseRef.current) {
        setStatus('loading');
        setStatusMessage(`Reconectando ${currentStation.name}...`);
      }
    };

    audio.addEventListener('playing', handlePlaying);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('error', handleError);
    audio.addEventListener('waiting', handleWaiting);

    return () => {
      audio.removeEventListener('playing', handlePlaying);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('waiting', handleWaiting);
    };
  }, [currentStation.name]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    audio.volume = volume;
  }, [volume]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const mediaQuery = window.matchMedia('(max-width: 768px), (pointer: coarse)');
    const updateMode = () => setIsMobileBrowser(mediaQuery.matches);

    updateMode();
    mediaQuery.addEventListener?.('change', updateMode);

    return () => mediaQuery.removeEventListener?.('change', updateMode);
  }, []);

  useEffect(() => {
    if (autoplayAttemptedRef.current) {
      return undefined;
    }

    autoplayAttemptedRef.current = true;

    if (isMobileBrowser) {
      setStatus('idle');
      setStatusMessage('Toque no player para ligar a radio no celular.');
      return undefined;
    }

    const timer = window.setTimeout(() => {
      startPlayback(getStoredStation(), { source: 'boot', allowMutedBoot: true });
    }, 600);

    return () => {
      window.clearTimeout(timer);
    };
  }, [isMobileBrowser]);

  useEffect(() => {
    if (!needsGesture) {
      return undefined;
    }

    const resumeAudio = () => {
      const audio = audioRef.current;
      if (audio) {
        audio.muted = false;
        audio.volume = volume;
      }

      startPlayback(currentStation, { source: 'gesture' });
    };

    window.addEventListener('pointerdown', resumeAudio, { once: true, capture: true });
    window.addEventListener('keydown', resumeAudio, { once: true, capture: true });

    return () => {
      window.removeEventListener('pointerdown', resumeAudio, true);
      window.removeEventListener('keydown', resumeAudio, true);
    };
  }, [currentStation, needsGesture, volume]);

  useEffect(() => {
    return () => {
      clearPendingUnmute();
    };
  }, []);

  return (
    <div className="fixed bottom-4 left-4 z-[120] sm:bottom-8 sm:left-8">
      <audio ref={audioRef} autoPlay playsInline preload="none" />

      <div className="relative">
        <AnimatePresence>
          {isOpen ? (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.94 }}
              className="absolute bottom-[4.5rem] left-0 mb-3 w-[min(24rem,calc(100vw-2rem))] rounded-[2.1rem] border border-white/10 bg-slate-950/94 p-5 shadow-2xl backdrop-blur-2xl sm:bottom-20 sm:mb-4 sm:rounded-[2.3rem] sm:p-6"
            >
              <div className="mb-5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`rounded-[1.3rem] p-3 ${
                      status === 'playing'
                        ? 'bg-orange-500 shadow-[0_0_24px_rgba(249,115,22,0.32)]'
                        : 'bg-white/8'
                    }`}
                  >
                    <Radio className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-[0.18em] text-white">Radio ao vivo</h4>
                    <p className={`mt-1 text-[10px] font-black uppercase tracking-[0.24em] ${statusTone}`}>
                      {status === 'loading'
                        ? 'Conectando'
                        : status === 'blocked'
                          ? 'Aguardando clique'
                          : status === 'error'
                            ? 'Sinal indisponivel'
                            : status === 'playing'
                              ? 'No ar'
                              : 'Pronta'}
                    </p>
                  </div>
                </div>
                {status === 'playing' ? (
                  <Wifi className="h-4 w-4 text-orange-400" />
                ) : (
                  <WifiOff className="h-4 w-4 text-slate-500" />
                )}
              </div>

              <div className="mb-4 rounded-[1.8rem] border border-white/10 bg-white/6 p-4">
                <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Status</div>
                <div className="mt-2 text-sm leading-6 text-white">{statusMessage}</div>
              </div>

              {needsGesture ? (
                <button
                  type="button"
                  onClick={() => startPlayback(currentStation, { source: 'manual' })}
                  className="mb-4 flex w-full items-center justify-center gap-3 rounded-[1.7rem] bg-orange-500 px-5 py-4 text-sm font-black uppercase tracking-[0.18em] text-white transition hover:bg-orange-600"
                >
                  <Play className="h-5 w-5 fill-current" />
                  Liberar som agora
                </button>
              ) : (
                <div className="mb-4 flex items-center justify-between rounded-[1.7rem] border border-white/10 bg-white/6 p-4">
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Ao vivo</div>
                    <div className="mt-1 text-sm font-semibold text-white">{currentStation.name}</div>
                  </div>
                  <button
                    type="button"
                    onClick={togglePlayPause}
                    className="rounded-full bg-white/10 p-3 text-white transition hover:bg-white/16 hover:text-orange-300"
                  >
                    {status === 'loading' ? (
                      <RefreshCw className="h-5 w-5 animate-spin" />
                    ) : isPlaying ? (
                      <Pause className="h-5 w-5" />
                    ) : (
                      <Play className="h-5 w-5 fill-current" />
                    )}
                  </button>
                </div>
              )}

              {status === 'error' ? (
                <div className="mb-4 flex items-center gap-2 rounded-[1.4rem] border border-red-500/20 bg-red-500/10 px-3 py-3 text-[11px] font-semibold text-red-300">
                  <AlertTriangle className="h-4 w-4" />
                  Esse stream falhou. Escolha outra estacao abaixo.
                </div>
              ) : null}

              <div className="mb-5 max-h-56 space-y-2 overflow-y-auto pr-1">
                {STATIONS.map((station) => {
                  const isActive = currentStation.id === station.id;

                  return (
                    <button
                      key={station.id}
                      type="button"
                      onClick={() => startPlayback(station, { source: 'manual' })}
                      className={`w-full rounded-[1.5rem] border p-4 text-left transition ${
                        isActive
                          ? 'border-orange-500/35 bg-white/10 text-white'
                          : 'border-white/8 bg-white/5 text-slate-300 hover:bg-white/8'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <MapPin className={`h-3.5 w-3.5 ${isActive ? 'text-orange-300' : 'text-slate-500'}`} />
                            <span className="text-sm font-semibold">{station.name}</span>
                          </div>
                          <div className="mt-2 text-xs leading-5 text-slate-400">
                            {station.genre} · {station.location}
                          </div>
                        </div>
                        {isActive && status === 'loading' ? (
                          <RefreshCw className="mt-0.5 h-4 w-4 animate-spin text-orange-400" />
                        ) : null}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="rounded-[1.6rem] border border-white/10 bg-white/6 p-4">
                <div className="mb-3 flex items-center gap-3">
                  <Volume2 className="h-4 w-4 text-slate-400" />
                  <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                    Volume
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={(event) => setVolume(Number(event.target.value))}
                  className="w-full cursor-pointer accent-orange-500"
                />
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-3 rounded-full border border-white/10 bg-slate-950 px-3 py-3 text-white shadow-2xl sm:gap-4"
        >
          <button
            type="button"
            onClick={() => setIsOpen((current) => !current)}
            className={`rounded-full p-3 transition sm:p-4 ${
              isOpen ? 'bg-orange-500 shadow-lg shadow-orange-500/35' : 'bg-white/5 hover:bg-white/10'
            }`}
          >
            <Music className="h-5 w-5" />
          </button>

          <div className="hidden md:block">
            <div className="text-[9px] font-black uppercase tracking-[0.24em] text-orange-400">
              {status === 'playing' ? 'Tocando' : status === 'loading' ? 'Ligando' : 'Radio'}
            </div>
            <div className="mt-1 w-36 truncate text-xs font-semibold">{currentStation.name}</div>
          </div>

          <div className="flex items-center gap-2 border-l border-white/10 pl-4">
            <button
              type="button"
              onClick={togglePlayPause}
              className="rounded-full p-2 transition hover:text-orange-300"
              title={isPlaying ? 'Pausar radio' : 'Tocar radio'}
            >
              {status === 'loading' ? (
                <RefreshCw className="h-5 w-5 animate-spin text-orange-400" />
              ) : isPlaying ? (
                <Pause className="h-5 w-5" />
              ) : (
                <Play className="h-5 w-5 fill-current" />
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RadioPlayer;

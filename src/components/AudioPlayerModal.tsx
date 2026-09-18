import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  X,
  PhoneIncoming,
  PhoneOutgoing,
  Clock,
  User,
  Phone,
  FileText,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AudioPlayerModal: React.FC = () => {
  const { activeAudioCall, setActiveAudioCall, setSelectedClientId, setActivePage, clients } = useApp();

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTimeSec, setCurrentTimeSec] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const intervalRef = useRef<number | null>(null);

  const totalDurationSec = activeAudioCall ? activeAudioCall.durationSeconds : 222;

  // Format seconds to mm:ss
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `00:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // Reset when call changes
  useEffect(() => {
    setIsPlaying(false);
    setCurrentTimeSec(0);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, [activeAudioCall]);

  // Handle Play / Pause with synthesized audio tone
  const togglePlay = () => {
    if (!isPlaying) {
      setIsPlaying(true);
      // Optional subtle synthesized audio for realistic experience
      if (!isMuted) {
        try {
          const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
          if (!audioContextRef.current) {
            audioContextRef.current = new AudioContextClass();
          }
          if (audioContextRef.current.state === 'suspended') {
            audioContextRef.current.resume();
          }
          const ctx = audioContextRef.current;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(320, ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.15);
          gain.gain.setValueAtTime(0.04, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.2);
        } catch {
          // Web Audio may be restricted in some iframe contexts
        }
      }
    } else {
      setIsPlaying(false);
    }
  };

  // Playback timer
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = window.setInterval(() => {
        setCurrentTimeSec(prev => {
          if (prev >= totalDurationSec) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000 / playbackSpeed);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, playbackSpeed, totalDurationSec]);

  if (!activeAudioCall) return null;

  // Waveform bar heights
  const waveHeights = [24, 45, 68, 32, 54, 80, 42, 60, 92, 75, 40, 65, 88, 50, 72, 35, 60, 85, 48, 70, 90, 30, 55, 78, 62, 40, 85, 95, 52, 68];

  const progressPercent = Math.min(100, (currentTimeSec / totalDurationSec) * 100);

  // Find client if linked
  const matchedClient = clients.find(c => c.phone === activeAudioCall.phone || c.companyName === activeAudioCall.clientName);

  return (
    <div
      id="audio-player-modal-backdrop"
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-150"
      onClick={() => {
        setIsPlaying(false);
        setActiveAudioCall(null);
      }}
    >
      <div
        id="audio-player-modal-card"
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in zoom-in-95 duration-150"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="bg-[#0F2942] text-white p-4.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-600/20 border border-orange-500/40 flex items-center justify-center text-orange-400 shrink-0">
              {activeAudioCall.type === 'Kiruvchi' ? (
                <PhoneIncoming className="w-5 h-5 text-emerald-400" />
              ) : (
                <PhoneOutgoing className="w-5 h-5 text-blue-400" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-base">{activeAudioCall.clientName}</span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    activeAudioCall.type === 'Kiruvchi'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      : 'bg-blue-950 text-blue-300 border border-blue-800'
                  }`}
                >
                  {activeAudioCall.type}
                </span>
              </div>
              <div className="text-xs text-slate-300 font-mono flex items-center gap-2 mt-0.5">
                <span>{activeAudioCall.phone}</span>
                <span>•</span>
                <span>{activeAudioCall.date} {activeAudioCall.time}</span>
              </div>
            </div>
          </div>

          <button
            id="close-audio-player-btn"
            onClick={() => {
              setIsPlaying(false);
              setActiveAudioCall(null);
            }}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Call Info & Operator */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 grid grid-cols-2 gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-700">
            <User className="w-4 h-4 text-slate-400" />
            <span>Operator: <strong className="text-slate-900">{activeAudioCall.operator}</strong></span>
          </div>
          <div className="flex items-center gap-2 text-slate-700">
            <Clock className="w-4 h-4 text-slate-400" />
            <span>Umumiy vaqt: <strong className="text-slate-900">{activeAudioCall.duration}</strong></span>
          </div>
        </div>

        {/* Audio Waveform Player Visualization */}
        <div className="p-6 flex flex-col items-center bg-white space-y-5">
          {/* Animated Waveform Bars */}
          <div className="w-full bg-slate-100/90 rounded-2xl p-4 flex items-center justify-between gap-1 h-24 border border-slate-200">
            {waveHeights.map((h, i) => {
              const barPercent = (i / waveHeights.length) * 100;
              const isActive = barPercent <= progressPercent;
              return (
                <div
                  key={i}
                  className="flex-1 rounded-full transition-all duration-150 flex items-center justify-center"
                  style={{ height: `${h}%` }}
                >
                  <span
                    className={`w-full h-full rounded-full ${
                      isActive
                        ? 'bg-[#EA580C]'
                        : 'bg-slate-300'
                    } ${isPlaying ? 'opacity-90' : 'opacity-70'}`}
                  />
                </div>
              );
            })}
          </div>

          {/* Time Counter */}
          <div className="w-full flex items-center justify-between text-xs font-mono font-bold text-slate-600">
            <span className="text-[#EA580C] text-sm">{formatTime(currentTimeSec)}</span>
            <span className="text-slate-400">00:{activeAudioCall.duration}</span>
          </div>

          {/* Scrubber Range Input */}
          <div className="w-full">
            <input
              type="range"
              min="0"
              max={totalDurationSec}
              value={currentTimeSec}
              onChange={e => setCurrentTimeSec(Number(e.target.value))}
              className="w-full accent-[#EA580C] cursor-pointer h-2 bg-slate-200 rounded-lg appearance-none"
            />
          </div>

          {/* Playback Controls */}
          <div className="w-full flex items-center justify-between pt-1">
            {/* Speed Toggle */}
            <button
              onClick={() => setPlaybackSpeed(s => (s === 1 ? 1.25 : s === 1.25 ? 1.5 : 1))}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 border border-slate-200"
              title="Tezlikni o‘zgartirish"
            >
              {playbackSpeed}x
            </button>

            {/* Rewind 10s & Main Play/Pause Button */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCurrentTimeSec(c => Math.max(0, c - 10))}
                className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors"
                title="10 soniya orqaga"
              >
                <RotateCcw className="w-5 h-5" />
              </button>

              <button
                id="audio-play-pause-btn"
                onClick={togglePlay}
                className="w-13 h-13 rounded-full bg-[#EA580C] hover:bg-[#D44806] text-white flex items-center justify-center shadow-lg shadow-orange-500/30 transition-transform active:scale-95"
                title={isPlaying ? 'Pauza' : 'Tinglash'}
              >
                {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-0.5" />}
              </button>
            </div>

            {/* Mute Button */}
            <button
              onClick={() => setIsMuted(m => !m)}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors"
              title={isMuted ? 'Ovozni yoqish' : 'Ovozni o‘chirish'}
            >
              {isMuted ? <VolumeX className="w-5 h-5 text-red-500" /> : <Volume2 className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Call Notes / Izoh */}
        <div className="p-4 bg-orange-50/60 border-t border-orange-100">
          <div className="flex items-start gap-2.5">
            <FileText className="w-4 h-4 text-[#EA580C] shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-slate-800 mb-0.5">Suhbat izohi:</div>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                "{activeAudioCall.notes}"
              </p>
            </div>
          </div>

          {matchedClient && (
            <div className="mt-3 pt-2.5 border-t border-orange-200/60 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">Mijoz kartasini ochish:</span>
              <button
                onClick={() => {
                  setSelectedClientId(matchedClient.id);
                  setActivePage('mijozlar');
                  setActiveAudioCall(null);
                }}
                className="inline-flex items-center gap-1 text-xs font-bold text-[#EA580C] hover:underline"
              >
                <span>{matchedClient.companyName}</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

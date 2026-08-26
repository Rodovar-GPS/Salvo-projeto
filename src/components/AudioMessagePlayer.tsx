import React, { useState } from 'react';
import { Play, Pause, Volume2 } from 'lucide-react';

interface AudioMessagePlayerProps {
  duration?: string;
  senderName?: string;
  isMe?: boolean;
}

export const AudioMessagePlayer: React.FC<AudioMessagePlayerProps> = ({
  duration = '0:24',
  senderName,
  isMe = false,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const togglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      // Simulate audio play progress
      let p = 0;
      const interval = setInterval(() => {
        p += 5;
        if (p > 100) {
          clearInterval(interval);
          setIsPlaying(false);
          setProgress(0);
        } else {
          setProgress(p);
        }
      }, 150);
    }
  };

  return (
    <div
      className={`p-3 rounded-2xl flex items-center gap-3 select-none ${
        isMe
          ? 'bg-white/15 text-white border border-white/20'
          : 'bg-slate-100 text-slate-900 border border-slate-200'
      }`}
    >
      <button
        type="button"
        onClick={togglePlay}
        className={`w-9 h-9 rounded-full flex items-center justify-center shadow-xs transition-transform active:scale-95 shrink-0 ${
          isMe ? 'bg-[#FFC72C] text-[#0B4F8A]' : 'bg-[#0B4F8A] text-white'
        }`}
      >
        {isPlaying ? (
          <Pause className="w-4 h-4 fill-current" />
        ) : (
          <Play className="w-4 h-4 fill-current ml-0.5" />
        )}
      </button>

      {/* Waveform visualizer */}
      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-1 h-5">
          {[40, 75, 55, 90, 30, 80, 100, 65, 45, 85, 70, 40, 95, 60, 80, 35, 70, 90, 50, 65].map(
            (height, i) => {
              const active = (i / 20) * 100 <= progress;
              return (
                <span
                  key={i}
                  style={{ height: `${height}%` }}
                  className={`w-1 rounded-full transition-all duration-150 ${
                    active
                      ? isMe
                        ? 'bg-[#FFC72C]'
                        : 'bg-[#0B4F8A]'
                      : isMe
                      ? 'bg-white/40'
                      : 'bg-slate-300'
                  }`}
                />
              );
            }
          )}
        </div>

        <div className="flex items-center justify-between text-[10px] font-mono">
          <span className={isMe ? 'text-sky-100' : 'text-slate-500'}>
            {isPlaying ? `0:${Math.floor((progress / 100) * 24).toString().padStart(2, '0')}` : 'Mensagem de voz'}
          </span>
          <span className={isMe ? 'text-sky-100' : 'text-slate-500'}>{duration}</span>
        </div>
      </div>
    </div>
  );
};

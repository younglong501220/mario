import React from 'react';
import { Volume2, VolumeX, Music, RotateCcw, Pause, Play, HelpCircle, Download } from 'lucide-react';

interface GameHUDProps {
  score: number;
  coins: number;
  lives: number;
  highScore: number;
  isMuted: boolean;
  bgmEnabled: boolean;
  isPaused: boolean;
  zone?: 'overworld' | 'underground';
  onToggleMute: () => void;
  onToggleBGM: () => void;
  onTogglePause: () => void;
  onRestart: () => void;
  onToggleHelp: () => void;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  score,
  coins,
  lives,
  highScore,
  isMuted,
  bgmEnabled,
  isPaused,
  zone = 'overworld',
  onToggleMute,
  onToggleBGM,
  onTogglePause,
  onRestart,
  onToggleHelp
}) => {
  const formattedScore = score.toString().padStart(6, '0');
  const formattedCoins = coins.toString().padStart(2, '0');

  return (
    <div className="w-full bg-neutral-900 border-b border-neutral-800 text-white font-mono px-3 py-2 select-none shadow-md">
      <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-between gap-2 text-sm md:text-base">
        {/* Left: Classic Stats */}
        <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
          <div>
            <div className="text-[11px] text-neutral-400 font-bold uppercase tracking-wider">MARIO</div>
            <div className="font-extrabold text-amber-400 tracking-wider text-base sm:text-lg">{formattedScore}</div>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-yellow-400 text-lg">🪙</span>
            <div>
              <div className="text-[11px] text-neutral-400 font-bold uppercase">COINS</div>
              <div className="font-extrabold text-white text-base sm:text-lg">x{formattedCoins}</div>
            </div>
          </div>

          <div>
            <div className="text-[11px] text-neutral-400 font-bold uppercase">WORLD</div>
            <div className="font-extrabold text-emerald-400 text-base sm:text-lg">
              {zone === 'underground' ? '1-1 BONUS' : '1-1'}
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-red-500 text-lg">❤️</span>
            <div>
              <div className="text-[11px] text-neutral-400 font-bold uppercase">LIVES</div>
              <div className="font-extrabold text-red-400 text-base sm:text-lg">x{lives}</div>
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="text-[11px] text-neutral-400 font-bold uppercase">HIGH SCORE</div>
            <div className="font-bold text-neutral-300 text-base">{highScore.toString().padStart(6, '0')}</div>
          </div>
        </div>

        {/* Right: Quick Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={onToggleMute}
            title={isMuted ? '開啟音效 (Unmute)' : '靜音 (Mute)'}
            className={`p-2 rounded-lg border transition-colors ${
              isMuted
                ? 'bg-neutral-800 text-neutral-500 border-neutral-700 hover:bg-neutral-700'
                : 'bg-neutral-800 text-amber-400 border-amber-500/40 hover:bg-neutral-700'
            }`}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={onToggleBGM}
            title={bgmEnabled ? '關閉背景音樂 (BGM Off)' : '開啟背景音樂 (BGM On)'}
            className={`p-2 rounded-lg border transition-colors ${
              bgmEnabled
                ? 'bg-neutral-800 text-emerald-400 border-emerald-500/40 hover:bg-neutral-700'
                : 'bg-neutral-800 text-neutral-500 border-neutral-700 hover:bg-neutral-700'
            }`}
          >
            <Music className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onTogglePause}
            title={isPaused ? '繼續 (Resume)' : '暫停 (Pause)'}
            className="p-2 rounded-lg bg-neutral-800 text-white border border-neutral-700 hover:bg-neutral-700 transition-colors"
          >
            {isPaused ? <Play className="w-4 h-4 text-emerald-400" /> : <Pause className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={onRestart}
            title="重新開始 (Restart Level)"
            className="p-2 rounded-lg bg-neutral-800 text-white border border-neutral-700 hover:bg-red-900/40 hover:text-red-300 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <a
            href="/mario.html"
            download="mario.html"
            title="下載單檔 mario.html (Download Single-File HTML)"
            className="p-2 rounded-lg bg-neutral-800 text-amber-300 border border-neutral-700 hover:bg-neutral-700 transition-colors flex items-center gap-1 text-xs font-mono"
          >
            <Download className="w-4 h-4" />
            <span className="hidden md:inline">.HTML</span>
          </a>

          <button
            type="button"
            onClick={onToggleHelp}
            title="操作說明 (Controls Guide)"
            className="p-2 rounded-lg bg-neutral-800 text-neutral-400 border border-neutral-700 hover:text-white hover:bg-neutral-700 transition-colors"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

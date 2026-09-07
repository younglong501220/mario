import React from 'react';
import { RotateCcw, Trophy, Skull, Play, X, ArrowLeft, ArrowRight, ArrowUp } from 'lucide-react';
import { GameState } from '../types';

interface OverlayModalProps {
  gameState: GameState;
  score: number;
  coins: number;
  highScore: number;
  onRestart: () => void;
  onResume: () => void;
  showHelp: boolean;
  onCloseHelp: () => void;
}

export const OverlayModal: React.FC<OverlayModalProps> = ({
  gameState,
  score,
  coins,
  highScore,
  onRestart,
  onResume,
  showHelp,
  onCloseHelp
}) => {
  if (showHelp) {
    return (
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-30">
        <div className="bg-neutral-900 border-2 border-neutral-700 text-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative font-sans">
          <button
            type="button"
            onClick={onCloseHelp}
            className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <h3 className="text-xl font-bold font-mono text-amber-400 mb-4 flex items-center gap-2">
            🎮 遊戲控制與玩法說明
          </h3>

          <div className="space-y-4 text-sm text-neutral-300">
            <div className="border border-neutral-800 rounded-xl p-3 bg-neutral-950/60">
              <div className="font-semibold text-white mb-2 flex items-center gap-1.5 font-mono">
                <span>鍵盤控制</span>
              </div>
              <ul className="space-y-1.5 text-xs text-neutral-300">
                <li className="flex items-center justify-between">
                  <span>左右移動：</span>
                  <kbd className="px-2 py-0.5 bg-neutral-800 rounded border border-neutral-700 font-mono text-amber-300">
                    ← / → 或 A / D
                  </kbd>
                </li>
                <li className="flex items-center justify-between">
                  <span>跳躍：</span>
                  <kbd className="px-2 py-0.5 bg-neutral-800 rounded border border-neutral-700 font-mono text-amber-300">
                    空白鍵 / ↑ / W
                  </kbd>
                </li>
                <li className="flex items-center justify-between">
                  <span>蹲下 / 鑽入水管：</span>
                  <kbd className="px-2 py-0.5 bg-neutral-800 rounded border border-neutral-700 font-mono text-emerald-400">
                    ↓ / S 或 水管鍵
                  </kbd>
                </li>
                <li className="flex items-center justify-between">
                  <span>加速衝刺：</span>
                  <kbd className="px-2 py-0.5 bg-neutral-800 rounded border border-neutral-700 font-mono text-amber-300">
                    Shift / J
                  </kbd>
                </li>
                <li className="flex items-center justify-between">
                  <span>暫停：</span>
                  <kbd className="px-2 py-0.5 bg-neutral-800 rounded border border-neutral-700 font-mono text-amber-300">
                    P 或 Esc
                  </kbd>
                </li>
              </ul>
            </div>

            <div className="border border-neutral-800 rounded-xl p-3 bg-neutral-950/60">
              <div className="font-semibold text-white mb-1.5 font-mono">經典機制</div>
              <ul className="space-y-1 text-xs text-neutral-400 list-disc list-inside">
                <li>踩踏敵人頭部可消滅小怪獲得 100 分。</li>
                <li>側面撞到怪物或掉入深坑會失去 1 條生命。</li>
                <li>頂擊【?】磚塊可獲取金幣或超級蘑菇！</li>
                <li>🍄 吃到蘑菇變身為超級瑪利歐（體型變大、抵禦 1 次傷害）。</li>
                <li>🟢 站在有箭頭標示的水管上按【↓】，可鑽進地下隱藏金幣密室！</li>
                <li>抵達終點拉下旗桿即可通關！</li>
              </ul>
            </div>
          </div>

          <button
            type="button"
            onClick={onCloseHelp}
            className="w-full mt-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-xl transition-colors font-mono"
          >
            我知道了，開始遊玩
          </button>
        </div>
      </div>
    );
  }

  if (gameState === 'PAUSED') {
    return (
      <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-20">
        <div className="bg-neutral-900/90 border border-neutral-700 text-white rounded-2xl p-6 max-w-xs w-full text-center shadow-2xl">
          <h3 className="text-2xl font-bold font-mono text-amber-400 mb-2 tracking-wider">PAUSED</h3>
          <p className="text-sm text-neutral-400 mb-6 font-mono">遊戲已暫停</p>
          <div className="flex flex-col gap-2.5 font-mono">
            <button
              type="button"
              onClick={onResume}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              <Play className="w-4 h-4" /> 繼續遊戲 (Resume)
            </button>
            <button
              type="button"
              onClick={onRestart}
              className="w-full py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors border border-neutral-700"
            >
              <RotateCcw className="w-4 h-4" /> 重新開始 (Restart)
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'GAMEOVER') {
    return (
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 z-20 animate-fade-in">
        <div className="bg-neutral-950 border-2 border-red-600/80 text-white rounded-2xl p-6 sm:p-8 max-w-sm w-full text-center shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-red-950/60 border border-red-500/40 text-red-400 flex items-center justify-center mx-auto mb-4">
            <Skull className="w-9 h-9" />
          </div>

          <h2 className="text-3xl font-extrabold font-mono text-red-500 mb-1 tracking-wider">GAME OVER</h2>
          <p className="text-sm text-neutral-400 mb-5 font-mono">很可惜，瑪利歐耗盡了所有生命！</p>

          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-3.5 mb-6 text-left font-mono space-y-1.5 text-sm">
            <div className="flex justify-between text-neutral-300">
              <span>最終分數:</span>
              <span className="text-amber-400 font-bold">{score}</span>
            </div>
            <div className="flex justify-between text-neutral-300">
              <span>收集金幣:</span>
              <span className="text-yellow-400 font-bold">{coins}</span>
            </div>
            <div className="flex justify-between text-neutral-300">
              <span>最高紀錄:</span>
              <span className="text-emerald-400 font-bold">{highScore}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={onRestart}
            className="w-full py-3 bg-red-600 hover:bg-red-500 active:scale-98 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all font-mono shadow-lg shadow-red-900/30 text-base"
          >
            <RotateCcw className="w-5 h-5" /> 再次挑戰 (Try Again)
          </button>
        </div>
      </div>
    );
  }

  if (gameState === 'WON') {
    return (
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 z-20 animate-fade-in">
        <div className="bg-neutral-950 border-2 border-yellow-500/80 text-white rounded-2xl p-6 sm:p-8 max-w-sm w-full text-center shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-amber-950/60 border border-yellow-500/40 text-yellow-400 flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-9 h-9 animate-bounce" />
          </div>

          <h2 className="text-3xl font-extrabold font-mono text-yellow-400 mb-1 tracking-wider">🎉 恭喜通關！</h2>
          <p className="text-sm text-neutral-400 mb-5 font-mono">COURSE CLEAR! 你成功抵達了終點！</p>

          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-3.5 mb-6 text-left font-mono space-y-1.5 text-sm">
            <div className="flex justify-between text-neutral-300">
              <span>通關得分:</span>
              <span className="text-amber-400 font-bold">{score}</span>
            </div>
            <div className="flex justify-between text-neutral-300">
              <span>金幣數量:</span>
              <span className="text-yellow-400 font-bold">{coins}</span>
            </div>
            <div className="flex justify-between text-neutral-300">
              <span>歷史最高:</span>
              <span className="text-emerald-400 font-bold">{highScore}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={onRestart}
            className="w-full py-3 bg-amber-500 hover:bg-amber-400 active:scale-98 text-neutral-950 font-extrabold rounded-xl flex items-center justify-center gap-2 transition-all font-mono shadow-lg shadow-amber-900/30 text-base"
          >
            <RotateCcw className="w-5 h-5" /> 再玩一次 (Play Again)
          </button>
        </div>
      </div>
    );
  }

  return null;
};

import React from 'react';
import { ArrowLeft, ArrowRight, ArrowDown, ArrowUp, Zap } from 'lucide-react';
import { ControlKeys } from '../types';

interface TouchControlsProps {
  onControlChange: (key: keyof ControlKeys, pressed: boolean) => void;
}

export const TouchControls: React.FC<TouchControlsProps> = ({ onControlChange }) => {
  const handleTouch = (key: keyof ControlKeys, isDown: boolean) => (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    onControlChange(key, isDown);
  };

  return (
    <div className="w-full flex items-center justify-between px-3 py-2 select-none touch-none bg-neutral-900/80 border-t border-neutral-800 backdrop-blur-sm sm:hidden">
      {/* D-Pad Left / Down / Right */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label="Move Left"
          onTouchStart={handleTouch('left', true)}
          onTouchEnd={handleTouch('left', false)}
          onMouseDown={handleTouch('left', true)}
          onMouseUp={handleTouch('left', false)}
          onMouseLeave={handleTouch('left', false)}
          className="w-13 h-13 rounded-xl bg-neutral-800 active:bg-neutral-700 border-2 border-neutral-600 flex items-center justify-center text-white shadow-lg active:scale-95 transition-transform"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        <button
          type="button"
          aria-label="Crouch / Enter Pipe"
          onTouchStart={handleTouch('down', true)}
          onTouchEnd={handleTouch('down', false)}
          onMouseDown={handleTouch('down', true)}
          onMouseUp={handleTouch('down', false)}
          onMouseLeave={handleTouch('down', false)}
          className="w-13 h-13 rounded-xl bg-neutral-800 active:bg-emerald-800 border-2 border-emerald-600/70 flex flex-col items-center justify-center text-emerald-400 shadow-lg active:scale-95 transition-transform"
          title="按下鑽入水管"
        >
          <ArrowDown className="w-5 h-5" />
          <span className="text-[8px] font-mono leading-none">水管</span>
        </button>

        <button
          type="button"
          aria-label="Move Right"
          onTouchStart={handleTouch('right', true)}
          onTouchEnd={handleTouch('right', false)}
          onMouseDown={handleTouch('right', true)}
          onMouseUp={handleTouch('right', false)}
          onMouseLeave={handleTouch('right', false)}
          className="w-13 h-13 rounded-xl bg-neutral-800 active:bg-neutral-700 border-2 border-neutral-600 flex items-center justify-center text-white shadow-lg active:scale-95 transition-transform"
        >
          <ArrowRight className="w-6 h-6" />
        </button>
      </div>

      {/* Action Buttons B (Run/Dash) & A (Jump) */}
      <div className="flex items-center gap-2.5">
        <button
          type="button"
          aria-label="Run / Sprint"
          onTouchStart={handleTouch('run', true)}
          onTouchEnd={handleTouch('run', false)}
          onMouseDown={handleTouch('run', true)}
          onMouseUp={handleTouch('run', false)}
          onMouseLeave={handleTouch('run', false)}
          className="w-12 h-12 rounded-full bg-amber-600 active:bg-amber-500 border-2 border-amber-400 flex flex-col items-center justify-center text-white font-bold shadow-lg active:scale-95 transition-transform"
        >
          <Zap className="w-4 h-4" />
          <span className="text-[9px] uppercase font-mono">B</span>
        </button>

        <button
          type="button"
          aria-label="Jump"
          onTouchStart={handleTouch('jump', true)}
          onTouchEnd={handleTouch('jump', false)}
          onMouseDown={handleTouch('jump', true)}
          onMouseUp={handleTouch('jump', false)}
          onMouseLeave={handleTouch('jump', false)}
          className="w-14 h-14 rounded-full bg-red-600 active:bg-red-500 border-2 border-red-400 flex flex-col items-center justify-center text-white font-bold shadow-xl active:scale-95 transition-transform"
        >
          <ArrowUp className="w-6 h-6 stroke-[3]" />
          <span className="text-[10px] uppercase font-mono">A</span>
        </button>
      </div>
    </div>
  );
};

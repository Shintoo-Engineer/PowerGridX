import React from 'react';
import { Zap, Network } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  light?: boolean;
  id?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', showTagline = false, light = false, id = 'powergridx-logo' }) => {
  const iconSize = size === 'sm' ? 18 : size === 'lg' ? 28 : 22;
  const textSize = size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-2xl' : 'text-xl';

  return (
    <div id={id} className="flex flex-col select-none">
      <div className="flex items-center gap-2">
        <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-600 shadow-sm shadow-emerald-500/20 text-white">
          <Zap size={iconSize} className="text-amber-300 fill-amber-300 transform -rotate-12" />
          <span className="absolute -top-1 -right-1 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
          </span>
        </div>
        <div className="flex items-baseline">
          <span className={`font-bold tracking-tight ${textSize} ${light ? 'text-white' : 'text-slate-900'}`}>
            PowerGrid
          </span>
          <span className={`font-extrabold tracking-tight ${textSize} text-emerald-600`}>
            X
          </span>
        </div>
      </div>
      {showTagline && (
        <span className={`text-[11px] font-medium tracking-wide mt-0.5 ${light ? 'text-slate-300' : 'text-slate-500'}`}>
          Trade Surplus • Power Communities • Smarter Grid
        </span>
      )}
    </div>
  );
};

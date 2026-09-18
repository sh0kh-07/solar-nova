import React from 'react';

export interface SolarNovaLogoProps {
  variant?: 'full' | 'mark-only' | 'compact';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  lightText?: boolean;
}

const LOGO_SRC = '/solar_nova_logo.jpg';

export const SolarNovaLogo: React.FC<SolarNovaLogoProps> = ({
  variant = 'full',
  size = 'md',
  className = '',
  lightText = false
}) => {
  const sizeConfig = {
    sm: { imgSize: 'w-8 h-8', textSize: 'text-base', subSize: 'text-[9px]', badgeSize: 'p-0.5' },
    md: { imgSize: 'w-11 h-11', textSize: 'text-xl', subSize: 'text-[10px]', badgeSize: 'p-1' },
    lg: { imgSize: 'w-16 h-16', textSize: 'text-2xl', subSize: 'text-xs', badgeSize: 'p-1.5' },
    xl: { imgSize: 'w-24 h-24', textSize: 'text-3xl', subSize: 'text-sm', badgeSize: 'p-2' }
  }[size];

  // Visual Emblem Badge with the Solar Nova logo image
  const LogoMark = (
    <div
      className={`relative ${sizeConfig.imgSize} rounded-xl bg-gradient-to-br from-white via-slate-50 to-slate-100 shadow-md border border-white/60 p-0.5 flex items-center justify-center overflow-hidden shrink-0 group transition-transform duration-200 hover:scale-105`}
    >
      <img
        src={LOGO_SRC}
        alt="Solar Nova Logo"
        referrerPolicy="no-referrer"
        className="w-full h-full object-contain rounded-lg drop-shadow-xs"
      />
      {/* Subtle shine reflection overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent pointer-events-none rounded-lg" />
    </div>
  );

  if (variant === 'mark-only') {
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        {LogoMark}
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {LogoMark}
      <div className="flex flex-col leading-tight select-none">
        {/* Main Brand Title: Solar Nova */}
        <div className="flex items-center gap-1.5 tracking-tight">
          <span className="font-black text-xl tracking-tight bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 bg-clip-text text-transparent drop-shadow-2xs">
            Solar
          </span>
          <span className="font-black text-xl tracking-tight bg-gradient-to-r from-sky-400 via-blue-600 to-indigo-700 bg-clip-text text-transparent drop-shadow-2xs">
            Nova
          </span>
        </div>

        {/* Tagline / Industry Descriptor */}
        <div className="flex items-center gap-1.5 mt-0.5">
          <span
            className={`h-[1px] w-2.5 ${lightText ? 'bg-amber-400/50' : 'bg-orange-300'}`}
          />
          <span
            className={`text-[9.5px] font-extrabold uppercase tracking-[0.16em] ${
              lightText ? 'text-slate-300' : 'text-slate-600'
            }`}
          >
            Solar Energy Systems
          </span>
          <span
            className={`h-[1px] w-2.5 ${lightText ? 'bg-sky-400/50' : 'bg-blue-300'}`}
          />
        </div>
      </div>
    </div>
  );
};

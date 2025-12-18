import React from 'react';

interface LogoProps {
  size?: number;
  className?: string;
}

export default function Logo({ size = 40, className = '' }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Background Circle */}
      <circle cx="50" cy="50" r="48" fill="#9333ea" />
      
      {/* Hexagon Shape */}
      <path
        d="M50 20L70 35V65L50 80L30 65V35L50 20Z"
        fill="white"
        fillOpacity="0.15"
        stroke="white"
        strokeWidth="2"
      />
      
      {/* Inner Diamond */}
      <path
        d="M50 35L60 50L50 65L40 50L50 35Z"
        fill="white"
        fillOpacity="0.25"
      />
      
      {/* S Letter */}
      <path
        d="M44 42C44 42 42 42 42 44C42 46 44 46 46 47C48 48 52 48 52 51C52 54 49 54 47 54C45 54 44 53 44 51M47 40V42M47 54V56"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      
      {/* NFT Dots */}
      <circle cx="56" cy="44" r="2" fill="white" />
      <circle cx="56" cy="50" r="2" fill="white" />
      <circle cx="56" cy="56" r="2" fill="white" />
    </svg>
  );
}

// Alternative logo version with just the icon (no text)
export function LogoIcon({ size = 40, className = '' }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Rounded Square Background */}
      <rect x="10" y="10" width="80" height="80" rx="20" fill="#9333ea" />
      
      {/* Geometric NFT Symbol */}
      <path
        d="M50 25L70 40V60L50 75L30 60V40L50 25Z"
        fill="white"
        fillOpacity="0.2"
        stroke="white"
        strokeWidth="2.5"
      />
      
      {/* Center Diamond */}
      <path
        d="M50 35L62 50L50 65L38 50L50 35Z"
        fill="white"
        fillOpacity="0.3"
      />
      
      {/* Stylized S */}
      <text
        x="50"
        y="60"
        fontSize="32"
        fontWeight="bold"
        fill="white"
        textAnchor="middle"
        fontFamily="system-ui, -apple-system, sans-serif"
      >
        S
      </text>
    </svg>
  );
}

// Full logo with text
export function LogoWithText({ height = 40, className = '' }: { height?: number; className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <LogoIcon size={height} />
      <div className="flex flex-col leading-none">
        <span className="text-2xl font-bold text-white">SNFT</span>
        <span className="text-xs text-gray-400 tracking-wider">MARKETPLACE</span>
      </div>
    </div>
  );
}

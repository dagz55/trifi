import React from 'react'

export function TriFiLogo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00D4FF" />
          <stop offset="33%" stopColor="#5B73FF" />
          <stop offset="66%" stopColor="#9333EA" />
          <stop offset="100%" stopColor="#FF4545" />
        </linearGradient>
        <linearGradient id="gradient2" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#00D4FF" />
          <stop offset="50%" stopColor="#5B73FF" />
          <stop offset="100%" stopColor="#9333EA" />
        </linearGradient>
        <linearGradient id="gradient3" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#9333EA" />
          <stop offset="100%" stopColor="#FF4545" />
        </linearGradient>
      </defs>
      
      {/* Outer triangle */}
      <path
        d="M50 5 L90 80 L10 80 Z"
        fill="url(#gradient1)"
        opacity="0.9"
      />
      
      {/* Middle triangle */}
      <path
        d="M50 15 L80 70 L20 70 Z"
        fill="url(#gradient2)"
        opacity="0.8"
      />
      
      {/* Inner triangle */}
      <path
        d="M50 25 L70 60 L30 60 Z"
        fill="url(#gradient3)"
        opacity="0.7"
      />
      
      {/* Center void */}
      <circle
        cx="50"
        cy="50"
        r="8"
        fill="currentColor"
        opacity="0.1"
      />
    </svg>
  )
} 
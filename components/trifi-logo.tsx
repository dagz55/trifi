import React from 'react'

interface TriFiLogoProps {
  className?: string
  variant?: 'default' | 'monochrome' | 'minimal' | 'icon-only'
  showText?: boolean
}

export function TriFiLogo({ 
  className = "w-8 h-8", 
  variant = 'default',
  showText = false 
}: TriFiLogoProps) {
  
  // Modern fintech color palette
  const gradients = {
    default: {
      primary: { start: '#3B82F6', mid: '#8B5CF6', end: '#EC4899' }, // Blue to Purple to Pink
      secondary: { start: '#06B6D4', mid: '#3B82F6', end: '#8B5CF6' }, // Cyan to Blue to Purple
      accent: { start: '#10B981', mid: '#06B6D4', end: '#3B82F6' }, // Green to Cyan to Blue
    },
    monochrome: {
      primary: { start: '#64748B', mid: '#475569', end: '#334155' },
      secondary: { start: '#94A3B8', mid: '#64748B', end: '#475569' },
      accent: { start: '#CBD5E1', mid: '#94A3B8', end: '#64748B' },
    }
  }
  
  const colors = variant === 'monochrome' ? gradients.monochrome : gradients.default
  
  const logoIcon = (
    <svg
      className={showText ? "w-10 h-10" : className}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Enhanced gradients for modern fintech look */}
        <linearGradient id={`trifi-gradient1-${variant}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={colors.primary.start} />
          <stop offset="50%" stopColor={colors.primary.mid} />
          <stop offset="100%" stopColor={colors.primary.end} />
        </linearGradient>
        <linearGradient id={`trifi-gradient2-${variant}`} x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={colors.secondary.start} />
          <stop offset="50%" stopColor={colors.secondary.mid} />
          <stop offset="100%" stopColor={colors.secondary.end} />
        </linearGradient>
        <linearGradient id={`trifi-gradient3-${variant}`} x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor={colors.accent.start} />
          <stop offset="100%" stopColor={colors.accent.end} />
        </linearGradient>
        {/* Modern filter effects */}
        <filter id={`glow-${variant}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/> 
          </feMerge>
        </filter>
      </defs>
      
      {variant === 'minimal' ? (
        // Simplified single triangle for minimal variant
        <>
          <path
            d="M60 15 L95 85 L25 85 Z"
            fill={`url(#trifi-gradient1-${variant})`}
            opacity="0.9"
          />
          <circle
            cx="60"
            cy="60"
            r="12"
            fill="white"
            opacity="0.9"
          />
          <circle
            cx="60"
            cy="60"
            r="6"
            fill={colors.primary.mid}
            opacity="0.8"
          />
        </>
      ) : (
        // Full logo design
        <>
          {/* Outer triangle - represents stability and growth */}
          <path
            d="M60 8 L105 90 L15 90 Z"
            fill={`url(#trifi-gradient1-${variant})`}
            opacity="0.85"
            filter={variant === 'default' ? `url(#glow-${variant})` : undefined}
          />
          {/* Middle triangle - represents innovation */}
          <path
            d="M60 20 L90 75 L30 75 Z"
            fill={`url(#trifi-gradient2-${variant})`}
            opacity="0.8"
          />
          {/* Inner triangle - represents precision */}
          <path
            d="M60 32 L78 65 L42 65 Z"
            fill={`url(#trifi-gradient3-${variant})`}
            opacity="0.75"
          />
          {/* Center circle - represents focus and clarity */}
          <circle
            cx="60"
            cy="55"
            r="10"
            fill="white"
            opacity="0.95"
          />
          {/* Inner focus point */}
          <circle
            cx="60"
            cy="55"
            r="4"
            fill={colors.primary.mid}
            opacity="0.8"
          />
        </>
      )}
  </svg>
  )
  
  if (!showText) {
    return logoIcon
  }
  
  return (
    <div className="flex items-center gap-3">
      {logoIcon}
      <div className="flex flex-col">
        <span className="text-xl font-bold bg-gradient-to-r from-fintech-primary to-fintech-accent bg-clip-text text-transparent">
          TriFi
        </span>
        <span className="text-xs text-muted-foreground font-medium tracking-wide">
          Financial Platform
        </span>
      </div>
    </div>
  )
}

// Simplified icon variant for very small sizes
export function TriFiIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 60 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="icon-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#8B5CF6" />
        </linearGradient>
      </defs>
      <path
        d="M30 5 L50 40 L10 40 Z"
        fill="url(#icon-gradient)"
      />
      <circle
        cx="30"
        cy="30"
        r="6"
        fill="white"
      />
      <circle
        cx="30"
        cy="30"
        r="2"
        fill="#3B82F6"
      />
    </svg>
  )
}
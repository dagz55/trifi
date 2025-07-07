'use client';

import type { HTMLAttributes } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GradientButtonProps extends HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  width?: string;
  height?: string;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'ocean' | 'sunset';
  size?: 'sm' | 'md' | 'lg';
  animation?: 'spin' | 'pulse' | 'glow' | 'none';
}

const GradientButton = ({
  children,
  width,
  height,
  className = '',
  onClick,
  disabled = false,
  variant = 'primary',
  size = 'md',
  animation = 'glow',
  ...props
}: GradientButtonProps) => {
  const variantStyles = {
    primary: {
      gradient: 'bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600',
      animatedGradient: 'bg-[conic-gradient(from_90deg_at_50%_50%,#3B82F6_0%,#8B5CF6_50%,#3B82F6_100%)]',
      text: 'text-white',
      glow: 'shadow-[0_0_20px_#3B82F6,0_0_40px_#8B5CF6,0_0_60px_#3B82F6]'
    },
    secondary: {
      gradient: 'bg-gradient-to-r from-gray-600 via-gray-700 to-gray-600',
      animatedGradient: 'bg-[conic-gradient(from_90deg_at_50%_50%,#4B5563_0%,#374151_50%,#4B5563_100%)]',
      text: 'text-white',
      glow: 'shadow-[0_0_20px_#4B5563,0_0_40px_#374151,0_0_60px_#4B5563]'
    },
    success: {
      gradient: 'bg-gradient-to-r from-green-500 via-emerald-600 to-green-500',
      animatedGradient: 'bg-[conic-gradient(from_90deg_at_50%_50%,#10B981_0%,#059669_50%,#10B981_100%)]',
      text: 'text-white',
      glow: 'shadow-[0_0_20px_#10B981,0_0_40px_#059669,0_0_60px_#10B981]'
    },
    danger: {
      gradient: 'bg-gradient-to-r from-red-500 via-pink-600 to-red-500',
      animatedGradient: 'bg-[conic-gradient(from_90deg_at_50%_50%,#EF4444_0%,#DC2626_50%,#EF4444_100%)]',
      text: 'text-white',
      glow: 'shadow-[0_0_20px_#EF4444,0_0_40px_#DC2626,0_0_60px_#EF4444]'
    },
    warning: {
      gradient: 'bg-gradient-to-r from-yellow-500 via-orange-600 to-yellow-500',
      animatedGradient: 'bg-[conic-gradient(from_90deg_at_50%_50%,#F59E0B_0%,#EA580C_50%,#F59E0B_100%)]',
      text: 'text-white',
      glow: 'shadow-[0_0_20px_#F59E0B,0_0_40px_#EA580C,0_0_60px_#F59E0B]'
    },
    ocean: {
      gradient: 'bg-gradient-to-r from-cyan-500 via-blue-600 to-cyan-500',
      animatedGradient: 'bg-[conic-gradient(from_90deg_at_50%_50%,#06B6D4_0%,#2563EB_50%,#06B6D4_100%)]',
      text: 'text-white',
      glow: 'shadow-[0_0_20px_#06B6D4,0_0_40px_#2563EB,0_0_60px_#06B6D4]'
    },
    sunset: {
      gradient: 'bg-gradient-to-r from-orange-500 via-red-600 to-pink-600',
      animatedGradient: 'bg-[conic-gradient(from_90deg_at_50%_50%,#F97316_0%,#DC2626_50%,#EC4899_100%)]',
      text: 'text-white',
      glow: 'shadow-[0_0_20px_#F97316,0_0_40px_#DC2626,0_0_60px_#EC4899]'
    }
  };

  const sizeStyles = {
    sm: {
      padding: 'px-4 py-2',
      text: 'text-sm',
      minWidth: '120px',
      height: '36px'
    },
    md: {
      padding: 'px-6 py-3',
      text: 'text-base',
      minWidth: '160px',
      height: '44px'
    },
    lg: {
      padding: 'px-8 py-4',
      text: 'text-lg',
      minWidth: '200px',
      height: '52px'
    }
  };

  const animationClasses = {
    spin: 'animate-[spin_4s_linear_infinite]',
    pulse: 'animate-pulse',
    glow: 'animate-[glow_2s_ease-in-out_infinite_alternate]',
    none: ''
  };

  const currentVariant = variantStyles[variant];
  const currentSize = sizeStyles[size];

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick?.();
    }
  };

  // Separate motion props from HTML props
  const { 
    onDrag, 
    onDragEnd, 
    onDragStart,
    onAnimationStart,
    onAnimationEnd,
    onAnimationIteration,
    onTransitionEnd,
    ...htmlProps 
  } = props;

  return (
    <>
      <style jsx>{`
        @keyframes glow {
          from {
            filter: brightness(1) saturate(1);
          }
          to {
            filter: brightness(1.2) saturate(1.3);
          }
        }
      `}</style>
      
      <motion.div
        role="button"
        tabIndex={disabled ? -1 : 0}
        className={cn(
          "relative rounded-xl cursor-pointer overflow-hidden group",
          "transition-all duration-300 ease-out",
          "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-transparent",
          disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95',
          className
        )}
        style={{
          minWidth: width || currentSize.minWidth,
          height: height || currentSize.height
        }}
        onClick={disabled ? undefined : onClick}
        onKeyDown={handleKeyDown}
        aria-disabled={disabled}
        whileHover={disabled ? {} : { scale: 1.05 }}
        whileTap={disabled ? {} : { scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        {...htmlProps}
      >
        {/* Animated background */}
        <div className={cn(
          "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500",
          currentVariant.animatedGradient,
          animationClasses[animation]
        )} />
        
        {/* Static background */}
        <div className={cn(
          "absolute inset-0 group-hover:opacity-0 transition-opacity duration-500",
          currentVariant.gradient
        )} />

        {/* Glow effect */}
        <div className={cn(
          "absolute inset-0 opacity-0 group-hover:opacity-50 transition-all duration-500 blur-sm",
          currentVariant.gradient,
          animation === 'glow' ? 'animate-[glow_2s_ease-in-out_infinite_alternate]' : ''
        )} />

        {/* Shine effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
        </div>

        {/* Content */}
        <div className={cn(
          "relative z-10 flex items-center justify-center h-full",
          currentSize.padding,
          currentSize.text,
          currentVariant.text,
          "font-semibold tracking-wide",
          "transition-all duration-300",
          "drop-shadow-sm"
        )}>
          {children}
        </div>
      </motion.div>
    </>
  );
};

export default GradientButton; 
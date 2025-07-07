"use client"

import { useState, useEffect } from "react"
import { Moon, Sun } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"

interface PremiumThemeToggleProps {
  className?: string
  variant?: "nav" | "standalone"
}

export function PremiumThemeToggle({ 
  className,
  variant = "standalone"
}: PremiumThemeToggleProps) {
  const { theme, setTheme } = useTheme()
  const [isDark, setIsDark] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([])

  // Ensure component is mounted to avoid hydration issues
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) {
      setIsDark(theme === 'dark')
    }
  }, [theme, mounted])

  const handleToggle = (e: React.MouseEvent) => {
    const newTheme = isDark ? 'light' : 'dark'
    setTheme(newTheme)
    setIsDark(!isDark)

    // Create ripple effect
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const newRipple = { id: Date.now(), x, y }
    
    setRipples(prev => [...prev, newRipple])
    
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== newRipple.id))
    }, 600)
  }

  if (!mounted) {
    return null
  }

  // Navigation variant - more compact
  if (variant === "nav") {
    return (
      <motion.button
        className={cn(
          "relative flex items-center justify-center w-10 h-10 rounded-xl cursor-pointer transition-all duration-300 overflow-hidden",
          "hover:shadow-lg active:scale-95",
          isDark 
            ? "bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 hover:border-gray-600" 
            : "bg-gradient-to-br from-white to-gray-50 border border-gray-200 hover:border-gray-300 shadow-sm",
          className
        )}
        onClick={handleToggle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Toggle theme"
      >
        {/* Background pattern overlay */}
        <div 
          className={cn(
            "absolute inset-0 opacity-10 transition-opacity duration-300",
            isDark ? "opacity-5" : "opacity-15"
          )}
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, ${isDark ? 'rgba(148, 163, 184, 0.2)' : 'rgba(59, 130, 246, 0.2)'} 1px, transparent 0)`,
            backgroundSize: '8px 8px'
          }}
        />

        {/* Ripple effects */}
        <AnimatePresence>
          {ripples.map((ripple) => (
            <motion.div
              key={ripple.id}
              className="absolute rounded-full pointer-events-none"
              style={{
                left: ripple.x - 10,
                top: ripple.y - 10,
                width: 20,
                height: 20,
              }}
              initial={{ 
                scale: 0, 
                opacity: 0.6,
                background: isDark 
                  ? 'radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, transparent 70%)'
                  : 'radial-gradient(circle, rgba(245, 158, 11, 0.4) 0%, transparent 70%)'
              }}
              animate={{ 
                scale: 2, 
                opacity: 0 
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          ))}
        </AnimatePresence>

        {/* Icon container with smooth transition */}
        <div className="relative w-5 h-5 z-10">
          <AnimatePresence mode="wait">
            {isDark ? (
              <motion.div
                key="moon"
                initial={{ opacity: 0, rotate: -90, scale: 0.8 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 90, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <Moon 
                  className="w-4 h-4 text-blue-300"
                  strokeWidth={2}
                />
              </motion.div>
            ) : (
              <motion.div
                key="sun"
                initial={{ opacity: 0, rotate: -90, scale: 0.8 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 90, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <Sun 
                  className="w-4 h-4 text-amber-500"
                  strokeWidth={2}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Subtle glow effect */}
        <motion.div
          className={cn(
            "absolute inset-0 rounded-xl transition-all duration-300",
            isDark 
              ? "bg-gradient-to-br from-blue-500/10 to-purple-500/10" 
              : "bg-gradient-to-br from-amber-400/20 to-orange-400/20"
          )}
          animate={{
            opacity: isHovered ? 0.8 : 0,
          }}
          transition={{ duration: 0.3 }}
        />
      </motion.button>
    )
  }

  // Standalone variant - full size toggle
  return (
    <motion.div
      className={cn(
        "relative flex items-center w-20 h-10 p-1 rounded-full cursor-pointer transition-all duration-500 overflow-hidden",
        "shadow-lg hover:shadow-xl",
        isDark 
          ? "bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700" 
          : "bg-gradient-to-r from-blue-50 via-white to-blue-50 border border-blue-200",
        className
      )}
      onClick={handleToggle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleToggle(e as any)
        }
      }}
    >
      {/* Background pattern overlay */}
      <div 
        className={cn(
          "absolute inset-0 opacity-20 transition-opacity duration-500",
          isDark ? "opacity-10" : "opacity-30"
        )}
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, ${isDark ? 'rgba(148, 163, 184, 0.3)' : 'rgba(59, 130, 246, 0.3)'} 1px, transparent 0)`,
          backgroundSize: '12px 12px'
        }}
      />

      {/* Ripple effects */}
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.div
            key={ripple.id}
            className="absolute rounded-full pointer-events-none"
            style={{
              left: ripple.x - 15,
              top: ripple.y - 15,
              width: 30,
              height: 30,
            }}
            initial={{ 
              scale: 0, 
              opacity: 0.6,
              background: isDark 
                ? 'radial-gradient(circle, rgba(148, 163, 184, 0.4) 0%, transparent 70%)'
                : 'radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, transparent 70%)'
            }}
            animate={{ 
              scale: 2, 
              opacity: 0 
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        ))}
      </AnimatePresence>

      {/* Ambient glow effect */}
      <motion.div
        className={cn(
          "absolute inset-0 rounded-full blur-sm transition-all duration-500",
          isDark 
            ? "bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20" 
            : "bg-gradient-to-r from-yellow-400/30 via-orange-400/30 to-yellow-400/30"
        )}
        animate={{
          opacity: isHovered ? 0.8 : 0.4,
          scale: isHovered ? 1.1 : 1,
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Toggle track with gradient */}
      <div className="relative flex justify-between items-center w-full h-full">
        {/* Sliding button */}
        <motion.div
          className={cn(
            "absolute flex justify-center items-center w-8 h-8 rounded-full shadow-lg z-10",
            "backdrop-blur-sm border transition-all duration-500",
            isDark 
              ? "bg-gradient-to-br from-slate-700 via-slate-600 to-slate-700 border-slate-500 shadow-slate-900/50" 
              : "bg-gradient-to-br from-white via-blue-50 to-white border-blue-300 shadow-blue-900/20"
          )}
          animate={{
            x: isDark ? 0 : 44,
            rotate: isDark ? 0 : 180,
          }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 25,
            duration: 0.5 
          }}
          whileHover={{ scale: 1.05 }}
        >
          {/* Icon container with smooth transition */}
          <div className="relative w-5 h-5">
            <AnimatePresence mode="wait">
              {isDark ? (
                <motion.div
                  key="moon"
                  initial={{ opacity: 0, rotate: -90, scale: 0.8 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: 90, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <Moon 
                    className="w-4 h-4 text-blue-300"
                    strokeWidth={2}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="sun"
                  initial={{ opacity: 0, rotate: -90, scale: 0.8 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: 90, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <Sun 
                    className="w-4 h-4 text-orange-500"
                    strokeWidth={2}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Background icons with subtle animation */}
        <motion.div
          className="absolute left-2 flex items-center justify-center w-6 h-6"
          animate={{
            opacity: isDark ? 0.6 : 0.3,
            scale: isDark ? 1 : 0.9,
          }}
          transition={{ duration: 0.5 }}
        >
          <Moon 
            className={cn(
              "w-4 h-4 transition-colors duration-500",
              isDark ? "text-blue-300" : "text-slate-400"
            )}
            strokeWidth={1.5}
          />
        </motion.div>

        <motion.div
          className="absolute right-2 flex items-center justify-center w-6 h-6"
          animate={{
            opacity: isDark ? 0.3 : 0.6,
            scale: isDark ? 0.9 : 1,
          }}
          transition={{ duration: 0.5 }}
        >
          <Sun 
            className={cn(
              "w-4 h-4 transition-colors duration-500",
              isDark ? "text-slate-500" : "text-orange-400"
            )}
            strokeWidth={1.5}
          />
        </motion.div>
      </div>

      {/* Financial-grade security indicator */}
      <motion.div
        className={cn(
          "absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 transition-all duration-500",
          isDark 
            ? "bg-green-400 border-slate-800" 
            : "bg-green-500 border-white",
          "shadow-sm"
        )}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.7, 1, 0.7],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </motion.div>
  )
} 
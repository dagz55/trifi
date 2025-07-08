'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion'
import { TrendingUp, TrendingDown, DollarSign, BarChart3, PieChart, Activity, ArrowUpRight, ArrowDownRight, Zap, Shield, Globe } from 'lucide-react'

interface FloatingElementProps {
  children: React.ReactNode
  delay?: number
  duration?: number
  className?: string
}

const FloatingElement: React.FC<FloatingElementProps> = ({ 
  children, 
  delay = 0, 
  duration = 4,
  className = ""
}) => {
  return (
    <motion.div
      className={className}
      initial={{ y: 0, opacity: 0 }}
      animate={{ 
        y: [0, -20, 0],
        opacity: [0, 1, 1]
      }}
      transition={{
        y: {
          duration,
          repeat: Infinity,
          ease: "easeInOut",
          delay
        },
        opacity: {
          duration: 0.8,
          delay
        }
      }}
    >
      {children}
    </motion.div>
  )
}

interface ChartDataPoint {
  value: number
  label: string
}

interface AnimatedChartProps {
  data: ChartDataPoint[]
  height?: number
  className?: string
}

const AnimatedChart: React.FC<AnimatedChartProps> = ({ 
  data, 
  height = 120,
  className = ""
}) => {
  const maxValue = Math.max(...data.map(d => d.value))
  
  return (
    <div className={`flex items-end justify-between gap-2 ${className}`} style={{ height }}>
      {data.map((point, index) => {
        const barHeight = (point.value / maxValue) * height * 0.8
        
        return (
          <motion.div
            key={index}
            className="flex flex-col items-center gap-1"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: barHeight, opacity: 1 }}
            transition={{ 
              duration: 1.5, 
              delay: index * 0.1,
              ease: "easeOut"
            }}
          >
            <motion.div
              className="bg-gradient-to-t from-blue-500 to-cyan-400 rounded-t-sm min-w-[8px]"
              style={{ height: barHeight }}
              whileHover={{ scale: 1.1 }}
            />
            <span className="text-xs text-muted-foreground">{point.label}</span>
          </motion.div>
        )
      })}
    </div>
  )
}

interface MetricCardProps {
  title: string
  value: string
  change: string
  trend: 'up' | 'down'
  icon: React.ReactNode
  delay?: number
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  change, 
  trend, 
  icon,
  delay = 0
}) => {
  return (
    <motion.div
      className="bg-background/80 backdrop-blur-sm border border-border rounded-xl p-4 shadow-lg"
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ 
        scale: 1.02,
        boxShadow: "0 10px 25px rgba(0,0,0,0.1)"
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="text-muted-foreground">{icon}</div>
        <div className={`flex items-center gap-1 text-sm ${
          trend === 'up' ? 'text-green-500' : 'text-red-500'
        }`}>
          {trend === 'up' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
          {change}
        </div>
      </div>
      <div className="text-2xl font-bold text-foreground">{value}</div>
      <div className="text-sm text-muted-foreground">{title}</div>
    </motion.div>
  )
}

const PulsingOrb: React.FC<{ className?: string; delay?: number }> = ({ 
  className = "", 
  delay = 0 
}) => {
  return (
    <motion.div
      className={`absolute rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 ${className}`}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ 
        scale: [0, 1.2, 1],
        opacity: [0, 0.6, 0.3]
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        delay,
        ease: "easeInOut"
      }}
    />
  )
}

const GridPattern: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      />
    </div>
  )
}

interface FinancialHeroSectionProps {
  onWatchDemo?: () => void
}

const FinancialHeroSection: React.FC<FinancialHeroSectionProps> = ({ onWatchDemo }) => {
  const [activeMetric, setActiveMetric] = useState(0)
  
  const chartData: ChartDataPoint[] = [
    { value: 65, label: 'Jan' },
    { value: 78, label: 'Feb' },
    { value: 82, label: 'Mar' },
    { value: 95, label: 'Apr' },
    { value: 88, label: 'May' },
    { value: 92, label: 'Jun' }
  ]

  const metrics = [
    {
      title: 'Total Revenue',
      value: '$2.4M',
      change: '+12.5%',
      trend: 'up' as const,
      icon: <DollarSign size={20} />
    },
    {
      title: 'Active Users',
      value: '48.2K',
      change: '+8.2%',
      trend: 'up' as const,
      icon: <Activity size={20} />
    },
    {
      title: 'Portfolio Growth',
      value: '+24.8%',
      change: '+3.1%',
      trend: 'up' as const,
      icon: <TrendingUp size={20} />
    }
  ]

  // Animated background gradient
  const color = useMotionValue("#3b82f6")
  
  useEffect(() => {
    animate(color, ["#3b82f6", "#8b5cf6", "#06b6d4", "#3b82f6"], {
      duration: 8,
      repeat: Infinity,
      ease: "easeInOut"
    })
  }, [color])

  const backgroundGradient = useTransform(
    color,
    (latest) => `radial-gradient(circle at 50% 50%, ${latest}15 0%, transparent 50%)`
  )

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated Background */}
      <motion.div 
        className="absolute inset-0"
        style={{ background: backgroundGradient }}
      />
      
      {/* Grid Pattern */}
      <GridPattern />
      
      {/* Floating Orbs */}
      <PulsingOrb className="w-96 h-96 top-10 -right-48" delay={0} />
      <PulsingOrb className="w-64 h-64 bottom-20 -left-32" delay={2} />
      <PulsingOrb className="w-48 h-48 top-1/2 right-1/4" delay={4} />

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Content */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Zap size={16} />
                Advanced Analytics Platform
              </motion.div>
              
              <h1 className="text-5xl lg:text-7xl font-bold text-foreground leading-tight">
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="block"
                >
                  Transform
                </motion.span>
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className="block bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent"
                >
                  Financial
                </motion.span>
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.7 }}
                  className="block"
                >
                  Data
                </motion.span>
              </h1>
              
              <motion.p
                className="text-xl text-muted-foreground leading-relaxed max-w-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.9 }}
              >
                Harness the power of AI-driven insights to make smarter investment decisions 
                and maximize your portfolio performance with real-time analytics.
              </motion.p>
            </motion.div>

            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.1 }}
            >
              <motion.button
                className="bg-primary text-primary-foreground px-8 py-4 rounded-xl font-semibold text-lg shadow-lg"
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)"
                }}
                whileTap={{ scale: 0.95 }}
              >
                Start Free Trial
              </motion.button>
              
              <motion.button
                className="border border-border text-foreground px-8 py-4 rounded-xl font-semibold text-lg hover:bg-muted/50 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onWatchDemo}
              >
                Watch Demo
              </motion.button>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              className="flex items-center gap-6 pt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.3 }}
            >
              <div className="flex items-center gap-2 text-muted-foreground">
                <Shield size={20} />
                <span className="text-sm">Bank-level Security</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Globe size={20} />
                <span className="text-sm">Global Markets</span>
              </div>
            </motion.div>
          </div>

          {/* Right Content - Dashboard Preview */}
          <div className="relative">
            <FloatingElement delay={0.5} className="relative z-10">
              <div className="bg-background/90 backdrop-blur-xl border border-border rounded-2xl p-6 shadow-2xl">
                
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-foreground">Portfolio Overview</h3>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-muted-foreground">Live</span>
                  </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  {metrics.map((metric, index) => (
                    <MetricCard
                      key={index}
                      {...metric}
                      delay={1.5 + index * 0.2}
                    />
                  ))}
                </div>

                {/* Chart */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-foreground">Performance Trend</h4>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <BarChart3 size={16} />
                      6 months
                    </div>
                  </div>
                  
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 2 }}
                  >
                    <AnimatedChart data={chartData} height={120} />
                  </motion.div>
                </div>
              </div>
            </FloatingElement>

            {/* Floating Elements */}
            <FloatingElement delay={1} className="absolute -top-4 -right-4 z-20">
              <div className="bg-green-500 text-white p-3 rounded-xl shadow-lg">
                <div className="flex items-center gap-2">
                  <TrendingUp size={20} />
                  <div>
                    <div className="text-sm font-semibold">+$12,450</div>
                    <div className="text-xs opacity-80">Today's Gain</div>
                  </div>
                </div>
              </div>
            </FloatingElement>

            <FloatingElement delay={2} className="absolute -bottom-6 -left-6 z-20">
              <div className="bg-blue-500 text-white p-3 rounded-xl shadow-lg">
                <div className="flex items-center gap-2">
                  <PieChart size={20} />
                  <div>
                    <div className="text-sm font-semibold">Portfolio</div>
                    <div className="text-xs opacity-80">Diversified</div>
                  </div>
                </div>
              </div>
            </FloatingElement>

            <FloatingElement delay={3} className="absolute top-1/2 -right-8 z-20">
              <div className="bg-purple-500 text-white p-3 rounded-xl shadow-lg">
                <div className="flex items-center gap-2">
                  <Activity size={20} />
                  <div>
                    <div className="text-sm font-semibold">AI Insights</div>
                    <div className="text-xs opacity-80">Active</div>
                  </div>
                </div>
              </div>
            </FloatingElement>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FinancialHeroSection
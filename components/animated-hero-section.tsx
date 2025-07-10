"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  BarChart3, 
  Zap, 
  ArrowUpRight, 
  ArrowDownRight,
  Eye,
  EyeOff,
  Activity,
  Wallet,
  PieChart,
  Globe,
  Shield,
  Smartphone,
  Play
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ModeToggle } from "@/components/mode-toggle";


interface ParticlesProps {
  className?: string;
  quantity?: number;
  staticity?: number;
  ease?: number;
  size?: number;
  refresh?: boolean;
  color?: string;
  vx?: number;
  vy?: number;
}

const Particles: React.FC<ParticlesProps> = ({
  className = "",
  quantity = 100,
  staticity = 50,
  ease = 50,
  size = 0.4,
  refresh = false,
  color = "#3B82F6",
  vx = 0,
  vy = 0,
}) => {
  const [particleColor, setParticleColor] = useState<string>(color);

  interface MousePosition {
    x: number;
    y: number;
  }

  const MousePosition = (): MousePosition => {
    const [mousePosition, setMousePosition] = useState<MousePosition>({
      x: 0,
      y: 0,
    });

    useEffect(() => {
      const handleMouseMove = (event: MouseEvent) => {
        setMousePosition({ x: event.clientX, y: event.clientY });
      };

      window.addEventListener("mousemove", handleMouseMove);

      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
      };
    }, []);

    return mousePosition;
  };

  const hexToRgb = (hex: string): number[] => {
    hex = hex.replace("#", "");
    const hexInt = parseInt(hex, 16);
    const red = (hexInt >> 16) & 255;
    const green = (hexInt >> 8) & 255;
    const blue = hexInt & 255;
    return [red, green, blue];
  };

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const context = useRef<CanvasRenderingContext2D | null>(null);
  const circles = useRef<any[]>([]);
  const mousePosition = MousePosition();
  const mouse = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const canvasSize = useRef<{ w: number; h: number }>({ w: 0, h: 0 });
  const dpr = typeof window !== "undefined" ? window.devicePixelRatio : 1;

  useEffect(() => {
    if (canvasRef.current) {
      context.current = canvasRef.current.getContext("2d");
    }
    initCanvas();
    animate();
    window.addEventListener("resize", initCanvas);

    return () => {
      window.removeEventListener("resize", initCanvas);
    };
  }, [particleColor]);

  useEffect(() => {
    onMouseMove();
  }, [mousePosition.x, mousePosition.y]);

  useEffect(() => {
    initCanvas();
  }, [refresh]);

  const initCanvas = () => {
    resizeCanvas();
    drawParticles();
  };

  const onMouseMove = () => {
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const { w, h } = canvasSize.current;
      const x = mousePosition.x - rect.left - w / 2;
      const y = mousePosition.y - rect.top - h / 2;
      const inside = x < w / 2 && x > -w / 2 && y < h / 2 && y > -h / 2;
      if (inside) {
        mouse.current.x = x;
        mouse.current.y = y;
      }
    }
  };

  type Circle = {
    x: number;
    y: number;
    translateX: number;
    translateY: number;
    size: number;
    alpha: number;
    targetAlpha: number;
    dx: number;
    dy: number;
    magnetism: number;
  };

  const resizeCanvas = () => {
    if (canvasContainerRef.current && canvasRef.current && context.current) {
      circles.current.length = 0;
      canvasSize.current.w = canvasContainerRef.current.offsetWidth;
      canvasSize.current.h = canvasContainerRef.current.offsetHeight;
      canvasRef.current.width = canvasSize.current.w * dpr;
      canvasRef.current.height = canvasSize.current.h * dpr;
      canvasRef.current.style.width = `${canvasSize.current.w}px`;
      canvasRef.current.style.height = `${canvasSize.current.h}px`;
      context.current.scale(dpr, dpr);
    }
  };

  const circleParams = (): Circle => {
    const x = Math.floor(Math.random() * canvasSize.current.w);
    const y = Math.floor(Math.random() * canvasSize.current.h);
    const translateX = 0;
    const translateY = 0;
    const pSize = Math.floor(Math.random() * 2) + size;
    const alpha = 0;
    const targetAlpha = parseFloat((Math.random() * 0.6 + 0.1).toFixed(1));
    const dx = (Math.random() - 0.5) * 0.1;
    const dy = (Math.random() - 0.5) * 0.1;
    const magnetism = 0.1 + Math.random() * 4;
    return {
      x,
      y,
      translateX,
      translateY,
      size: pSize,
      alpha,
      targetAlpha,
      dx,
      dy,
      magnetism,
    };
  };

  const rgb = hexToRgb(particleColor);

  const drawCircle = (circle: Circle, update = false) => {
    if (context.current) {
      const { x, y, translateX, translateY, size, alpha } = circle;
      context.current.translate(translateX, translateY);
      context.current.beginPath();
      context.current.arc(x, y, size, 0, 2 * Math.PI);
      context.current.fillStyle = `rgba(${rgb.join(", ")}, ${alpha})`;
      context.current.fill();
      context.current.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (!update) {
        circles.current.push(circle);
      }
    }
  };

  const clearContext = () => {
    if (context.current) {
      context.current.clearRect(
        0,
        0,
        canvasSize.current.w,
        canvasSize.current.h,
      );
    }
  };

  const drawParticles = () => {
    clearContext();
    const particleCount = quantity;
    for (let i = 0; i < particleCount; i++) {
      const circle = circleParams();
      drawCircle(circle);
    }
  };

  const remapValue = (
    value: number,
    start1: number,
    end1: number,
    start2: number,
    end2: number,
  ): number => {
    const remapped =
      ((value - start1) * (end2 - start2)) / (end1 - start1) + start2;
    return remapped > 0 ? remapped : 0;
  };

  const animate = () => {
    clearContext();
    circles.current.forEach((circle: Circle, i: number) => {
      const edge = [
        circle.x + circle.translateX - circle.size,
        canvasSize.current.w - circle.x - circle.translateX - circle.size,
        circle.y + circle.translateY - circle.size,
        canvasSize.current.h - circle.y - circle.translateY - circle.size,
      ];
      const closestEdge = edge.reduce((a, b) => Math.min(a, b));
      const remapClosestEdge = parseFloat(
        remapValue(closestEdge, 0, 20, 0, 1).toFixed(2),
      );
      if (remapClosestEdge > 1) {
        circle.alpha += 0.02;
        if (circle.alpha > circle.targetAlpha) {
          circle.alpha = circle.targetAlpha;
        }
      } else {
        circle.alpha = circle.targetAlpha * remapClosestEdge;
      }
      circle.x += circle.dx + vx;
      circle.y += circle.dy + vy;
      circle.translateX +=
        (mouse.current.x / (staticity / circle.magnetism) - circle.translateX) /
        ease;
      circle.translateY +=
        (mouse.current.y / (staticity / circle.magnetism) - circle.translateY) /
        ease;

      drawCircle(circle, true);

      if (
        circle.x < -circle.size ||
        circle.x > canvasSize.current.w + circle.size ||
        circle.y < -circle.size ||
        circle.y > canvasSize.current.h + circle.size
      ) {
        circles.current.splice(i, 1);
        const newCircle = circleParams();
        drawCircle(newCircle);
      }
    });
    window.requestAnimationFrame(animate);
  };

  return (
    <div className={className} ref={canvasContainerRef} aria-hidden="true">
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
};

interface FloatingElementProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}

const FloatingElement: React.FC<FloatingElementProps> = ({ 
  children, 
  delay = 0, 
  duration = 3,
  className = ""
}) => {
  return (
    <motion.div
      className={className}
      initial={{ y: 0, rotate: 0 }}
      animate={{ 
        y: [-10, 10, -10],
        rotate: [-2, 2, -2]
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      {children}
    </motion.div>
  );
};

interface ChartData {
  time: string;
  value: number;
}

const AnimatedChart: React.FC<{ data: ChartData[]; color: string; height?: number }> = ({ 
  data, 
  color, 
  height = 120 
}) => {
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    if (pathRef.current) {
      const path = pathRef.current;
      const length = path.getTotalLength();
      path.style.strokeDasharray = `${length}`;
      path.style.strokeDashoffset = `${length}`;
      
      const animation = path.animate([
        { strokeDashoffset: length },
        { strokeDashoffset: 0 }
      ], {
        duration: 2000,
        easing: 'ease-out',
        fill: 'forwards'
      });

      return () => animation.cancel();
    }
  }, [data]);

  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue;

  const points = data.map((point, index) => {
    const x = (index / (data.length - 1)) * 300;
    const y = height - ((point.value - minValue) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  const pathData = `M ${points.split(' ').map((point, index) => 
    index === 0 ? `M ${point}` : `L ${point}`
  ).join(' ')}`;

  return (
    <svg width="300" height={height} className="overflow-visible">
      <defs>
        <linearGradient id={`gradient-${color.replace('#', '')}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d={`${pathData} L 300,${height} L 0,${height} Z`}
        fill={`url(#gradient-${color.replace('#', '')})`}
      />
      <path
        ref={pathRef}
        d={pathData}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const AnimatedHeroSection: React.FC = () => {
  const [showBalance, setShowBalance] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  const portfolioData = {
    totalValue: 2847392.45,
    change24h: 12847.32,
    changePercent: 4.72
  };

  const chartData: ChartData[] = [
    { time: '00:00', value: 2834545.13 },
    { time: '04:00', value: 2841230.67 },
    { time: '08:00', value: 2838912.34 },
    { time: '12:00', value: 2845678.90 },
    { time: '16:00', value: 2843234.56 },
    { time: '20:00', value: 2847392.45 },
  ];

  const assets = [
    { name: 'Revenue', symbol: 'REV', value: 1247832.45, change: 5.23, allocation: 43.8 },
    { name: 'Expenses', symbol: 'EXP', value: 892341.67, change: -2.14, allocation: 31.3 },
    { name: 'Profit', symbol: 'PRT', value: 456789.12, change: 8.91, allocation: 16.0 },
    { name: 'Savings', symbol: 'SAV', value: 250429.21, change: 1.45, allocation: 8.9 }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const formatLargeNumber = (value: number) => {
    if (value >= 1e6) {
      return `₱${(value / 1e6).toFixed(2)}M`;
    } else if (value >= 1e3) {
      return `₱${(value / 1e3).toFixed(1)}K`;
    }
    return formatCurrency(value);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 dark:from-slate-900 dark:via-blue-900 dark:to-slate-900 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <Particles
          className="absolute inset-0"
          quantity={150}
          color="#3B82F6"
          size={1.2}
          staticity={30}
          ease={40}
        />
      </div>

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-transparent to-purple-600/10 dark:from-blue-600/20 dark:via-transparent dark:to-purple-600/20" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-50/50 to-slate-50/80 dark:via-slate-900/50 dark:to-slate-900/80" />

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col">

        {/* Hero Content - Adjusted spacing for navigation */}
        <div className="flex-1 flex items-center justify-center px-6 md:px-8 pt-8 lg:pt-12">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Column - Text Content */}
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="space-y-4">
                <motion.h2 
                  className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white leading-tight"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  Advanced
                  <span className="block bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                    Financial
                  </span>
                  Intelligence
                </motion.h2>
                
                <motion.p 
                  className="text-xl text-gray-600 dark:text-gray-300 max-w-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                >
                  Harness the power of AI-driven analytics, real-time market data, and advanced portfolio management tools to maximize your business potential.
                </motion.p>
              </div>

              {/* Portfolio Summary */}
              <motion.div
                className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Business Value</h3>
                  <button 
                    onClick={() => setShowBalance(!showBalance)}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors"
                  >
                    {showBalance ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                  </button>
                </div>
                
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">
                    {showBalance ? formatCurrency(portfolioData.totalValue) : '••••••••'}
                  </div>
                  <div className="flex items-center space-x-2">
                    {portfolioData.changePercent >= 0 ? (
                      <ArrowUpRight className="h-4 w-4 text-green-500" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4 text-red-500" />
                    )}
                    <span className={`text-sm font-medium ${
                      portfolioData.changePercent >= 0 ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {showBalance ? (
                        `${portfolioData.changePercent >= 0 ? '+' : ''}${formatCurrency(portfolioData.change24h)} (${portfolioData.changePercent.toFixed(2)}%)`
                      ) : '••••••'}
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                className="flex flex-col sm:flex-row gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.0 }}
              >
                <Link href="/sign-up">
                  <motion.button
                    className="gradient-blue text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center space-x-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Zap className="h-5 w-5" />
                    <span>Start Free Trial</span>
                  </motion.button>
                </Link>
                
                <Link href="/sign-in">
                  <motion.button
                    className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-900 dark:text-white px-8 py-4 rounded-xl font-semibold text-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/80 transition-all duration-300 flex items-center justify-center space-x-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Play className="h-5 w-5" />
                    <span>Sign In</span>
                  </motion.button>
                </Link>
              </motion.div>
            </motion.div>

            {/* Right Column - Interactive Elements */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {/* Floating Chart */}
              <FloatingElement delay={0} className="relative">
                <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-xl">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Performance</h3>
                    <BarChart3 className="h-5 w-5 text-blue-500" />
                  </div>
                  <AnimatedChart data={chartData} color="#3B82F6" height={120} />
                </div>
              </FloatingElement>

              {/* Asset Allocation */}
              <FloatingElement delay={0.5} className="relative">
                <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-xl">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Key Metrics</h3>
                    <PieChart className="h-5 w-5 text-purple-500" />
                  </div>
                  <div className="space-y-3">
                    {assets.map((asset, index) => (
                      <motion.div
                        key={asset.symbol}
                        className="flex items-center justify-between p-3 bg-gray-50/50 dark:bg-gray-800/50 rounded-lg"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 1.2 + index * 0.1 }}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="h-8 w-8 gradient-blue rounded-full flex items-center justify-center">
                            <span className="text-xs font-bold text-white">
                              {asset.symbol.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <div className="text-gray-900 dark:text-white font-medium">{asset.name}</div>
                            <div className="text-gray-600 dark:text-gray-400 text-sm">{asset.allocation}%</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-gray-900 dark:text-white font-medium">
                            {formatLargeNumber(asset.value)}
                          </div>
                          <div className={`text-sm ${
                            asset.change >= 0 ? 'text-green-500' : 'text-red-500'
                          }`}>
                            {asset.change >= 0 ? '+' : ''}{asset.change.toFixed(2)}%
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </FloatingElement>

              {/* Trust indicators */}
              <FloatingElement delay={1} className="relative">
                <div className="flex items-center justify-center space-x-4">
                  <div className="flex items-center space-x-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-200 dark:border-gray-700">
                    <Shield className="h-5 w-5 text-green-500" />
                    <span className="text-sm text-gray-900 dark:text-white">Bank-Level Security</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-200 dark:border-gray-700">
                    <Smartphone className="h-5 w-5 text-purple-500" />
                    <span className="text-sm text-gray-900 dark:text-white">Mobile Ready</span>
                  </div>
                </div>
              </FloatingElement>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}; 
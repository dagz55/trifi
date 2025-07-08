"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check, Zap, Star, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import GradientButton from "./gradient-button";

interface PricingCardProps {
  planName: string;
  description: string;
  price: string;
  originalPrice?: string;
  features: string[];
  buttonText: string;
  isPopular?: boolean;
  isRecommended?: boolean;
  onButtonClick?: () => void;
  className?: string;
  variant?: 'basic' | 'premium' | 'enterprise';
}

export const AnimatedPricingCard: React.FC<PricingCardProps> = ({
  planName,
  description,
  price,
  originalPrice,
  features,
  buttonText,
  isPopular = false,
  isRecommended = false,
  onButtonClick,
  className,
  variant = 'basic'
}) => {
  const variantStyles = {
    basic: {
      gradient: 'from-gray-50 to-white dark:from-gray-900 dark:to-gray-800',
      border: 'border-gray-200 dark:border-gray-700',
      accent: 'text-gray-900 dark:text-white',
      buttonVariant: 'secondary' as const
    },
    premium: {
      gradient: 'from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20',
      border: 'border-blue-200 dark:border-blue-800',
      accent: 'text-blue-900 dark:text-blue-100',
      buttonVariant: 'primary' as const
    },
    enterprise: {
      gradient: 'from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20',
      border: 'border-purple-200 dark:border-purple-800',
      accent: 'text-purple-900 dark:text-purple-100',
      buttonVariant: 'sunset' as const
    }
  };

  const currentVariant = variantStyles[variant];

  return (
    <motion.div
      className={cn(
        "relative group",
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      whileHover={{ y: -5 }}
    >
      {/* Popular Badge - Always takes priority and center position */}
      {isPopular && (
        <motion.div
          className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20"
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 300 }}
        >
          <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg flex items-center space-x-1">
            <Star className="h-3 w-3 fill-current" />
            <span>Most Popular</span>
          </div>
        </motion.div>
      )}

      {/* Recommended Badge - Only shows if not popular, or positioned differently if both are needed */}
      {isRecommended && !isPopular && (
        <motion.div
          className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20"
          initial={{ scale: 0, rotate: 10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 300 }}
        >
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg flex items-center space-x-1">
            <Zap className="h-3 w-3" />
            <span>Recommended</span>
          </div>
        </motion.div>
      )}
      
      {/* Secondary badge for when both popular and recommended */}
      {isRecommended && isPopular && (
        <motion.div
          className="absolute -top-1 right-4 z-10"
          initial={{ scale: 0, rotate: 10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 300 }}
        >
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-2 py-0.5 rounded-full text-xs font-medium shadow-md flex items-center space-x-1">
            <Zap className="h-2.5 w-2.5" />
            <span>Recommended</span>
          </div>
        </motion.div>
      )}

      {/* Main Card */}
      <motion.div
        className={cn(
          "relative backdrop-blur-sm rounded-3xl p-8 shadow-xl border-2",
          "bg-gradient-to-br",
          currentVariant.gradient,
          currentVariant.border,
          "transition-all duration-500 group-hover:shadow-2xl",
          isPopular ? "scale-105 ring-2 ring-orange-500/30 dark:ring-orange-400/30" : "",
          "overflow-hidden"
        )}
        whileHover={{ 
          boxShadow: isPopular 
            ? "0 25px 50px -12px rgba(251, 146, 60, 0.25), 0 0 0 1px rgba(251, 146, 60, 0.1)"
            : variant === 'premium'
            ? "0 25px 50px -12px rgba(59, 130, 246, 0.25), 0 0 0 1px rgba(59, 130, 246, 0.1)"
            : "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
        }}
      >
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-5 dark:opacity-10">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600"
            animate={{
              background: [
                "linear-gradient(0deg, #3B82F6, #8B5CF6, #EC4899)",
                "linear-gradient(360deg, #3B82F6, #8B5CF6, #EC4899)"
              ]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10">
          {/* Header */}
          <div className="mb-6">
            <motion.h3 
              className={cn("text-2xl font-bold mb-2", currentVariant.accent)}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              {planName}
            </motion.h3>
            <motion.p 
              className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              {description}
            </motion.p>
          </div>

          {/* Pricing */}
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
          >
            <div className="flex items-baseline space-x-2">
              <span className={cn("text-5xl font-extrabold tracking-tight", currentVariant.accent)}>
                {price}
              </span>
              {originalPrice && (
                <span className="text-lg text-gray-500 dark:text-gray-400 line-through">
                  {originalPrice}
                </span>
              )}
              <span className="text-gray-600 dark:text-gray-400 text-lg">/month</span>
            </div>
          </motion.div>

          {/* Features */}
          <motion.div 
            className="mb-8 space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="flex items-start space-x-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                <div className="flex-shrink-0 mt-0.5">
                  <motion.div
                    className="w-5 h-5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center"
                    whileHover={{ scale: 1.2, rotate: 360 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Check className="h-3 w-3 text-white" />
                  </motion.div>
                </div>
                <span className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                  {feature}
                </span>
              </motion.div>
            ))}
          </motion.div>

          {/* Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <GradientButton
              variant={currentVariant.buttonVariant}
              size="lg"
              onClick={onButtonClick}
              className="w-full group/button"
              animation={isPopular ? "glow" : "none"}
            >
              <span className="flex items-center justify-center space-x-2">
                <span>{buttonText}</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/button:translate-x-1" />
              </span>
            </GradientButton>
          </motion.div>
        </div>

        {/* Hover Shine Effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AnimatedPricingCard; 
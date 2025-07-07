"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BarChart3, 
  Calculator, 
  CreditCard, 
  Building2, 
  FileText, 
  PieChart,
  ArrowRight,
  Sparkles,
  Zap,
  Target,
  TrendingUp,
  Shield
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Feature {
  icon: React.ElementType;
  title: string;
  description: string;
  gradient: string;
  details: string[];
  benefits: string[];
}

const features: Feature[] = [
  {
    icon: BarChart3,
    title: "Financial Analytics",
    description: "Get comprehensive insights into your financial performance with real-time analytics and AI-powered reporting.",
    gradient: "gradient-purple",
    details: [
      "Real-time dashboard with live data updates",
      "Predictive analytics powered by machine learning",
      "Custom report builder with drag-and-drop interface",
      "Advanced data visualization and charting tools"
    ],
    benefits: [
      "Make data-driven decisions faster",
      "Identify trends and opportunities early",
      "Reduce manual reporting time by 80%"
    ]
  },
  {
    icon: Calculator,
    title: "Smart Accounting",
    description: "Automate your accounting processes with intelligent categorization and seamless reconciliation.",
    gradient: "gradient-blue",
    details: [
      "Automated transaction categorization using AI",
      "Bank reconciliation with one-click matching",
      "Smart duplicate detection and prevention",
      "Automated journal entry generation"
    ],
    benefits: [
      "Eliminate manual data entry errors",
      "Save 15+ hours per week on bookkeeping",
      "Ensure 99.9% accuracy in financial records"
    ]
  },
  {
    icon: CreditCard,
    title: "Payment Management",
    description: "Streamline payments, invoicing, and money transfers with secure, integrated solutions.",
    gradient: "gradient-green",
    details: [
      "Multi-currency payment processing",
      "Instant payment notifications and tracking",
      "Automated recurring payment handling",
      "Integrated payment gateway with low fees"
    ],
    benefits: [
      "Improve cash flow with faster payments",
      "Reduce payment processing costs by 30%",
      "Enhanced security with PCI compliance"
    ]
  },
  {
    icon: Building2,
    title: "Organization Management",
    description: "Manage your company structure, departments, and organizational hierarchy efficiently.",
    gradient: "gradient-orange",
    details: [
      "Visual organization chart builder",
      "Department budget allocation and tracking",
      "Role-based access control system",
      "Employee expense management portal"
    ],
    benefits: [
      "Streamline organizational oversight",
      "Improve budget control and allocation",
      "Enhanced security and compliance"
    ]
  },
  {
    icon: FileText,
    title: "Invoice & Billing",
    description: "Create professional invoices, track payments, and manage billing cycles seamlessly.",
    gradient: "gradient-red",
    details: [
      "Professional invoice templates library",
      "Automated invoice generation and sending",
      "Payment tracking with automated reminders",
      "Multi-language and multi-currency support"
    ],
    benefits: [
      "Get paid 40% faster with automated follow-ups",
      "Professional branding with custom templates",
      "Reduce billing errors to near zero"
    ]
  },
  {
    icon: PieChart,
    title: "Budget Tracking",
    description: "Monitor expenses, set budgets, and track financial goals with detailed breakdowns.",
    gradient: "gradient-indigo",
    details: [
      "Interactive budget vs. actual comparison",
      "Smart spending alerts and notifications",
      "Goal-based financial planning tools",
      "Variance analysis with explanatory insights"
    ],
    benefits: [
      "Stay within budget 95% of the time",
      "Achieve financial goals 3x faster",
      "Reduce unnecessary spending by 25%"
    ]
  }
];

export const FeatureShowcase: React.FC = () => {
  const [activeFeature, setActiveFeature] = useState<number>(0);
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  return (
    <section id="features" className="container mx-auto px-4 py-20">
      <div className="text-center mb-16 animate-fade-in">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-center mb-6"
        >
          <Sparkles className="h-8 w-8 text-yellow-500 mr-3" />
          <span className="text-lg font-semibold text-yellow-600 dark:text-yellow-400">
            Powerful Features
          </span>
        </motion.div>
        
        <motion.h2 
          className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-gradient"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Everything You Need to Manage Your Finances
        </motion.h2>
        
        <motion.p 
          className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          From basic accounting to advanced analytics, TriFi provides all the tools you need to 
          make informed financial decisions and drive business growth.
        </motion.p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12 items-start">
        {/* Feature List */}
        <div className="space-y-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const isActive = activeFeature === index;
            const isHovered = hoveredFeature === index;
            
            return (
              <motion.div
                key={index}
                className={cn(
                  "relative cursor-pointer rounded-2xl p-6 transition-all duration-300",
                  "border-2 backdrop-blur-sm",
                  isActive 
                    ? "bg-white/90 dark:bg-gray-900/90 border-blue-500 dark:border-blue-400 shadow-2xl" 
                    : "bg-white/50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-800 hover:bg-white/70 dark:hover:bg-gray-900/70"
                )}
                onClick={() => setActiveFeature(index)}
                onMouseEnter={() => setHoveredFeature(index)}
                onMouseLeave={() => setHoveredFeature(null)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {/* Active indicator */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      className="absolute left-0 top-1/2 w-1 h-16 bg-gradient-to-b from-blue-500 to-purple-500 rounded-r-full"
                      initial={{ height: 0, y: "-50%" }}
                      animate={{ height: 64, y: "-50%" }}
                      exit={{ height: 0, y: "-50%" }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </AnimatePresence>

                <div className="flex items-start space-x-4">
                  {/* Icon */}
                  <motion.div
                    className={cn(
                      "flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg",
                      feature.gradient,
                      isHovered && !isActive ? "animate-pulse-glow" : ""
                    )}
                    whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Icon className="h-7 w-7 text-white" />
                  </motion.div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className={cn(
                      "text-xl font-semibold mb-2 transition-colors",
                      isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-900 dark:text-white"
                    )}>
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      {feature.description}
                    </p>
                    
                    {/* Arrow indicator */}
                    <motion.div
                      className="flex items-center mt-3 text-blue-600 dark:text-blue-400"
                      animate={{ x: isActive ? 5 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <span className="text-sm font-medium mr-2">
                        {isActive ? "Selected" : "Learn more"}
                      </span>
                      <ArrowRight className="h-4 w-4" />
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Feature Detail Panel */}
        <div className="lg:sticky lg:top-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFeature}
              className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-gray-200 dark:border-gray-800"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Header */}
              <div className="flex items-start space-x-4 mb-8">
                <motion.div
                  className={cn("w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl", features[activeFeature].gradient)}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                >
                  {React.createElement(features[activeFeature].icon, { className: "h-8 w-8 text-white" })}
                </motion.div>
                <div>
                  <motion.h3
                    className="text-2xl font-bold text-gray-900 dark:text-white mb-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    {features[activeFeature].title}
                  </motion.h3>
                  <motion.p
                    className="text-gray-600 dark:text-gray-400"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    {features[activeFeature].description}
                  </motion.p>
                </div>
              </div>

              {/* Feature Details */}
              <motion.div
                className="mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex items-center mb-4">
                  <Target className="h-5 w-5 text-blue-500 mr-2" />
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Key Features</h4>
                </div>
                <div className="space-y-3">
                  {features[activeFeature].details.map((detail, index) => (
                    <motion.div
                      key={index}
                      className="flex items-start space-x-3"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                    >
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300 text-sm">{detail}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Benefits */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <div className="flex items-center mb-4">
                  <TrendingUp className="h-5 w-5 text-green-500 mr-2" />
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Business Benefits</h4>
                </div>
                <div className="space-y-3">
                  {features[activeFeature].benefits.map((benefit, index) => (
                    <motion.div
                      key={index}
                      className="flex items-start space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + index * 0.1 }}
                    >
                      <Zap className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-green-700 dark:text-green-300 text-sm font-medium">{benefit}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default FeatureShowcase; 
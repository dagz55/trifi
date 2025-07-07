"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AnimatedHeroSection } from "@/components/animated-hero-section"
import AnimatedPricingCard from "@/components/ui/animated-pricing-card"
import GradientButton from "@/components/ui/gradient-button"
import { 
  ArrowRight, 
  BarChart3, 
  Building2, 
  Calculator, 
  Check,
  CreditCard, 
  DollarSign, 
  FileText, 
  PieChart, 
  Play,
  Shield, 
  TrendingUp, 
  Users, 
  Wallet,
  Zap,
  Smartphone,
  Globe
} from "lucide-react"
import { SignInButton, SignUpButton } from "@clerk/nextjs"
import { useState } from "react"
import FeatureShowcase from "@/components/ui/feature-showcase"
import { LandingNav } from "@/components/landing-nav"
import { ClerkWrapper } from "@/components/ui/clerk-wrapper"

export function LandingPage() {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false)

  const features = [
    {
      icon: BarChart3,
      title: "Financial Analytics",
      description: "Get comprehensive insights into your financial performance with real-time analytics and AI-powered reporting.",
      gradient: "gradient-purple"
    },
    {
      icon: Calculator,
      title: "Smart Accounting",
      description: "Automate your accounting processes with intelligent categorization and seamless reconciliation.",
      gradient: "gradient-blue"
    },
    {
      icon: CreditCard,
      title: "Payment Management",
      description: "Streamline payments, invoicing, and money transfers with secure, integrated solutions.",
      gradient: "gradient-green"
    },
    {
      icon: Building2,
      title: "Organization Management",
      description: "Manage your company structure, departments, and organizational hierarchy efficiently.",
      gradient: "gradient-orange"
    },
    {
      icon: FileText,
      title: "Invoice & Billing",
      description: "Create professional invoices, track payments, and manage billing cycles seamlessly.",
      gradient: "gradient-red"
    },
    {
      icon: PieChart,
      title: "Budget Tracking",
      description: "Monitor expenses, set budgets, and track financial goals with detailed breakdowns.",
      gradient: "gradient-indigo"
    }
  ]

  const benefits = [
    {
      icon: Shield,
      title: "Bank-Level Security",
      description: "Your financial data is protected with enterprise-grade encryption and security measures.",
      color: "text-white"
    },
    {
      icon: TrendingUp,
      title: "Real-Time Insights",
      description: "Make informed decisions with live financial data and predictive analytics.",
      color: "text-white"
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Work together with your team on financial planning and management tasks.",
      color: "text-white"
    }
  ]

  const pricingPlans = [
    {
      planName: "Free",
      price: "₱0",
      description: "Perfect for individuals and small startups",
      features: [
        "Up to 50 transactions per month",
        "Basic financial reporting",
        "1 business account",
        "Email support",
        "Mobile app access",
        "Basic budget tracking"
      ],
      buttonText: "Get Started Free",
      variant: 'basic' as const,
      onButtonClick: () => {}
    },
    {
      planName: "Premium",
      price: "₱2,499",
      originalPrice: "₱3,499",
      description: "Ideal for growing businesses and teams",
      features: [
        "Unlimited transactions",
        "Advanced analytics & reporting",
        "Up to 5 business accounts",
        "Priority support",
        "API access",
        "Advanced budget tracking",
        "Invoice management",
        "Team collaboration (up to 10 users)",
        "Custom categories",
        "Export to Excel/PDF"
      ],
      isPopular: true,
      isRecommended: true,
      buttonText: "Start Premium Trial",
      variant: 'premium' as const,
      onButtonClick: () => {}
    },
    {
      planName: "Enterprise",
      price: "₱9,999",
      originalPrice: "₱12,999",
      description: "For large organizations with complex needs",
      features: [
        "Everything in Premium",
        "Unlimited business accounts",
        "Custom integrations",
        "Dedicated account manager",
        "24/7 phone support",
        "Advanced security features",
        "Custom reporting",
        "Unlimited team members",
        "SSO integration",
        "Audit trails",
        "White-label options",
        "On-premise deployment option"
      ],
      buttonText: "Contact Sales",
      variant: 'enterprise' as const,
      onButtonClick: () => handleContactSales()
    }
  ]

  const handleWatchDemo = () => {
    setIsVideoModalOpen(true)
  }

  const handleContactSales = () => {
    window.open('mailto:sales@trifi.com?subject=Enterprise%20Plan%20Inquiry', '_blank')
  }

  const testimonials = [
    {
      name: "Maria Santos",
      role: "CFO, TechStart Inc.",
      content: "TriFi transformed our financial management. The real-time insights and automated reporting saved us 20+ hours per week.",
      avatar: "MS"
    },
    {
      name: "John Rodriguez", 
      role: "Business Owner",
      content: "The Apple-style interface makes complex financial tasks feel simple. Our team adopted it immediately.",
      avatar: "JR"
    },
    {
      name: "Ana dela Cruz",
      role: "Accounting Manager",
      content: "Best financial platform we've used. The automation features and Philippine peso support are perfect for our business.",
      avatar: "AC"
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950" id="top">
      {/* Modern Top Navigation */}
      <LandingNav onWatchDemo={handleWatchDemo} />
      
      {/* Animated Hero Section */}
      <AnimatedHeroSection onWatchDemo={handleWatchDemo} />

      {/* Features Section */}
      <FeatureShowcase />

      {/* Testimonials Section */}
      <section className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold tracking-tight mb-6 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Trusted by Financial Professionals
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              See what business leaders are saying about TriFi
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="glass-card apple-hover bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-gray-200 dark:border-gray-800 shadow-xl">
                <CardContent className="pt-6">
                  <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed italic">
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 gradient-blue rounded-full flex items-center justify-center text-white font-bold shadow-md">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold tracking-tight mb-6 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Choose Your Plan
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Start with our free plan and upgrade as your business grows. All plans include our core features.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <AnimatedPricingCard
                key={index}
                planName={plan.planName}
                price={plan.price}
                originalPrice={plan.originalPrice}
                description={plan.description}
                features={plan.features}
                isPopular={plan.isPopular}
                isRecommended={plan.isRecommended}
                buttonText={plan.buttonText}
                variant={plan.variant}
                onButtonClick={plan.onButtonClick}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-gradient-to-bl from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold tracking-tight mb-6 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Why Choose TriFi?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Built for businesses of all sizes with enterprise-grade features and security.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="w-20 h-20 gradient-blue rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                  <benefit.icon className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">{benefit.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            Ready to Transform Your Financial Management?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-12">
            Join thousands of businesses that trust TriFi to manage their finances efficiently and securely.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <ClerkWrapper
              fallback={
                <GradientButton
                  variant="primary"
                  size="lg"
                  className="text-lg px-8 py-4 h-auto opacity-75"
                  disabled
                >
                  <span className="flex items-center space-x-2">
                    <span>Get Started Free</span>
                    <ArrowRight className="h-5 w-5" />
                  </span>
                </GradientButton>
              }
            >
              <SignUpButton mode="modal">
                <GradientButton
                  variant="primary"
                  size="lg"
                  className="text-lg px-8 py-4 h-auto"
                  animation="glow"
                >
                  <span className="flex items-center space-x-2">
                    <span>Get Started Free</span>
                    <ArrowRight className="h-5 w-5" />
                  </span>
                </GradientButton>
              </SignUpButton>
            </ClerkWrapper>
            <ClerkWrapper
              fallback={
                <GradientButton
                  variant="secondary"
                  size="lg"
                  className="text-lg px-8 py-4 h-auto opacity-75"
                  disabled
                >
                  Sign In
                </GradientButton>
              }
            >
              <SignInButton mode="modal">
                <GradientButton
                  variant="secondary"
                  size="lg"
                  className="text-lg px-8 py-4 h-auto"
                >
                  Sign In
                </GradientButton>
              </SignInButton>
            </ClerkWrapper>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 gradient-blue rounded-xl flex items-center justify-center shadow-md">
                  <DollarSign className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">TriFi</span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Your trusted partner for comprehensive financial management and business growth.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-gray-900 dark:text-white">Product</h4>
              <ul className="space-y-3 text-gray-600 dark:text-gray-400">
                <li><a href="#features" className="hover:text-gray-900 dark:hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-gray-900 dark:hover:text-white transition-colors">Pricing</a></li>
                <li><a href="/api" className="hover:text-gray-900 dark:hover:text-white transition-colors">API</a></li>
                <li><button onClick={handleWatchDemo} className="hover:text-gray-900 dark:hover:text-white transition-colors">Demo</button></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-gray-900 dark:text-white">Company</h4>
              <ul className="space-y-3 text-gray-600 dark:text-gray-400">
                <li><a href="mailto:info@trifi.com" className="hover:text-gray-900 dark:hover:text-white transition-colors">About</a></li>
                <li><a href="/blog" className="hover:text-gray-900 dark:hover:text-white transition-colors">Blog</a></li>
                <li><a href="mailto:careers@trifi.com" className="hover:text-gray-900 dark:hover:text-white transition-colors">Careers</a></li>
                <li><a href="mailto:contact@trifi.com" className="hover:text-gray-900 dark:hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-gray-900 dark:text-white">Support</h4>
              <ul className="space-y-3 text-gray-600 dark:text-gray-400">
                <li><a href="/help" className="hover:text-gray-900 dark:hover:text-white transition-colors">Help Center</a></li>
                <li><a href="/docs" className="hover:text-gray-900 dark:hover:text-white transition-colors">Documentation</a></li>
                <li><a href="https://community.trifi.com" className="hover:text-gray-900 dark:hover:text-white transition-colors">Community</a></li>
                <li><a href="https://status.trifi.com" className="hover:text-gray-900 dark:hover:text-white transition-colors">Status</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-200 dark:border-gray-800 mt-12 pt-8 text-center text-gray-600 dark:text-gray-400">
            <p>&copy; 2025 TriFi. All rights reserved. Built with ♥ for Filipino businesses.</p>
          </div>
        </div>
      </footer>

      {/* Video Demo Modal */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-800">
            <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-800">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">TriFi Demo</h3>
              <Button 
                variant="ghost" 
                onClick={() => setIsVideoModalOpen(false)}
                className="h-8 w-8 p-0 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                ✕
              </Button>
            </div>
            <div className="p-6">
              <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-2xl flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 gradient-blue rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                    <Play className="h-10 w-10 text-white" />
                  </div>
                  <p className="text-gray-900 dark:text-white text-lg font-semibold mb-2">Demo video coming soon!</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Experience the power of TriFi's Apple-style financial management platform
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 